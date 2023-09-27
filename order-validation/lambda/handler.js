const axios = require("axios");

module.exports = { main: async function (event, context) {
    console.log(`*** occ url [${process.env['GATEWAY_URL_OCC']}]`);
    console.log(`*** fraud api url [${process.env['GATEWAY_URL_FRAUDREPORT']}]`);
    console.log(`*** admin api url [${process.env['GATEWAY_URL_ADMINAPI']}]`);
    
    // tracing
    var traceCtxHeaders = extractTraceHeaders(event.extensions.request.headers);
    
    orderCode = event.data.orderCode;
    bpCode = event.data.processCode;
    baseSite = process.env.BASE_SITE;
    console.log(`event = ${JSON.stringify(event.data)}`);
    console.log(`Processing business process ${bpCode} for order ${orderCode} from site ${baseSite}`);

    // retrieve order from Commerce
    var order = await getOrder(orderCode, baseSite, traceCtxHeaders);
    
    var results = [];

    // run checks
    await checkEmailAddress(order, results, traceCtxHeaders);
    
    await checkNumberOfOrders(order, results, traceCtxHeaders);

    await checkOrderValue(order, results);

    var score = getScore(results);
    console.log(`Score for order ${orderCode}: ${score}`);

    var returnStatus = 'OK';
    if (score >= 100) {
        returnStatus= 'POTENTIAL';
        console.log(`Order ${orderCode} failed validation`);
        await setOrderInvalid(orderCode);
        await createFraudReport(orderCode, results, false, traceCtxHeaders);
        
        var msg = `Order ${orderCode} failed validation and has been put on hold :stopwatch: \n`
        msg += JSON.stringify(results, null, 2);
        await slackMessage(msg);

    }
    else
    {
        console.log(`Order ${orderCode} passed validation`);
        await createFraudReport(orderCode, results, true, traceCtxHeaders);
        var msg = `Order ${orderCode} passed validation :thumbsup:\n`;
        //msg += JSON.stringify(results, null, 2);
        await slackMessage(msg);
    }
    await returnBusinessProcessResult(returnStatus, bpCode, traceCtxHeaders);

    console.log("returning processing complete.");
    return "processing complete";

} }


async function getOrder(code, site, traceCtx) {
    const ordersUrl = `${process.env['GATEWAY_URL_OCC']}/${site}/orders/${code}`;
    console.log("orderUrl: %s", ordersUrl)
    const response = await axios.get(ordersUrl,{headers:traceCtx});
    console.log(JSON.stringify(response.data, null, 2))
    return response.data;
}


async function checkNumberOfOrders(order, results, traceCtx)
{
    const ordersUrl = `${process.env['GATEWAY_URL_OCC']}/${order.store}/users/${order.user.uid}/orders`;
    console.log("orderUrl: %s", ordersUrl)
    var response = await axios.head(ordersUrl, { headers:traceCtx });
    console.log("total number of orders = " + response.headers['x-total-count']);
    
    if (response.headers['x-total-count'] == 1)
    {
        results.push({
            "Name": "Previous orders", 
            "Result": "Failed",
            "Score": 10
        });
    }
    else {
         results.push({
            "Name": "Previous orders", 
            "Result": "Passed",
            "Score": 0
        });
    }
}

async function checkEmailAddress(order, results, traceCtx)
{
    const response = await axios.get(`${process.env.URL_EMAIL_CHECK_SERVICE}&email=${order.user.uid}`, { headers:traceCtx });
    console.log(`Result from email check : ${JSON.stringify(response.data)}`);
    if (response.data.disposable)
    {
        results.push({
            "Name": "Disposable email address", 
            "Result": "Failed",
            "Score": 100
        });
    }
    else {
        results.push({
            "Name": "Disposable email address", 
            "Result": "Passed",
            "Score": 0
        });
    }
    if (response.data.result != 'undeliverable')
    {
        results.push({
            "Name": "Deliverable email address", 
            "Result": "Passed",
            "Score": 0
        });
    }
    else
    {
         results.push({
            "Name": "Deliverable email address", 
            "Result": "Failed",
            "Score": 100
        });
    }
}

async function checkOrderValue(order, results) 
{
	if (order.totalPrice.value > 500) {
		results.push({
            "Name": "High order value", 
            "Result": "Failed",
            "Score": 100
        });
	} 
	else
	{
		results.push({
            "Name": "High order value", 
            "Result": "Passed",
            "Score": 0
        });
	}
}
async function returnBusinessProcessResult(result, bpCode, traceCtx) {
     
    var body = {
	    "event":`${bpCode}_externalFraudCheckEvent`,
	    "choice" : result
    };
    console.log(`BP result - ${JSON.stringify(body)}`);
    var postResponse = axios.post(`${process.env['GATEWAY_URL_ADMINAPI']}/businessprocess/events`, body, { headers:traceCtx});
    console.log(`BP result response - ${postResponse.status}`);
}

async function setOrderInvalid(orderCode, traceCtx) {
    
    var body = {
        code: orderCode,
        versionID: null,
        potentiallyFraudulent: true,
        status: { code : 'CHECKED_INVALID' }
    }
    
   console.log("Saving order state");
   var postResponse =  await axios.post(`${process.env['GATEWAY_URL_FRAUDREPORT']}/Orders`, body, { headers:traceCtx});
   return postResponse;
}

async function createFraudReport(orderCode, results, passed, traceCtx)
{
    var body = {
        code: orderCode + "_FR_0",
        order : { code : orderCode},
        provider : "xf-lambda",
        timestamp : `/Date(${Date.now()})/`,
        status: { code : passed ? 'OK' : 'FRAUD' }
    }
    
   console.log("Saving fraud report");
   var postResponse =  await axios.post(`${process.env['GATEWAY_URL_FRAUDREPORT']}/FraudReports`, body, { headers:traceCtx});
   
   for (var r in results) {
    
        var entry = results[r];
    
        var scoringBody = {
            name : `${entry.Name} (${entry.Result})`,
            score : entry.Score,
            explanation : `${entry.Name} (${entry.Result})`,
            fraudReport : { code: orderCode + "_FR_0", order: {code : orderCode }}
        }

        console.log("Saving fraud report scoring");
        var entryResponse = await axios.post(`${process.env['GATEWAY_URL_FRAUDREPORT']}/FraudSymptomScorings`, scoringBody, { headers:traceCtx, auth: { username: `${process.env.FRAUD_REPORT_USERNAME}`, password: `${process.env.FRAUD_REPORT_PASSWORD}`}});
        console.log(`saving symptom scoring Response: ${entryResponse.status} -- ${entryResponse.body}`);
   }
}

function extractTraceHeaders(headers) {
    const traceHeaders = ['x-request-id', 'x-b3-traceid', 'x-b3-spanid', 'x-b3-parentspanid', 'x-b3-sampled', 'x-b3-Flags', 'x-ot-span-context']
    var map = {};
    for (var h in traceHeaders) { 
        var headerName = traceHeaders[h];
        var headerVal = headers[headerName]; 
        if (headerVal !== undefined) {
            map[headerName] = headerVal
        }
    }
    return map;
}

function getScore(results)
{
    var score = 0;
    for (var r in results) {
        score += results[r].Score;
    }
    return score; 
}

async function slackMessage(message) {
    await axios.post(process.env.SLACK_URL, {text:message});
}
