const sql = require('mssql');
const got = require('got');
const axios = require("axios");
const TurndownService = require('turndown');

async function main() {
  var sqlconnection = await sql.connect(database_config);
  const db_request = new sql.Request();

  const [stackData, dbData, caiCredentials] = await Promise.all([get_stackQuestions(), get_dbData(db_request), get_caiCredentials()]);
  var update_all_questions = false;
  if ('UPDATE_ALL' in process.env && process.env.UPDATE_ALL == 'Y') {
    console.log("Clean up CAI");
    await clean_up_cai(dbData, caiCredentials.access_token);

    update_all_questions = true;
    console.log("Updating all questions.");
  }
  console.log("********************************** all knowledge received **********************************")

  for (let counter = 0; counter < stackData.items.length; counter++) {
    // Choose the next question from Stack
    stackQuestion = stackData.items[counter];
    var stack_q_id = stackQuestion.question_id;

    // Check if the question is already in the database
    var q_in_db_flag = 0;
    var id_in_db = -1;
    for (let i = 0; i < dbData.length; i++) {
      if (stack_q_id == dbData[i].stack_q_id) {
        q_in_db_flag = 1;
        id_in_db = i;
        break;
      }
    }
    if (q_in_db_flag == 1) {
      console.log(`${new Date().toISOString()}: Question (ID=${stack_q_id}) was found in mssql db at index ${id_in_db}`);
    }
    else {
      console.log(`${new Date().toISOString()}: Question (ID=${stack_q_id}) was not found in mssql db.`);
    }

    // If (question is not in database but answered) or all questions should be updated
    if ((q_in_db_flag == 0 && stackQuestion.is_answered) || (update_all_questions && stackQuestion.is_answered)) {
      var answers = await get_stackAnswers(stackQuestion.question_id);
      var questionText = stackQuestion.title;
      var questionLink = stackQuestion.link;
      var bestAnswer = answers.items[0];
      var answerText = bestAnswer.body;

      var stack_q_ts = stackQuestion.last_activity_date;
      var stack_a_id = bestAnswer.answer_id;
      var stack_a_ts = bestAnswer.last_edit_date ? bestAnswer.last_edit_date : bestAnswer.creation_date;
      var cai_q_id = null;
      var cai_a_id = null;


      // Question is already in the database and needs to be updated (tested on 20210910)
      var q_update_flag = 0;
      if (q_in_db_flag == 1 && (dbData[id_in_db].stack_q_ts != stack_q_ts || dbData[id_in_db].stack_a_ts != stack_a_ts)) {
        console.log(`${new Date().toISOString()}: Deleting Question (ID=${dbData[id_in_db].id_num}) from CAI and mssql, because it is already in the dbs but was updated (or received new answer).`);
        try { // Delete it from the database and CAI
          await delete_caiEntry(dbData[id_in_db].cai_a_id, caiCredentials.access_token);
          await db_request.query(`delete from Questions where id_num = '${dbData[id_in_db].id_num}'; `);
          q_update_flag = 1;
        } catch (err) {
          console.log(`${new Date().toISOString()}: An Error has occurred during deleting a Question/Answer pair (CAI_ANSWER_ID=${dbData[id_in_db].cai_a_id}; MSSQL_ID=${dbData[id_in_db].id_num}) in SAP CAI and the internal DB`);
          throw err;
        }
      }

      // Question is not in database or must be updated (was deleted and must be added again)
      if (q_in_db_flag == 0 || q_update_flag == 1) {
        try {
          console.log(`${new Date().toISOString()}: Add answer to CAI (${answerText.substring(0, 50)})`);
          var arrTuple = await add_caiAnswer(answerText, questionLink, caiCredentials.access_token);
          var caiAnswerResult = arrTuple[0];
          var errValue = arrTuple[1];
          console.log("Answer from CAI: " + caiAnswerResult);
          if (errValue === null) {
            cai_a_id = caiAnswerResult.results.id;
            console.log(`${new Date().toISOString()}: Add question (for answer ID=${cai_a_id}) to CAI (${questionText})`);
            var caiQuestionResult = await add_caiQuestion(questionText, cai_a_id, caiCredentials.access_token);
            cai_q_id = caiQuestionResult.results.id;
            console.log("Insert entry in mssql: stack_q_id=${stack_q_id}, stack_a_id=${stack_a_id}, cai_q_id=${cai_q_id}, cai_a_id=${cai_a_id}");
            await db_request.query(`insert into Questions (stack_q_id, stack_q_ts, stack_a_id, stack_a_ts, cai_q_id, cai_a_id) values ('${stack_q_id}', '${stack_q_ts}', '${stack_a_id}', '${stack_a_ts}', '${cai_q_id}', '${cai_a_id}'); select * from Questions where stack_q_id = '${stack_q_id}'`);
          }
        } catch (err) {
          console.log(`${new Date().toISOString()}: An Error has occurred during adding a new Question/Answer pair to SAP CAI and the internal DB`);
          throw err;
        }
      }
    }
    // Question is in database, but not answered (anymore)
    else if (q_in_db_flag == 1 && !stackQuestion.is_answered) {
      try { // Delete it from the database and CAI
        await delete_caiEntry(dbData[id_in_db].cai_a_id, caiCredentials.access_token);
        await db_request.query(`delete from Questions where id_num = '${dbData[id_in_db].id_num}'`);
      } catch (err) {
        console.log(`${new Date().toISOString()}: An Error has occurred during deleting a Question/Answer pair (CAI_ANSWER_ID=${dbData[id_in_db].cai_a_id}; MSSQL_ID=${dbData[id_in_db].id_num}) in SAP CAI and the internal DB (it was deleted because it was deleted in Stack Overflow)`);
        throw err;
      }
      console.log(`${new Date().toISOString()}: A question (CAI_ANSWER_ID=${dbData[id_in_db].cai_a_id}; MSSQL_ID=${dbData[id_in_db].id_num}) was deleted from Stack Overflow and hence in the bot.`);
    }
  }

  await sqlconnection.close();
  console.log(`${new Date().toISOString()}: done`);
  process.exit(0);
}

