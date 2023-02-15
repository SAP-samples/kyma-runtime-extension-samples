
const axios = require("axios");

module.exports = {
    main: async function (event, context) {
        console.log(`Event Data: ${JSON.stringify(event.data)}`);
        const eventType = process.env.EVENT_NAME;
        const eventSource = "kyma";
        // Available since Kyma v2.10:
        return await event.emitCloudEvent(eventType,eventSource,event.data)
            .then(resp => {
                return "Event Sent";
            }).catch(err=> {
                console.error(`Error sending event. ${eventType}`);
                console.error(err);
                return err;
            });
        }
};