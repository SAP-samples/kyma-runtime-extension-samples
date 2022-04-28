# Step 5 - Develop function "trigger supply chain issue"

> DSAG Technologietage 2022 Category: 👨‍🔧

## Goal 🎯

This step covers the creation of a Kyma Function that triggers the overall process i. e. pushes a message into the `supplychainissue<userID>` queue that can then processed by another Kyma Function to update the order status.

In this section we will:

- Create a Kyma Function that pushes a message to the Event Mesh including the OAuth2 authentication flow
- Use a Kubernetes `configmap` and a `secret` to store the necessary configuration
- Expose the Function via an API Rule

You will develop everything in the Kyma Dashboard, which means you do not need any tools installed locally.

> 📝 **Tip** - If you want to create the artifacts locally and deploy them to Kyma via the `kubectl` CLI, feel free to do so. You find the code in the directory [dsagtt22/kymafunctions](../kymafunctions).

## Step 5.1 - Create a namespace

First we create a namespace for our hands-on:

- Go to the Kyma Dashboard
- Got to the **Namespaces Section** and push the **Create Namespace** button
- On the "Simple" tab of the po-up enter the name `dsagtt-handson<userID>` and press **Create**

## Step 5.2 - Create the config map

The Kyma Function needs the following information:

- The token endpoint of the Event Mesh for authentication
- The messaging endpoint of the Event Mesh to push the message into the the queue
- The queue name