/********************************************************
 *  Alert Notification function                         *
 ********************************************************/

async function sendAlert(details, subject="", severity="", category="") {
  var data = {
    email_header: subject,
    severity: severity,
    category: category,
    details: details
  };
  console.log("Send alert: " + JSON.stringify(data));
  await axios.post(process.env.ALERT_NOTIF_SRV, data, {})
    .then(() => {
      console.log("--------Submitted error event to Alert Notification--------");
    })
    .catch((error) => {
      console.log("--------a sendAlert error occurred-------- ", error.message);
    });
}


/********************************************************
 *  Stack Data                                          *
 ********************************************************/

const stack_config = { json: true };

async function get_stackQuestions() {
  try {
    // An API call can fetch max 100 entries per page. It must be checked if there is more data available (see: https://api.stackexchange.com/docs/paging)
    var pagenumber = 1;
    var stack_url_questions = process.env.STACK_URL + '/search/advanced?tagged=' + process.env.STACK_TAG + '&pagesize=100&page=' + pagenumber + '&filter=withbody&key=' + process.env.STACK_KEY;
    var result = await stack_request(stack_url_questions, stack_config);
    var allQuestions = result.body;
    var moreDataAvailable_flag = allQuestions.has_more;

    while (moreDataAvailable_flag) {
      pagenumber = pagenumber + 1;
      stack_url_questions = process.env.STACK_URL + '/search/advanced?tagged=' + process.env.STACK_TAG + '&pagesize=100&page=' + pagenumber + '&filter=withbody&key=' + process.env.STACK_KEY;
      result = await stack_request(stack_url_questions, stack_config);
      result.body.items.forEach(element => allQuestions.items.push(element));
      moreDataAvailable_flag = result.body.has_more;
    }

    return allQuestions;
  } catch (err) {
    console.log(`${new Date().toISOString()}: An Error has occurred during requesting the stack questions labeled with ${process.env.STACK_TAG}. Maybe it is a problem with concatenating multiple pages of questions because max pagesize exceeded.`);
    //await sendAlert(err, "Failed in get_stackQuestions");
    await sendAlert(`${new Date().toISOString()}: An Error has occurred during requesting the stack questions labeled with ${process.env.STACK_TAG}. Maybe it is a problem with concatenating multiple pages of questions because max pagesize exceeded.`, "Failed in get_stackQuestions");
    throw err;
  }
}

async function get_stackAnswers(question_id) {
  const stack_url_answers = process.env.STACK_URL + '/questions/' + question_id + '/answers?pagesize=100&filter=withbody&sort=votes&key=' + process.env.STACK_KEY;
  try {
    const result = await stack_request(stack_url_answers, stack_config);
    return result.body;
  } catch (err) {
    console.log(`${new Date().toISOString()}: An Error has occurred during requesting the stack answer to question ${question_id}`);
    //await sendAlert(err, "Failed to get_stackAnswers");
    await sendAlert(`${new Date().toISOString()}: An Error has occurred during requesting the stack answer to question ${question_id}`, "Failed to get_stackAnswers");
    throw err;
  }
}

