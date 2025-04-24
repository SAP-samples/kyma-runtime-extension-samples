# Connectivity: Accessing a Workload in the Corporate Network From SAP BTP, Kyma Runtime

## Context

If you want to access a workload in the corporate network from SAP BTP, Kyma runtime, you can use SAP BTP, Connectivity. SAP BTP, Connectivity provides Cloud Connector service channels to connect your on-premises network to specific services on SAP BTP, Kyma runtime.

The sample demonstrates the use of Cloud Connector from within SAP BTP, Kyma runtime. This includes...

- Provisioning SAP BTP, Connectivity in the Kyma runtime. See [Connectivity in the Kyma Environment](https://help.sap.com/docs/connectivity/sap-btp-connectivity-cf/on-premise-connectivity-in-kyma-environment?version=Cloud).
- Starting the sample Node.js application locally.
- Configuring Cloud Connector to be exposed to the connected SAP BTP account.
- Deploying a Serverless Function, which is configured to call the sample Node.js application via the Connectivity Proxy, in the Kyma runtime.
- Using a curl Pod to call the sample Node.js application via the Connectivity Proxy.

## Prerequisites

- SAP BTP, Kyma runtime instance
- [curl](https://curl.se/)
- [Kubernetes tooling](../prerequisites/README.md#kubernetes)
- The service plan **connectivity_proxy** of the **connectivity** service is assigned to your subaccount as an entitlement. For more information, see [Configure Entitlements and Quotas for Subaccounts](https://help.sap.com/docs/btp/sap-business-technology-platform/configure-entitlements-and-quotas-for-subaccounts?version=Cloud).

   > [!NOTE]
   > For subaccounts created after February 15, 2024, this entitlement is assigned automatically.

- You have the Istio, SAP BTP Operator, Serverless, and Connectivity Proxy modules added. For more information, see [Adding and Deleting a Kyma Module](https://help.sap.com/docs/btp/sap-business-technology-platform/enable-and-disable-kyma-module?version=Cloud).

## Procedure

### Provisioning SAP BTP, Connectivity in the Kyma Runtime

1. Enable Istio sidecar proxy injection in your namespace.

   ```shell
   kubectl label namespaces <your namespace> istio-injection=enabled
   ```

2. Create a service instance and a service binding of the Connectivity Proxy service. Once the service instance and the service binding are detected by the Kyma Control Plane, the Connectivity Proxy service is provisioned in the **kyma-system** namespace.

   ```shell
   kubectl apply -f ./k8s/connectivity-proxy-instance.yaml -n <your namespace>
   ```

   **Result**
   The Kyma Control Plane provisioned the Connectivity Proxy service and generated the **connectivity-proxy-0** Pod. You can access the service from within the Kyma runtime using the **connectivity-proxy.kyma-system.svc.cluster.local:20003** URL or check if the Pod exists by running:

   ```shell
   kubectl get pods -n kyma-system
   ```

## Starting the Sample Application

1. Start the sample Node.js application included in the repository. Clone the repository and run the following commands in the **localmock** directory:

   ```shell
   npm install
   ```

   ```shell
   npm start
   ```

2. Download and install [Cloud Connector](https://tools.hana.ondemand.com/#cloud) and establish a connection to the **localmock** app. See [Installation](https://help.sap.com/docs/connectivity/sap-btp-connectivity-cf/installation?version=Cloud).

### Configuring Cloud Connector

1. Open [Cloud Connector](https://localhost:8443/).
2. Choose the relevant subaccount or add a new one.
3. Choose **Cloud To On-Premise**.
4. Under the **ACCESS CONTROL** tab, choose the **+** button to add a system.
5. Set the following configuration options:

   | Parameter | Value |
   |-----------|-------|
   | Backend Type | **Non-SAP System** |
   | Protocol | **HTTP** |
   | Internal Host | **localhost** |
   | Internal Port |  **3000** |
   | Virtual Host | **localhost** |
   | Virtual Port | **3000** |
   | Principle Type | **None** |
  
6. Choose the option to **Check Internal Host** and choose **Finish**.

   **Result**
   The **Check Result** column should display that the sample is **Reachable**.

7. Set the URL path policy of the sample.

   Under **Resources Of localmock:3000** choose the **+** button to add a resource.
   - Enter the URL Path **/**.
   - Choose the Access Policy **Path And All Sub-Paths**.
   - Choose **Save**.

### Deploying the Kyma Function

The provided sample Function calls the on-premise sample application by proxying the call via the **connectivity-proxy**. Within the `function.yaml` code you can find this in the **proxy** object definition of the **axios** get call. The **cc_url** defines the URL to call as was defined in the virtual host/port specified in Cloud Connector.

1. Deploy the sample Function and APIRule custom resources found in the **k8s** directory:

   ```shell
   kubectl apply -f function.yaml -n <your namespace>
   kubectl apply -f apirule.yaml -n <your namespace>
   ```

2. Open the APIRule in your namespace. In Kyma dashboard, go to **Discovery and Network -> API Rules** and choose the **host** of the **cc-sample** APIRule. The expected response should be similar to this one:

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

### Using curl to Test the Connection

1. Create an interactive Pod with curl installed.

   ```shell
   kubectl run curl --image=radial/busyboxplus:curl -i --tty
   ```

2. Call the on-premise connection.

   ```shell
   curl --proxy http://connectivity-proxy.kyma-system.svc.cluster.local:20003 http://localhost:3000/orders?OrderNo=123
   ```

3. Escape the Pod.

   ```shell
   exit
   ```

4. If you want to remove the Pod, run:

   ```shell
   kubectl delete pod curl
   ```

## Related Information

For more information on principal propagation, see the [VeridisQuo. Reaching SAP LOB destinations with connectivity proxy and principal propagation](https://blogs.sap.com/2022/04/07/veridisquo.-reaching-sap-lob-destinations-with-connectivity-proxy-and-principal-propagation./) blog post and [this sample](../principal-prop-on-prem).
