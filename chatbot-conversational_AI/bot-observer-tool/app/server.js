const express = require('express');
const     sql = require('mssql');
const     got = require('got');
const     app = express();


/********************************************************
 *  main API endpoint                                   *
 ********************************************************/

app.get('/', (req, res) => {
  res.send({
    message: 'Here you can see which API endpoints are available',
    endpoints: [
      {method: 'GET', path: '/bot', description: 'Shows the whole knowledge of the bot. It lists all answers and corresponding questions.'},
      {method: 'GET', path: '/botcredentials', description: 'Shows the automatically requested credentials for SAP CAI'},
      {method: 'GET', path: '/stack', description: 'Lists all Questions from Stack that are tagged with [kyma-runtime].'},
      {method: 'GET', path: '/db', description: 'Shows the linking database that stores the questions from Stack and the related bot knowledge.'}
    ],
  });
});



/********************************************************
 *  Bot Data - Endpoints '/bot' and '/botcredentials'   *
 ********************************************************/

var cai_credentials = null;
 
const cai_credentials_url = 'https://sapcai-community.authentication.eu10.hana.ondemand.com/oauth/token';
const post_data = 'grant_type=client_credentials&client_id=' + process.env.CAI_CREDENTIALS_ID + '&client_secret=' + process.env.CAI_CREDENTIALS_SECRET;
const options_credentials = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': post_data.length
  },
  body: post_data
};

const bot_url = 'https://api.cai.tools.sap/train/v2/users/' + process.env.BOT_URL;
var options_bot = {
  method: 'GET',
  json: true,
  headers: {
      'Authorization': '',
      'X-Token': 'Token ' + process.env.X_TOKEN
  }
};

async function generateCrendentials() {
  try {
    const result = await got.post(cai_credentials_url, options_credentials);
    result_json = JSON.parse(result.body);
    options_bot.headers.Authorization = 'Bearer ' + result_json.access_token;                           // insert the access token into the bot_options
    result_json.expires_at_GMT = Date.now() + 43199000;                                                 // compute the token expiration date
    result_json.expires_at_GMT_readable = new Date(result_json.expires_at_GMT);
    return result_json;
  } catch(err) {
    console.log("An Error has occurred during requesting the sap cai credentials");
    console.error(err);
    return null;
  }
}

// Endpoint '/botcredentials'
app.get('/botcredentials', async (req, res) => {
  if (cai_credentials == null) {
    cai_credentials = await generateCrendentials();
  }
  res.send(cai_credentials);
});

// Endpoint '/bot'
app.get('/bot', async (req, res) => {
  if (cai_credentials == null || (cai_credentials.expires_at_GMT - Date.now() < 3600000)) {   // CAI credentials expire after 24 hours; therefore, the must be requested again after a certain time
    cai_credentials = await generateCrendentials();
  }

  try {
    const result = await got(bot_url, options_bot);
    res.send(result.body.results);
  } catch(err) {
    console.log("An Error has occurred during requesting the bot knowledge");
    console.error(err);
  }
});



/********************************************************
 *  Stack Data - Endpoint '/stack'                      *
 ********************************************************/

const stack_url = 'https://sap.stackenterprise.co/api/2.2/search/advanced?tagged=' + process.env.STACK_TAG + '&pagesize=100&key=' + process.env.STACK_KEY;
const options_stack = {
  method: 'GET',
  json: true
};

app.get('/stack', async (req, res) => {
  try {
    // An API call can fetch max 100 entries per page. It must be checked if there is more data available (see: https://api.stackexchange.com/docs/paging)
    var pagenumber = 1;
    var result = await got(stack_url, options_stack);
    var allQuestions = result.body;
    var moreDataAvailable_flag = allQuestions.has_more;

    while (moreDataAvailable_flag) {
      pagenumber = pagenumber + 1;
      result = await got(stack_url  + '&page=' + pagenumber, options_stack);
      result.body.items.forEach(element => allQuestions.items.push(element));
      moreDataAvailable_flag = result.body.has_more;
    }

    res.send(allQuestions);
  } catch(err) {
    console.log("An Error has occurred during requesting the stack knowledge labeled with " + process.env.STACK_TAG + ". Maybe it is a problem with concatenating multiple pages of questions because max pagesize exceeded.");
    console.error(err);
  }
});



/********************************************************
 *  Database Data - Endpoint '/db'                      *
 ********************************************************/

 const database_config = {
  database: process.env.DB_NAME,
  server: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  trustServerCertificate: true
};

app.get('/db', async (req, res) => {
  const pool = await sql.connect(database_config);
  const db_request = new sql.Request();

  try {
    const result = await db_request.query('select * from Questions')
    res.send(result.recordsets[0]);
  } catch(err) {
    console.log("An Error has occurred during requesting the database content");
    console.error(err);
  }
});


/********************************************************
 *  Node.js server                                      *
 ********************************************************/

const port = process.env.PORT || 3000;
app.listen(port, () => {
   console.log("App listening at internal endpoint bot-observer-service.test-db: %s", port);
});