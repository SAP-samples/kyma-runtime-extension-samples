const axios = require("axios").default;
const { HTTP, CloudEvent } = require("cloudevents");
const { v4: uuidv4 } = require('uuid');

export default async function handler(req, res) {

  let response = null;

  if (req.method === 'POST') {
    if (req.body) {
      console.log('request body: ', req.body);
      response = await emitCloudEvent(req.body);
    }
  }

  console.log('emitCloudEvent response: ', response);

  res.status(200).json(response);

}

async function emitCloudEvent(data) {

  const cno = uuidv4();

  data = { ...data, cno: cno};

  const ce = new CloudEvent({
    id: cno,
    type: process.env.EVENT_TYPE,
    source: process.env.EVENT_SOURCE,
    data: data,
    datacontenttype: "application/json"
  });

  const message = HTTP.structured(ce);

  const response = await axios({
    method: "post",
    url: process.env.PUBLISHER_URL,
    data: message.body,
    headers: message.headers
  });

  console.log('response: ', response);

  let status = null;
  if (response) {
    status = response.status;
  }

  console.log('status: ', status);

  return { status: status, cno: cno };

}