const axios = require("axios").default;
const { HTTP, CloudEvent } = require("cloudevents");

module.exports = {
    main: async function (event, context) {
        const ce = new CloudEvent({
            type: "sap.kyma.custom.internal.product.viewed.v1",
            source: "/default/my.kyma/gaurav-10-1",
            data: { 'produtId': '123' },
            datacontenttype: "application/json"
        },
        );

        const message = HTTP.structured(ce);
        console.log(`ce: ${JSON.stringify(message)}`);
        console.log(`printing content type ${JSON.stringify(message.headers['content-type'])}`);

        var publishResponse = await axios({
            method: 'post',
            url: process.env.PUBLISHER_URL,
            data: message.body,
            headers: message.headers
        })
        console.log(`status of published event ${publishResponse.status}`);
        return {"status": "published"};
    }
}