To avoid hard-coding this into the code of the Kyma Function we create a `config map` ([What's that?](https://kubernetes.io/docs/concepts/configuration/configmap/)):

- Go to the previously created namespace
- Go to the **Configuration** -> **Config Maps** area in the navigation sidebar
- Push the **Create Config Map** button
- Enter following data into the pop-up (**Simple** tab):
  - **Name**: `triggerfunctionconfigmap`
  - Enter the following key-value pairs into the **Data** section:

      | Key                          | Value
      | ---                          | ---
      | **MESSAGING_TOKEN_ENDPOINT** | Value of `"tokenendpoint"` in your Event Mesh service key file [downloaded in this step](https://github.com/SAP-samples/kyma-runtime-extension-samples/blob/main/dsagtt22/tutorial/step4.md#retrieve-service-keys)
      | **MESSAGING_ENDPOINT_BASE**  | Value of `"uri"` in your Event Mesh service key file
      | **TRIGGER_QUEUE_PATH**       | Full name Name of the `supplychainissue<userID>` queue as displayed in the Event Mesh app (**Queues** -> **Queue Name**)

> 📝 **Tip** - When fetching the values from the service key file, make sure to take them from the JSON object with the property `"protocol": ["httprest"]` roughly in lines 54ff of the file.

- Press the **Create** button.

## Step 5.3 - Create the secret

To execute the OAuth2 flow (type `client_credentials`) we need the `clientid` and the `clientsecret`. As this is confidential we store it into a `secret` ([What's that?](https://kubernetes.io/docs/concepts/configuration/secret/)) which we create:

- Go to the **Configuration** -> **Secrets** area in the navigation sidebar
- Push the **Create Secret** button
- Enter following data into the pop-up (**Simple** tab):
  - **Name**: `eventmeshsecret`
  - **Type**: Leave the default value (`Opaque`)
  - Enter the following key-value pairs into the **Data** section:
      | Key                        | Value
      | ---                        | ---
      | **MESSAGE_CLIENT_ID**      | Value of `"clientid":` in your Event Mesh service key file under the `"oa2"` property
      | **MESSAGE_CLIENT_SECRET**  | Value of `"clientsecret":` in your Event Mesh service key file under the `"oa2"` property
- Press the **Create** button.

> 🔎 **Observation** - the secret contains only a base64 encoded value of the `clientid` and the `clientsecret`. Although the secret is only available in the cluster we would probably store those values in a dedicated vault.

## Step 5.4 - Create the Kyma Function

As we have the configuration in place we can now start with implementing the Kyma Function which pushes a message that contains the ID of the material that has a supply chain shortage into the corresponding message queue. To achieve this the Kyma Function must authenticate against the Event Mesh using the `clientid` and `clientsecret` to fetch the Bearer Token and then call the HTTP REST endpoint of the Event Mesh to push the message into the queue.

In the Kyma Dashboard:

- Go to the **Workloads** -> **Functions** area in the navigation sidebar
- Push the **Create Function** button
- Enter following data into the pop-up (**Simple** tab):
  - **Name**: `triggersupplyshortagemessage<userID>`
  - **Runtime**: `Node.js 14`
- Press the **Create** button.

The system will create the Kyma Function forward you to the Kyma Function inline editor. As we will need several values from the `configmap` and the `secret` we created before, we need to make them accessible in the Kyma Function. To achieve this we must add them as environment variables:

- In the **Environment Variables** section of the inline editor press the **Add Environment Variable** button.
- Select **Config Map Variable**
- In the pop-up **Create Config Map Variable** enter the following data:
  - **Name**: `EM_`
  - **Config Map**: Select the config map `triggerfunctionconfigmap` from the drop down list
  - **Key**: Select `<All Keys>` from the drop down list
- Press the **Create** button  
- This will add three variables as the config map consists of three keys, all names starting with `EM_`.

The procedure for the secrets is the same, but you need to select **Secret Variable** from the action menu of the **Add Environment Variable** button. Follow the above procedure to add `<All Keys>` as environment variables starting with `EM_` to the Kyma Function.

> 📝 **Tip** - The environment variables are available in the Kyma Function via `process.env.<ENVVARIABLE_NAME>`.

As we need to make HTTP calls we need a npm package that helps us with that. As a lightweight solution we use `node-fetch`.
We declare the dependency in the **Dependencies** tab under the **Code** section:

```json
{ 
  "name": "triggersupplyshortagemessage<userID>",
  "version": "1.0.0",
  "dependencies": {
    "node-fetch": "^2.6.7"
    }
}
```

Save the change via the **Save** button.

> 🔎 **Observation** - We are using the version 2 of `node-fetch`. Version 3 of `node-fetch` is an ESM-only module which can cause issues with other modules that are CommonJS-only. To avoid issue we decided for the "older" version which receives security patches but no functional updates.

Now all is set to write code of the Kyma Function:

- First cleanup the function body and add the `async` keyword to the function

  ```javascript
  module.exports = {
  main: async function (event, context) {
   }
  } 
  ```

- Require the `node-fetch` module:
  
  ```javascript
  const fetch = require('node-fetch')

  module.exports = {
  main: async function (event, context) {
   }
  }  
  ```

- Fetch the secrets and the REST endpoints from the environment variables:

  ```javascript
  const fetch = require('node-fetch')
  
  module.exports = {
    main: async function (event, context) {
  
      const clientId = process.env.EM_MESSAGE_CLIENT_ID
      const clientSecret = process.env.EM_MESSAGE_CLIENT_SECRET
  
      const messagingTokenEndpoint = process.env.EM_MESSAGING_TOKEN_ENDPOINT
      const messagingTokenFetchUrl = `${messagingTokenEndpoint}?grant_type=client_credentials&response_type=token`
  
    }
  }
  ```

- To make the call to the token endpoint we must do a base64-encoding of the string `clientid:clientsecret`:

  ```javascript
  const fetch = require('node-fetch')
  
  module.exports = {
    main: async function (event, context) {
  
      const clientId = process.env.EM_MESSAGE_CLIENT_ID
      const clientSecret = process.env.EM_MESSAGE_CLIENT_SECRET

      const authString = "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

      const messagingTokenEndpoint = process.env.EM_MESSAGING_TOKEN_ENDPOINT
      const messagingTokenFetchUrl = `${messagingTokenEndpoint}?grant_type=client_credentials&response_type=token`
  
    }
  }
  ```

- Next we fetch the Bearer token via a `POST` request to the token endpoint. If the call was successfull (`responseFromTokenEndpoint.status === 200`) we extract the value from the response body:

  ```javascript
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
  
    }
  }
  ```

- With the Bearer token we can then make a call to the queue of the Event Mesh. We hand over the material as a JSON object with the key `materialId` via the request body. The endpoint of the call must be constructed based on the schema `<ENDPOINT OF THE EVENT MESH>/messagingrest/v1/queues/<QUEUENAME - PATH ENCODED>/messages`.The result of the HTTP call is logged and returned to the caller of the Kyma Function:

  ```javascript
  const fetch = require('node-fetch')
  
  module.exports = {
    main: async function (event, context) {
  
      ...

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
  ```

- Save the changes via the **Save** button. This will trigger a build and deployment of the Kyma Function into the cluster.

  > 🔎 **Observation** - The Event Mesh REST endpoint returns the HTTP code 204 stating the server has executed the request. This does not necessarily mean that the message was successfully processed in the Event Mesh or that the endpoint even exists.

  > 🔎 **Observation** - The HEADER of the call contains the key `"x-qos"`. This parameter defines the quality of service of the message delivery in the Event Mesh where `0` stands for "at most once"  and `1` stands for "at least once".

As we have the Kyma Function in place, we will expose it via an API Rule in the next step.

## Step 5.5 - Create the API Rule

In the Kyma Dashboard:

- Go to the **Discovery and Network** -> **API Rules** area in the navigation sidebar
- Push the **Create API Rule** button
- Enter following data into the pop-up (**Simple** tab):
- In the pop-up **Create API Rule** enter the following data:
  - **Name**: `supplychaintrigger<userID>`
  - **Service**: Select the service `triggersupplyshortagemessage<userID>` from the drop down list
  - **Gateway**: Leave the default value
  - **Host**: Leave the default value
  - **Subdomain**: `supplychaintrigger<userID>`
  - **Path**: Leave the default value
  - **Handler**: `noop`
  - **Methods**: Make sure that the `GET` checkbox is ticked
- Press the **Create** button  

Now we have an API rule exposed that allows us to post a message to the Event Mesh queue.  

## Summary

🎉 Congratulations - You've now completed the creation of the Kyma function "trigger supply chain issue"

Continue to [Step 6 - Develop function "update order status"](step6.md).

[◀ Previous step](step4.md) | [🔼 Overview](../README.md) | [Next step ▶](step6.md)