async function stack_request(url, config) {
  try {
    console.log(`${new Date().toISOString()}: STACK_REQUEST: ${url}`);
    const result = await got(url, config);
    // application must wait some seconds if backoff-field in response is set
    // otherwise a throttle-violation is raised
    if ("backoff" in result.body) {
      var backoff_seconds = result.body["backoff"];
      console.log(`${new Date().toISOString()}: Backoff response received from Stack! Duration: ${backoff_seconds} seconds`);
      // add some offset (2 seconds) to be sure that the backoff is long enough.
      // the stack server does not measure the time differences very accurately (and not in favor of the client)
      await new Promise(r => setTimeout(r, (backoff_seconds+2) * 1000));
      console.log(`${new Date().toISOString()}: Backoff finsihed!`);
    }
    return result;
  } catch(err) {
    console.log(`${new Date().toISOString()}: Error in stack_request!\nURL: ${url}`);
    //await sendAlert(err, "Failed to stack_request");
    await sendAlert(`${new Date().toISOString()}: Error in stack_request!\nURL: ${url}`, "Failed to stack_request");
    throw err;
  }
}



/********************************************************
 *  Database Data                                       *
 ********************************************************/

const database_config = {
  database: process.env.DB_NAME,
  server: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  trustServerCertificate: true
};

async function get_dbData(db_request) {
  try {
    const result = await db_request.query('select * from Questions');
    return result.recordsets[0];
  } catch (err) {
    console.log("An Error has occurred during requesting the database content");
    //await sendAlert(err, "Failed to get_dbData");
    await sendAlert("An Error has occurred during requesting the database content", "Failed to get_dbData");
    throw err;
  }
}



/********************************************************
 *  SAP CAI                                             *
 ********************************************************/
const cai_credentials_url = process.env.CAI_CREDENTIALS_URL;
const post_data = 'grant_type=client_credentials&client_id=' + process.env.CAI_CREDENTIALS_ID + '&client_secret=' + process.env.CAI_CREDENTIALS_SECRET;
const cai_config = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': post_data.length
  },
  body: post_data
};

async function get_caiCredentials() {
  try {
    const result = await got(cai_credentials_url, cai_config);
    return JSON.parse(result.body);
  } catch (err) {
    console.log("An Error has occurred during requesting the cai credentials");
    //await sendAlert(err, "Failed to get_caiCredentials");
    await sendAlert("An Error has occurred during requesting the cai credentials", "Failed to get_caiCredentials");
    throw err;
  }
}

/********************************************************/
const cai_request_url = process.env.BOT_URL;
const cai_request_config = {
  headers: {
    'Authorization': '',
    'X-Token': 'Token ' + process.env.X_TOKEN,
    'Content-Type': 'application/json'
  },
  body: '{"value": "string1"}'
};

