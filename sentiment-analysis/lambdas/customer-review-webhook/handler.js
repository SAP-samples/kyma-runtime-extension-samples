const axios = require("axios").default;
const { HTTP, CloudEvent } = require("cloudevents");

module.exports = {
    main: async function (event, context) {
        console.log(`Event Data: ${JSON.stringify(event.data)}`);
        const cloudEventData = {
            reviewcode: event.data.code,
            user: event.data.user.uid,
            reviewdetails: event.data
        }
        const cloudEvent = new CloudEvent({
            type: process.env.EVENT_NAME,
            source: "kyma-internal",
            data: cloudEventData,
            datacontenttype: "application/json"
        });
        console.log(`product review submitted event: ${JSON.stringify(cloudEvent)}`);

        const message = HTTP.structured(cloudEvent);
        try {
            var publishResponse = await axios({
                method: 'post',
                url: process.env.PUBLISHER_URL,
                data: message.body,
                headers: message.headers
            });
            event.extensions.response.status(200).send();
        } catch (error) {
            console.log("Error:")
            console.log(error);
            event.extensions.response.status(500).send("Error");
        }
    }
};