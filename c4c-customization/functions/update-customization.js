var qs = require('qs');
const axios = require('axios');


module.exports = { main: async function (event, context) {
    var d = qs.parse(event.data)
    var sArray = d.text.split(" ")
    var id = sArray[0]
    var state = sArray[sArray.length-1]

    stateObject = {'Status': '0'}
    switch (state) {
        case 'process':
            stateObject.Status = '2';
            break;
        case 'cancel':
            stateObject.Status = '4';
            break;
        case 'complete':
            stateObject.Status = '3';
            break;
        default:
            throw new Error("Wrong task type")
    }
    var comment = d.text.replace(new RegExp("^"+id+" "), "").replace(new RegExp(" "+state+"$"), "")
    new Promise(async function(resolve, reject){
        console.log("Get TasksCollection")
        resp = await axios.get(`${process.env.GATEWAY_URL}/TasksCollection?$filter=ID eq '${id}'`)
        tCol = resp.data
        if(tCol.d.results.length > 1){
            reject("Too many tasks found")
        }
        
        taskObjectURL = `${process.env.GATEWAY_URL}/TasksCollection('${tCol.d.results[0].ObjectID}')`
        
        try{
            console.log("Patch task Object")
            await axios.patch(taskObjectURL, stateObject)
            console.log("Get TasksTextCollection")
            resp = await axios.get(`${taskObjectURL}/TasksTextCollection`)
            textCol = resp.data
            if (textCol.d.results.length >= 1){
                textPatchObject = {
                    Text: `${textCol.d.results[0].Text}\n${comment}`
                }
                console.log("Patch TasksTextCollectionCollection")
                await axios.patch(`${process.env.GATEWAY_URL}/TasksTextCollectionCollection('${textCol.d.results[0].ObjectID}')`, textPatchObject)
            } else {
                textPostObject = {
                    "ParentObjectID": tCol.d.results[0].ObjectID,
                    "Text": `${comment}`,
                    "TypeCode": "10002",
                    "AuthorName": d.user_name
                }
                console.log("Post TasksTextCollectionCollection")
                await axios.post(`${process.env.GATEWAY_URL}/TasksTextCollectionCollection`, textPostObject)

            }
        } catch(err) {
            reject(err)
        }
        resolve()
    }).then(async function(){
        console.log("Send Success")
        resp = { "text": `Task #${id} updated`,
                "attachments": [
                    {
                        "text":`${state} - ${comment}`
                    }
                ]
        }
        await axios.post(d.response_url, resp)

    },async function(err){
        console.log("Send error")
        resp = { "text": `Task #${id} updated failed`,
            "attachments": [
                {
                    "text":`${err}`
                }
            ]
        }
        await axios.post(d.response_url, resp)
    })


    return
} }