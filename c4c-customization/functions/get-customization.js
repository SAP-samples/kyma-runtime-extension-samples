const {promisify} = require('util');
var url = require("url");


var redis = require("redis"),
    client = redis.createClient(process.env.PORT, process.env.HOST, {password: process.env.REDIS_PASSWORD});
const getAsync = promisify(client.get).bind(client);

module.exports = { main: async function (event, context) {
    var id = url.parse(event.extensions.request.url).pathname.replace(/\/*/, "");
    var req = JSON.parse(await getAsync(id));
    if(req == null){
        event.extensions.response.status(404).send("Task not found")
    }
    return req
} }