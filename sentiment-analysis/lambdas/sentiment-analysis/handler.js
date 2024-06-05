const createSalesCloudCase = require('./sales-cloud-v2.js');

const axios = require("axios");

const gatewayURL = process.env.GATEWAY_URL_OCC;
var baseSite = process.env.BASE_SITE;

const reviewGatewayURL = process.env.GATEWAY_URL_REVIEW;
const reviewODataPath = "/CustomerReviews";
const reviewServiceURL = reviewGatewayURL + reviewODataPath;

module.exports = {
    main: async function (event, context) {

        var rightNow = new Date().toISOString();
        console.log(`*********** Current time: ${rightNow}`);
        console.log('*********** Event Data:');
        console.log(event.data);

        console.log('********** URLs:');
        console.log(reviewGatewayURL);

        var reviewCode = event.data.integrationKey;
        var userId = event.data.user.uid;
        console.log(`userId: ${userId}`);
        var anonymous = false;

        if (userId == 'anonymous') {
            anonymous = true;
        }

        //GET CUSTOMER INFO FROM OCC
        let customerDetails = await getUserDetails(userId, anonymous);
        console.log("customerDetails email: " + customerDetails.Email);

        //** GET REVIEW TEXT FROM Integration Object

        //Review details are now provided in the event data since we are using the 
        //SAP Commerce Cloud webhook method instead of a custom SAP Commerce Cloud event.

        //let reviewDetails = await getReviewDetails(reviewCode);
        let reviewDetails = event.data;

        var reviewHeadline = reviewDetails.headline;
        var reviewComment = reviewDetails.comment;
        const comment = reviewHeadline + ' ' + reviewComment;

        console.log("reviewDetails: " + comment);

        //DETERMINE REVIEW SENTIMENT
        let negative = await isNegative(comment);
        var rude = false;

        if (negative) {
            console.log("Customer sentiment is negative: ", comment);

            var message = "Negative review posted by " + customerDetails.Email + ": " + comment;
            await axios.post(process.env.SLACK_URL, { text: message });

            rude = await isNaughty(comment);
            if (rude) {
                console.log("Customer comment is rude: ", comment);
                var message = "Rude review posted by " + customerDetails.Email + ": " + comment;
                await axios.post(process.env.SLACK_URL, { text: message });
            }
            else {
                console.log("Customer comment is clean: ", comment);
                var message = "Clean review posted by " + customerDetails.Email + ": " + comment;
                await axios.post(process.env.SLACK_URL, { text: message });
            }
            const c4cUpdateFlag = process.env['C4C_UPDATE_FLAG']
            if (c4cUpdateFlag === "true") {
                const salesCloudCase = await createSalesCloudCase(customerDetails.Email, comment);
            }
        }
        else {
            console.log("Customer sentiment is positive");

            var message = "Positive review posted by " + customerDetails.Email + ": " + comment;
            console.log(message);
            await axios.post(process.env.SLACK_URL, { text: message });
            // Trigger follow-up action

            rude = await isNaughty(comment);
            if (rude) {
                console.log("Customer comment is rude: ", comment);
                var message = "Rude review posted by " + customerDetails.Email + ": " + comment;
                console.log(message);
                // Trigger follow-up action
            }
            else {
                console.log("Customer comment is clean: ", comment);
                var message = "Clean review posted by " + customerDetails.Email + ": " + comment;
                console.log(message);
                // Trigger follow-up action
            }

            //do something cool with the positive reviews :-)
        }

        //Update Review status
        await updateReview(negative, rude, reviewDetails);


        console.log("returning processing complete.");
        return "processing complete";
    }
};

async function getUserDetails(userId, isAnonymous) {
    console.log(`userId: ${userId}`);
    var firstName = "Anonymous";
    var lastName = "Anonymous";
    var emailAddress = "anonymous@anonymous.com";

    if (!isAnonymous) {
        var url = `${gatewayURL}/${baseSite}/users/${userId}?fields=FULL`;
        console.log(`get user details: ${url}`);
        let response = await axios.get(url)
            .catch(function (error) {
                console.log('Error on getUserDetails');
            });
        firstName = response.data.firstName;
        lastName = response.data.lastName;
        emailAddress = response.data.displayUid;
    }

    var customerDetailsC4C = {
        "FirstName": firstName,
        "LastName": lastName,
        "Email": emailAddress,
        "RoleCode": "CRM000",
        "GenderCode": "1", //0002 is Mr., 0001 is Ms.
        "LifeCycleStatusCode": "2"
    };

    return customerDetailsC4C;
}

// getReviewDetails() not needed since we now get the review details in the event.  
// This method is retained to show how to access a SAP Commerce Cloud Integration API from Kyma.
async function getReviewDetails(reviewCode) {

    var url = `${reviewServiceURL}('${reviewCode}')`;
    let response = await axios.get(url)
        .catch(function (error) {
            console.log('Error on getReviewDetails:' + error);
        });

    return response.data.d;
}

async function updateReview(isNegative, isRude, content) {

    var status = { "code": "approved" };
    if (isNegative || isRude) {
        content.blocked = true;
        status = { "code": "rejected" };
    }
    content.approvalStatus = status;
    console.log(`updateReviewURL: ${reviewServiceURL}`);
    let response = await axios.post(`${reviewServiceURL}`, content)
        .catch(function (error) {
            console.log('Error on updateReview:' + error);
        });
}

async function isNegative(comment) {
    var url = process.env.SVC_URL_TEXT_ANALYSIS
    var headers = {
        'Content-Type': 'application/json',
    }

    requestJson = `{"text": "${comment}"}`

    let response = await axios.post(url, requestJson, { headers: headers})
        .catch(function (error) {
            console.log('Error on isNegative:' + error);
        });
    console.log("Sentiment score: polarity: " + response.data.polarity + " pubjectivity: " + response.data.subjectivity);
    return response.data.polarity < 0.1
}

async function isNaughty(comment) {

    var url = process.env.SVC_URL_CONTENT_MODERATION;
    var headers = {
        'Content-Type': 'application/json',
    }

    requestJson = `{"text": "${comment}"}`

    let response = await axios.post(url, requestJson, { headers: headers })
        .catch(function (error) {
            console.log('Error on isNaughty:' + error);
        });

    console.log("Content moderation inappropriate: " + response.data.inappropriate + " probability: " + response.data.probability);

    return response.data.inappropriate > 0;
}
