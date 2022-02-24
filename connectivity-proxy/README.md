## SAP Connectivity Proxy

The sample demostrates the configuration of the SAP Cloud Connector with the SAP Kyma runtime. This includes...

- The provisioning of the Connectivity Proxy within the Kyma runtime.
- A sample Nodejs application is ran locally and configured in the SAP Cloud Connector to be exposed to the connected SAP BTP account.
- A Serverless function is deployed within the Kyma runtime, which is configured to call the sample Nodejs application via the Connectivity Proxy.

### Enable the Connectivity Service Entitelment

In order to configure the Connectivity Proxy within the Kyma Runtime you must first make sure that the Connectivity Service Entitlement is present within your subaccount. This can be accomplished by

- Within your global account…
- Choose **Entitlements -> Entity Assignments**
- Search **for Connectivity Service**
- Choose **connectivity_proxy**
- Choose **Add 1 Service Plan**
- Choose **Save**

### Provision the Service in the Kyma Runtime

The next steps involves creating a service instance of the Connectivity Proxy and then a service binding. Once the creation of the sevice binding is detected by the Kyma Control Plane, the Connectivity Proxy will be provisioned in the runtime into the namespace **kyma-system**. From within the Kyma runtime it will be accessible using the URL **connectivity-proxy.kyma-system.svc.cluster.local:20003**

- Within your desired namespace
- Choose **Service Management -> Catalog**
- Search for and select the **Connectivity** tile
- Choose **Add**
- If desired provide a name, otherwise the auto-generated name can be used
- Choose the Plan **connectivity_proxy**
- The option to add parameters can be skipped
- Choose **Create**

After creating the service instance, create the service binding.

- Within the same namespace
- Choose **Service Management -> Instances**
- Choose the Service Instance created in previous step
- Choose the option **Add Service Binding**
- If desired provide values for the **Name** and **Secret Name**, otherwise the auto-generated values can be used
- Choose **Create**

The Kyma Control Plane should now provision the Connectivity Proxy. This will generate the pod **connectivity-proxy-0** which can be found by running.

```shell
kubectl get pods -n kyma-system
```

### Configuration of the Sample Application

To validate the setup, start the sample application included in the repo and configure it within the SAP Cloud Connector.

#### Starting the localmock application

After cloning the repo run the following commands in the directory **localmock**

- Run the command
  ```
  npm install
  ```
- Start the application
  ```
  npm start
  ```

#### SAP Cloud Connector Configuration

Download and install the [SAP Cloud Connector](https://tools.hana.ondemand.com/#cloud) and establish a connection to the **localmock** app. Please refer to the [help documentation](https://help.sap.com/viewer/cca91383641e40ffbe03bdc78f00f681/Cloud/en-US/e6c7616abb5710148cfcf3e75d96d596.html) for the installation steps. Make sure to also add your user to the appropiate

- Open the [Cloud Connector](https://localhost:8443/)
- Choose the appropiate Subaccount or add an additional one by...
  - Choose **Add Subaccount**
  - Choose your Region
  - Provide your Subaccount ID
  - Provide your Subaccount User and Password
  - Choose Save
  - Verify that the subaccount is connected. Under the Actions column use the Connect this sub account option
- Choose **Cloud To On-Premise**
- Under the tab **ACCESS CONTROL** choose the **plus** button to add a system
  - Choose the Back-end Type **Non-SAP System**, choose Next
  - Choose the Protocol **HTTP**, choose Next
  - Enter the Internal Host **localhost**
  - Enter the Internal Port **3000**, choose Next
  - Enter the Virtual Host **localhost**
  - Enter the Virtual Port **3000**, choose Next
  - Choose the Principle Type **None**, choose Next
  - Choose Next
  - Choose Next
  - Choose the option to **Check Internal Host**, choose Finish

At this point the **Check Result** column should display that the sample is **Reachable**. Next set the URL path policy of the sample.

- Under **Resources Of localmock:3000** choose the **plus** button to add a resource
  - Enter the URL Path **/**
  - Choose the Access Policy **Path And All Sub-Paths**
  - Choose **Save**

#### Deploy the Kyma Function

The provided sample function calls the on-premise sample application by proxing the call via the **connectivity-proxy**. Within the function code you will find this in the **proxy** object definition of the axios get call. The **cc_url** defines the url to call as was defined in the virtual host/port defined in the SAP Cloud Connector.

- Deploy the sample function and apirule found in the directory **k8s**

```shell
kubectl apply -f function.yaml -n <your namespace>
kubectl apply -f apirule.yaml -n <your namespace>
```

Open the apirule in the choosen namespace by choosing the menu option **Discoery and Network -> API Rules** and choosing the **host** of the
**cc-sample** API Rule. The expected response should be similar to

```json
{
  "OrderNo": "19",
  "createdBy": "Internal Inc.",
  "buyer": "The Buyer Co.",
  "currency": { "code": "EUR" },
  "Items": [
    { "product_ID": "943735", "quantity": 6, "title": "familiar", "price": 12 }
  ]
}
```
