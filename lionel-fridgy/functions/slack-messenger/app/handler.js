/*
    File:        handler.js
    Authors:     Jano Hanzlik, Alexander Weers, Cansu Doganay
    Date:        15th of September 2022
    Description: This is a serverless kyma function that sends a message to a slack
                 webhook when a specific event is being triggered.
*/
const axios = require("axios");

// This is the serverless function
module.exports = { main: function (event, context) {
    // getting the url for the webhook and the web ui from the event of the computation unit
    var webhook_url = process.env.WEBHOOK_URL;
    var webui_url = process.env.WEBUI_URL;

    // extract the amount of bottles and the alert level for each floor
    const bottles_floor = event.data.bottles_floors;
    const alert_levels = event.data.alarm_floors;

    try
    {
        if(alert_levels != null)
        {
            // preprocess the floors and filter out the ones that should be warned and alerted
            var warned_floors = preprocessFloors(alert_levels, compareState=1)
            var alerted_floors = preprocessFloors(alert_levels, compareState=0)

            // generate the message
            var message = createMessage(warned_floors, alerted_floors, bottles_floor, webui_url);

            // send the message to the slack channel
            sendSlackMessage(message, webhook_url);
        }
    }
    catch(err)
    {
        console.log("An error occurred - " + err);
    }

    return
    }
}

// @name:        preprocessFloors
// @description: This function extracts the floors that have to be alerted or warned
// @args:        -alert_levels   [type: array of number]: gives information about the floors that have to be alerted
//               -compareState   [type: number]: 1 if comparing for warning state, 0 if comparing for alerting state
// @return:      -alerted_floors [type: array of number]: gives indices of floors to be warned or alerted
function preprocessFloors(alert_levels, compareState){
    const alerted_floors = [];

    for(let i = 0; i < alert_levels.length; i++)
    {
        if(alert_levels[i] == compareState)
        {
            alerted_floors.push(i + 1);
        }
    }

    return alerted_floors;
}

// @name:        createMessage
// @description: This function creates a message in string format that can be sent to the slack webhook
// @args:        -warned_floors  [type: array of number]: gives information about the floors that have to be warned 
//               -alerted_floors [type: array of number]: gives information about the floors that have to be alerted
//               -bottles_floor  [type: array of number]: gives information about the amount of bottles on each floor
//               -webui_url      [type: string]: url of the web ui
// @return:      -message        [type: string]: summarizes the amount of bottles and alerted floors 
function createMessage(warned_floors, alerted_floors, bottles_floor, webui_url){
    // first we tell which floors are running out of stock
    var message = "--------------- Attention Please ---------------\n";
    message += "There are some news regarding my stocks: \n";
    
    // list the floors that have to be alarmed
    if(alerted_floors.length != 0)
    {
        if(alerted_floors.length > 1)
        {
            message += ":alert: We are out of stock on floors " + String(alerted_floors[0]);
            for(let i = 1; i < alerted_floors.length - 1; i++)
            {
                message += ", " + String(alerted_floors[i]);
            }
            message += " and " + String(alerted_floors[alerted_floors.length - 1]) + ". :alert:\n";
        }
        else
        {
            message += ":alert: We are out of stock on floor " + String(alerted_floors[0]) + ". :alert:\n";
        }
    }

    // list the floors that have to be warned
    if(warned_floors.length != 0)
    {
        if(warned_floors.length > 1)
        {
            message += "We are slowly running out of stock on floors " + String(warned_floors[0]);
            for(let i = 1; i < warned_floors.length - 1; i++)
            {
                message += ", " + String(warned_floors[i]);
            }
            message += " and " + String(warned_floors[warned_floors.length - 1]) + ".\n";
        }
        else
        {
            message += "We are slowly running out of stock on floor " + String(warned_floors[0]) + ".\n";
        }
    }

    // then we give an overview over the bottles that are approximately left on each floor
    message += "A little overview: \n";
    for(let i = 0; i < bottles_floor.length; i++)
    {
        message += "Bottles left on floor " + String(i + 1) + ": " + String(bottles_floor[i]) + "\n";
    }
    message += "You can get further information about the content of the fridge <" + String(webui_url) + "|here>.\n";
    message += "Thanks for your attention! Please remember to reorder.\n";
    message += "-------------------------------------------------\n";

    return message;
}

// @name:        sendSlackMessage
// @description: This function sends the given message to a slack webhook
// @args:        -message     [type: string]: message to be sent
//               -webhook_url [type: string]: url for the slack webhook
function sendSlackMessage(message, webhook_url){
    // logging the message and the webhook url
    console.log(message);
    console.log(webhook_url);

    // constructing the JSON object that is sent to slack
    var payload = JSON.stringify({
        text: message,
        icon_emoji: ':beer:',
    });

    // Send the HTTP Post Request
    axios.post(webhook_url, payload, {})
    .then(() => {
      console.log("--------Submitted message to Slack--------");
    })
    .catch((error) => {
      console.log("--------an error occurred-------- ", error.message);
    });
}