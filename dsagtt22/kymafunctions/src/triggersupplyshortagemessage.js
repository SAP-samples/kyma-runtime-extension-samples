
const fetch = require('node-fetch')

module.exports = {
  main: async function (event, context) {

    const clientId = process.env.EM_MESSAGE_CLIENT_ID
    const clientSecret = process.env.EM_MESSAGE_CLIENT_SECRET

    const authString = "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

    const messagingTokenEndpoint = process.env.EM_MESSAGING_TOKEN_ENDPOINT
    const messagingTokenFetchUrl = `${messagingTokenEndpoint}?grant_type=client_credentials&response_type=token`

    // Fetch the OAuth2 token to call the message queue
    const fetchTokenHeader = {
      "Authorization": authString
    }
    const responseFromTokenEndpoint = await fetch(messagingTokenFetchUrl,
      {
        method: 'POST',
        headers: fetchTokenHeader
      })

    const responseBodyFromTokenEndpoint = await responseFromTokenEndpoint.json()

    let accessTokenEventMesh = ""

    if (responseFromTokenEndpoint.status === 200) {

      accessTokenEventMesh = responseBodyFromTokenEndpoint.access_token
      console.log("Access Token fetched")

    }
    else {
      console.log(`Error when fetching the token - status: ${responseFromTokenEndpoint.status}`)
      return
    }

    // Call queue to publish message that order was updated
    const messagingEndpointBase = process.env.EM_MESSAGING_ENDPOINT_BASE
    const queuePath = process.env.EM_TRIGGER_QUEUE_PATH
    const queuePathEncoded = encodeURIComponent(queuePath)

    const queueUrl = `${messagingEndpointBase}/messagingrest/v1/queues/${queuePathEncoded}/messages`

    const queueHeader = {
      "Authorization": `Bearer ${accessTokenEventMesh}`,
      "Content-Type": "application/json",
      "x-qos": 0

    }

    const queueBody = {
      "materialId": 123
    }

    const responseFromQueue = await fetch(queueUrl,
      {
        method: 'POST',
        headers: queueHeader,
        body: JSON.stringify(queueBody)
      })

    let message = ""

    if (responseFromQueue.status === 204) {

      message = `Message with materialId ${queueBody.materialId} sent to queue ${queuePath}`
      console.log(message)
      return message
    }
    else {
      message = `Error when sending message - status: ${responseFromQueue.status}`
      console.log(message)
      return message
    }

  }
}