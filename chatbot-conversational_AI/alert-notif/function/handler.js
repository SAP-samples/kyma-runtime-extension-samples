const { OAuthAuthentication, AlertNotificationClient, BasicAuthentication,
    RegionUtils, Severity, Category } = require("@sap_oss/alert-notification-client");
const { Region, Platform } = require("@sap_oss/alert-notification-client/dist/utils/region");

const oAuthAuthentication = new OAuthAuthentication({
    username: process.env.client_id,
    password: process.env.client_secret,
    oAuthTokenUrl: process.env.oauth_url
});
module.exports = {
  main: async function (event, context) {
      try{
        const client = new AlertNotificationClient({
            authentication: oAuthAuthentication,
            region: new Region(Platform.CF, process.env.url),
        });
        const result =  await processAlert(client, event.data);
        return JSON.stringify(result);
      }catch(error){
          console.log(error);
          return error;
      };
  }
}
// data should be a JSON object. // There is the possiblity to set these keys: // - severity: ["fatal", "info", "notice", "warning", "error"] // - category: ["alert", "exception", "notification", "warning"] // - email_header: string // - details: JSON object
async function processAlert(client, data){
    console.log("processAlert() data: " + JSON.stringify(data));
    const cur_time = Math.floor(+new Date() / 1000);
    var severity_value = Severity.FATAL;
    switch(data.severity) {
      case "fatal":
        severity_value = Severity.FATAL;
        break;
      case "info":
        severity_value = Severity.INFO;
        break;
      case "notice":
        severity_value = Severity.NOTICE;
        break;
      case "warning":
        severity_value = Severity.WARNING;
        break;
      case "error":
        severity_value = Severity.ERROR;
        break;
      default:
        console.log("Unexpected value for severity in processAlert: " + data.severity);
    }

    var category_value = Category.ALERT;
    switch(data.category) {
      case "alert":
        category_value = Category.ALERT;
        break;
      case "info":
        category_value = Category.EXCEPTION;
        break;
      case "notice":
        category_value = Category.NOTIFICATION;
        break;
      case "warning":
        category_value = Category.WARNING;
        break;
      default:
        console.log("Unexpected value for category in processAlert: " + data.category);
    }

    var email_header = data.email_header || "Message";
    var details = data.details || data;

    return await client.sendEvent({
        body: 'The chatbot reported a ' + severity_value + ' ' + category_value + '. \nDETAILS: ' + JSON.stringify(details).replace(/[{}]|,/g, "\n"),
        subject: 'Chatbot ' + category_value + ': ' + email_header,
        eventType: 'system_down_condition',
        severity: severity_value,
        category: category_value,
        resource: {
            resourceName: 'update-bot',
            resourceType: 'deployment',
            resourceInstance: '1',
        },
        eventTimestamp: cur_time,
        priority: 1
    });
}