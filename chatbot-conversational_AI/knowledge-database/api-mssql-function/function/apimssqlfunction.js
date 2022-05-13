const sql = require('mssql')

const config = {
    user: process.env.username,
    password: process.env.password,
    server: process.env.host, 
    database: process.env.database,
}

module.exports = { 
  main: async function (event, context) {
    try {
      const method = event.extensions.request.method
      const id_num = event.extensions.request.path.split("/")[1];
      const pool = await sql.connect(config)
      const request = new sql.Request()
      
      switch(method) {
        case "GET":
          if(id_num){
            return await getQuestion(request, id_num);
          }else{
            return await getQuestions(request);
          } 
        case "POST":
          return await addQuestion(request, event.data);
        case "DELETE":
          return await deleteQuestion(request, id_num);
        default:
          event.extensions.response.status(500).json({"message": "Unhandled method was received", "error": "Unhandled method was received"});
      }
    } catch (err) {
        // ... error checks
        console.log("ERROR catch: ", err);
        event.extensions.response.status(500).json({"message": "An error occurred during execution", "error": err});
    }
    
    sql.on('error', err => {
      // ... error handler
      console.log("ERROR handler: ", error);
      event.extensions.response.status(500).json({"message": "Connection to the database could not be established", "error": err});
    })
  }
}

async function getQuestions(request){
  try{
    let result = await request.query('select * from Questions')
    return result.recordsets[0];
  }catch(err){
    throw err;
  }
}

async function getQuestion(request, id_num){
  try{
    let result = await request.query(`select * from Questions where id_num = '${id_num}'`)
    return result.recordsets[0];
  }catch(err){
    throw err;
  }
}

async function addQuestion(request, data){
  try{
    let result = await request.query(`insert into Questions (stack_q_id, stack_q_ts, stack_a_id, stack_a_ts, cai_q_id, cai_a_id) values ('${data.stack_q_id}', '${data.stack_q_ts}', '${data.stack_a_id}', '${data.stack_a_ts}', '${data.cai_q_id}', '${data.cai_a_id}'); select * from Questions where stack_q_id = '${data.stack_q_id}'`);
    return result.recordsets[0];
  }catch(err){
    throw err
  }
}

async function deleteQuestion(request, id_num){
  try{
    let result = await request.query(`delete from Questions where id_num = '${id_num}'`);
    return result.rowsAffected;
  }catch(err){
    throw err
  }
}

