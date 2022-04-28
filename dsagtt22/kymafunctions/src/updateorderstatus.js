const fetch = require('node-fetch')
const axios = require('axios')
//npm i node-fetch@2 axios

module.exports = {
  main: async function (event, context) {

    // Extract Material ID from request
    const bodyJson = JSON.parse(event.extensions.request.body)
    const materialId = bodyJson.materialId

    console.log(`MaterialId for Orders: ${materialId} `)

    // Call on prem system to fetch order data by material
    const orderId2Update = await getOrderByMaterial(materialId)

    await updateOrderStatus(orderId2Update)

    await pushMessageToNotificationQueue(orderId2Update)

  }

}

async function getOrderByMaterial(materialId) {

  const headers = {
    "SAP-Connectivity-SCC-Location_ID": "",
  }

  const proxy = {
    protocol: "http",
    host: "connectivity-proxy.kyma-system.svc.cluster.local",
    port: 20003,
  }

  const body = {
    "userId": "01"
  }

  const url = `${process.env.EM_ONPREM_SERVICE_ENDPOINT}/api/OrdersByMaterial/${materialId}`

  try {

    const result = await axios.post(url, body, {
      headers: headers,
      proxy: proxy
    });

    console.log(`The result is is: ${result.data.orderId}`)

    return result.data.orderId

  }
  catch (error) {
    console.log(`Error when calling Axios: ${error}`)

    return "error"
  }

}

async function updateOrderStatus(orderId2Update) {

  /* Update the status of the order
  1 - Fetch the order by ID
  2 - Update the status value to delayed
  */
  const orderApiEndpoint = process.env.EM_ORDER_SERVICE_ENDPOINT

  const readOrderUrl = `${orderApiEndpoint}/orders/${orderId2Update}`

  const responseFromOrderService = await fetch(readOrderUrl,
    {
      method: 'GET',
    })


  let responseBodyFromOrderService = await responseFromOrderService.json()

  if (responseBodyFromOrderService.length === 1) {
    responseBodyFromOrderService[0].status = "DELAYED"
  }
  else {
    console.log("Error when fetching the order")
    return
  }

  const updateOrderUrl = `${orderApiEndpoint}/orders/${orderId2Update}`

  const responseFromOrderUpdate = await fetch(updateOrderUrl,
    {
      method: 'PUT',
      body: JSON.stringify(responseBodyFromOrderService[0])
    })

  console.log(`Order status updated for order ${orderId2Update} updated - DELAYED`)

}

async function getBearerTokenForEventMesh() {

  // Send event to queue that order xyz for user abc is delayed
  // Build data for token request
  const clientId = JSON.parse(process.env.EM_uaa).clientid
  const clientSecret = JSON.parse(process.env.EM_uaa).clientsecret

  const authString = "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

  const messagingTokenEndpoint = JSON.parse(process.env.EM_messaging)[2].oa2.tokenendpoint
  const messagingTokenFetchUrl = `${messagingTokenEndpoint}?grant_type=client_credentials&response_type=token`

  const fetchTokenHeader = {
    "Authorization": authString
  }
  // Fetch OAuth token from endpoint
  const responseFromTokenEndpoint = await fetch(messagingTokenFetchUrl,
    {
      method: 'POST',
      headers: fetchTokenHeader
    })

  const responseBodyFromTokenEndpoint = await responseFromTokenEndpoint.json()

  let accessTokenEventMesh = ""

  if (responseFromTokenEndpoint.status === 200) {

    accessTokenEventMesh = responseBodyFromTokenEndpoint.access_token
    console.log("Fetched OAuth2 token successfully")

    return accessTokenEventMesh

  }
  else {
    console.log(`Error when fetching the token - status: ${responseFromTokenEndpoint.status}`)
    return
  }

}

async function pushMessageToNotificationQueue(orderId2Update) {

  const accessTokenEventMesh = await getBearerTokenForEventMesh()
  const messagingEndpointBase = JSON.parse(process.env.EM_messaging)[2].uri

  const queuePath = process.env.EM_DELAYEDORDER_PATH
  const queuePathEncoded = encodeURIComponent(queuePath)

  const queueUrl = `${messagingEndpointBase}/messagingrest/v1/queues/${queuePathEncoded}/messages`

  const queueHeader = {
    "Authorization": `Bearer ${accessTokenEventMesh}`,
    "Content-Type": "application/json",
    "x-qos": 0

  }

  const queueBody = {
    "orderId": orderId2Update
  }

  const responseFromQueue = await fetch(queueUrl,
    {
      method: 'POST',
      headers: queueHeader,
      body: JSON.stringify(queueBody)
    })

  if (responseFromQueue.status === 204) {
    console.log("Message sent to queue for delayed orders")
  }
  else {
    console.log(`Error when sending message - status: ${responseFromQueue.status}`)
  }

}