async function add_caiAnswer(answerText, questionLink, access_token) {
  try {
    cai_request_config.headers.Authorization = 'Bearer ' + access_token;

    // convert html to markdown
    var turndownService = new TurndownService();
    var markdown = turndownService.turndown(answerText);

    // convert markdown links to slack links: [text](url) to <url|text>
    var slackFormat = markdown.replace(/\[(.*?)\]\((.*?)\)/g, (_, text, url) => `<${url}|${text}>`);
    slackFormat = slackFormat.replace(/\#\#\#/g, '');
    slackFormat = slackFormat.replace(/\*\*/g, '\*');

    // add the Link to Stack Overflow to the Answer
    if (slackFormat.length > 1800) { // answer is too long
      // cut the answer to max four sentences and max 1800 characters
      finalFormat = "\n" + slackFormat.substring(0, Math.min(slackFormat.split('. ', 4).join('. ').length + 1, 1800)) + " ... " + " <" + questionLink + "/|[See more]>";
    } else {
      var finalFormat = "\n" + slackFormat + "\n\n" + "For more help, please click <" + questionLink + "/|here> to go directly to this question on Stack Overflow.";
    }

    var finalAnswerString = JSON.stringify(finalFormat);
    if (finalAnswerString.length > 2500) {
      finalAnswerString = finalAnswerString.substring(0, 2500);
    }
    cai_request_config.body = '{"value": ' + finalAnswerString + '}';
    const result = await got.post(cai_request_url, cai_request_config);
    return [JSON.parse(result.body), null];
  } catch (err) {
    console.log("An Error has occurred during adding an answer to SAP CAI");
    console.log(`cai_request_url=${cai_request_url}; finalAnswerString=${finalAnswerString}`);
    //await sendAlert(err, "Failed to add_caiAnswer");
    await sendAlert(`An Error has occurred during adding an answer to SAP CAI: cai_request_url=${cai_request_url}; finalAnswerString=${finalAnswerString}`, "Failed to add_caiAnswer");
    //throw err;
    return [null, err];
  }
}

async function add_caiQuestion(questionText, answerID, access_token) {
  try {
    cai_request_config.headers.Authorization = 'Bearer ' + access_token;
    questionText = questionText.replace(/\&quot\;/g, "\"");
    questionText = questionText.replace(/.com\/\?/g, ".com? ");

    cai_request_config.body = '{"value": ' + JSON.stringify(questionText) + ', "display": "true"}';
    cai_request_url_with_question = cai_request_url + '/' + answerID + '/questions';
    const result = await got.post(cai_request_url_with_question, cai_request_config);
    return JSON.parse(result.body);
  } catch (err) {
    console.log("An Error has occurred during adding a question to SAP CAI");
    //await sendAlert(err, "Failed to add_caiQuestion");
    await sendAlert("An Error has occurred during adding a question to SAP CAI", "Failed to add_caiQuestion");
    throw err;
  }
}

async function delete_caiEntry(answerID, access_token) {
  try {
    cai_request_config.headers.Authorization = 'Bearer ' + access_token;
    cai_request_url_with_id = cai_request_url + '/' + answerID;
    const result = await got.delete(cai_request_url_with_id, cai_request_config);
    return JSON.parse(result.body);
  } catch (err) {
    console.log("An Error has occurred during deleting a question from SAP CAI");
    await sendAlert("Failed to delete_caiEntry");
    throw err;
  }
}

async function clean_up_cai(mssql_db_data, access_token) {
  // get all CAI indices stored in mssql database
  var mssql_indices = [];
  for (let i = 0; i < mssql_db_data.length; i++) {
    mssql_indices.push(mssql_db_data[i].cai_a_id);
  }
  console.log(`[CLEAN_CAI] Found ${mssql_indices.length} indices of answers in mssql db. `);

  // get all indices stored in CAI
  var cai_indices;
  cai_indices = await get_all_CAI_indices(access_token);
  console.log(`[CLEAN_CAI] Found ${cai_indices.length} indices of answers in CAI. `);

  // filter list of indices to get list of unused CAI entries
  var unused_indices_in_CAI = cai_indices.filter(x => !mssql_indices.includes(x));
  console.log(`[CLEAN_CAI] There are ${unused_indices_in_CAI.length} unused indices in CAI that will be deleted. `)

  // delete unused CAI entries
  unused_indices_in_CAI.forEach(index => {
    console.log(`[CLEAN_CAI] Delete ${index} from CAI. `);
    delete_caiEntry(index, access_token);
  });
}

async function get_all_CAI_indices(access_token) {
  var cai_answer_indices = [];

  // get all questions and answers from CAI and extract IDs
  var pagenumber = 1;
  var cai_answers_url = process.env.BOT_URL + '?page=';
  cai_request_config.headers.Authorization = 'Bearer ' + access_token;
  var result;
  var number_of_items = -1;

  try {
    await fetch_CAI_data();

    while (number_of_items > 0) {
      pagenumber += 1;
      await fetch_CAI_data();
    }
  }
  catch (err) {
    console.log("An Error has occurred during requesting answer indices from SAP CAI");
    //await sendAlert(err, "Failed to get_all_CAI_indices");
    await sendAlert("An Error has occurred during requesting answer indices from SAP CAI", "Failed to get_all_CAI_indices");
    throw err;
  }

  return cai_answer_indices;

  async function fetch_CAI_data() {
    var http_result = await got.get(cai_answers_url + pagenumber, cai_request_config);
    result = JSON.parse(http_result.body);
    if (number_of_items == -1) {
      number_of_items = result['results']['count'];
    }
    result['results']['answers'].forEach(answer => {
      cai_answer_indices.push(answer['id']);
      number_of_items -= 1;
    });
  }
}


main();
