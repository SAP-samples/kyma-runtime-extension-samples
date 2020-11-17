## Overview

work in progress...

This sample provides a Redis deployment and two serverless functions that interact with it. The function `cache-order` is set to subscribe to an `order.created` event provided by the commerce mock application. Once triggered, the function will perform an API call to obtain additional details regarding the order and then cache the information into Redis. The function `get-order`, exposed as an API, is used to then retrieve the order details from the Redis cache.

This sample demonstrates how to:

- Create a development Namespace using the Kyma Console.
- Deployment of Redis using the Kyma Console which includes:
  - A Service to expose Redis to other Kubernetes resources.
  - A Secret containing the Redis password.
- Deployment of the two serverless functions using the Kyma Console.
- Binding of Services to serverless functions.

## Prerequisites

- [Provision Kyma](https://developers.sap.com/tutorials/cp-kyma-getting-started.html)
- [Setup Mock Application](https://developers.sap.com/tutorials/cp-kyma-mocks.html)

## Steps

### Create `dev` namespace

![Create Namespace](./assets/add-ns.png)

### Bind Commerce Mock Application to `dev` Namespace

![Bind Mock](./assets/bind-mock.png)

### Create Service Instances

1. Open `dev` namespace

![Open Namespace](./assets/open-dev-ns.png)

2. Open the Service Catalog
3. Choose the tile `mp-commerce-mock`

![Service Catalog](./assets/service-catalog.png)

4. Choose Service Instance for Events

![Service Catalog](./assets/sc-enable-events.png)

5. Add Service Instance for Events

![Service Catalog](./assets/sc-add-events.png)

6. Open the Service Catalog
7. Choose the tile `mp-commerce-mock`

![Service Catalog](./assets/service-catalog.png)

8. Choose Service Instance for OCC

![Service Catalog](./assets/sc-enable-occ.png)

9. Add Service Instance for OCC

![Service Catalog](./assets/sc-add-occ.png)

### Deploy Resources

- /k8s/cache-order.yaml
- /k8s/get-order.yaml
- /k8s/redis-deployment.yaml

![Deploy Resources](./assets/deploy-function.png)

### Add Event

1. Open Function `cache-order`
2. Choose the Configuration tab
3. Choose Event Triggers
4. Choose order.created event
5. Choose Add

![Add Event](./assets/add-event.png)

### Bind Service

1. Open Function `cache-order`
2. Choose Configuration
3. Choose Create Service Binding
4. Choose the Service instance created in the previous step
5. Choose Create

![Bind Service](./assets/bind-service.png)

### Adjust Code

1. Choose the `Code` tab
2. On line three replace the value `<REPLACE WITH GATEWAY_URL>` with the `GATEWAY_URL` found in the Environment Variables
3. Choose `Save`

![Adjust Code](./assets/adjust-function-oc.png)

### Test the Event consumption

With the configuration steps completed, you can now test the scenario to validate that it is working as intended.

1. Open the mock application in the browser by choosing **Configuration > `APIRules`** from the menu.

2. Choose the **Host** entry for the **commerce-mock** `APIRule` to open it in the browser. This URL should be similar to:
   `https://commerce.*******.kyma.shoot.live.k8s-hana.ondemand.com`

3. Choose the **Remote APIS** tab.

   ![Test the Scenario](./assets/test-scenario-1.png)

4. Choose the **SAP Commerce Cloud - Events** option.

5. For the **Event Topics**, choose **order.created.v1**.

6. Modify the `orderCode` value as desired and choose **Send Event**.

   ![Test the Scenario](./assets/test-scenario-2.png)

7. With the Kyma console, choose **Configuration > `APIRules`** from the menu.

8. Choose the **Host** entry for the **fe-ui5-mssql** `APIRule` to open the application in the browser. This should be similar to:
   `https://fe-ui5-mssql.*******.kyma.shoot.live.k8s-hana.ondemand.com`

9. You should now see the data received by the event as shown below:

### Review output in funciton Logs

1. Open the Function `cache-order`
2. Expand the log view at the button of the function viewer
3. Search for the value `orderCode`
4. The output should be similar to:

![Funciton Log](./assets/function-log-event.png)

### Get output from the API-Rule function

1. Open the menu option API Rule
2. Choose the API Rule `get-order`. When first opened you will received the message

   `{"error":"No orderCode received!"}`

3. Append the value `?orderCode=12331231` to the url where the value is the same as used when sending the event, for example

   `https://get-order.*********.kyma-stage.shoot.live.k8s-hana.ondemand.com/?orderCode=12331231`

4. This should output the value saved when the event was submitted.

`{"orderCode":"12331231","Date":"Tue Nov 17 2020 19:28:42 GMT+0000 (Coordinated Universal Time)","Value":"100"}`
