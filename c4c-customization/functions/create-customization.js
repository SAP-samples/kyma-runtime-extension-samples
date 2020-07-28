const axios = require('axios');
const uuidv1 = require('uuid/v1');
var url = require("url"); 

var redis = require("redis"),
    client = redis.createClient(process.env.PORT, process.env.HOST, {password: process.env.REDIS_PASSWORD});

module.exports = { main: async function (event, context) {
    var id = url.parse(event.extensions.request.url).pathname.replace(/\/*/, "");
    event.data.id = uuidv1();
    var data = JSON.stringify(event.data);

    console.log(`${id}: ${data}`)
    client.set(id, JSON.stringify(event.data));
    var message = {
    	"blocks": [
    		{
    			"type": "section",
    			"text": {
    				"type": "mrkdwn",
    				"text": "You have a new request:\n*Request #" + id +"*"
    			}
    		},
    		{
    			"type": "section",
    			"fields": [
      				{
    					"type": "mrkdwn",
    					"text": "*Name:*\n" + event.data.name
    				},
    				{
    					"type": "mrkdwn",
    					"text": "*Description:*\n" + event.data.description
    				},
    				{
    					"type": "mrkdwn",
    					"text": "*Color:*\n" + event.data.color
    				},
    				{
    					"type": "mrkdwn",
    					"text": "*Usage:*\n" + event.data.usage
    				}
    			]
    		}
    	]
    }
    
    await axios.post(process.env.SLACK_URL, message)
    return data;
} }