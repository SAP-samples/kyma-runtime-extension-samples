# S/4HANA Nodejs SAP Cloud SDK Example

## Overview

This sample provides a Serverless Function configured to call the Material Stock API provided by S/4HANA using the SAP Cloud SDK. This function is exposed as an un-authenticated API.

This sample demonstrates how to:

- Use the S/4HANA API.
- Create a development Namespace in the Kyma runtime.
- Deploy a Serverless Function and an APIRule.

## Prerequisites

- SAP BTP, Kyma runtime instance
- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) configured to use the `KUBECONFIG` file downloaded from the Kyma runtime
- S/4HANA System

## Steps

### Configure the System Connectivity

1. [Register an SAP S/4HANA Cloud System in an SAP BTP global account](https://help.sap.com/viewer/65de2977205c403bbc107264b8eccf4b/Cloud/en-US/28171b629f3549af8c1d66d7c8de5e18.html).
2. [Configure the Entitlements for the SAP BTP subaccount](https://help.sap.com/viewer/65de2977205c403bbc107264b8eccf4b/Cloud/en-US/65ad330d11ac49a196948aa8db6470fb.html).

### Deploy the Function

1. Create a new `dev` Namespace:

    ```shell
    kubectl create namespace dev
    ```

2. Apply the Deployment:

    ```shell
    kubectl -n dev apply -f ./k8s/deployment.yaml
    ```

### Provision a ServiceInstance

Within the `dev` Namespace:

1. Choose `SAP S/4HANA Cloud Extensibility`.
2. Choose **Add**.
3. Choose the `api-access` plan.
4. Choose the **Add Parameters** option and provide the communication arrangement JSON. For the material stock example, use the following snippet. Make sure to adjust the **systemName** parameter.  

    ```json
    {
      "systemName": "{System Name}",
      "communicationArrangement": {
        "communicationArrangementName": "INBOUND_COMMUNICATION_ARRANGEMENT",
        "scenarioId": "SAP_COM_0164",
        "inboundAuthentication": "BasicAuthentication"
      }
    }
    ```

5. Choose **Create**.

### Bind a ServiceInstance to the Function

1. Open the `s4hana-materialstock` Function.
2. Choose the **Configuration** tab.
3. In the **Service Bindings** pane, choose the **Create Service Binding** option.
4. Choose the ServiceInstance for the S/4HANA system.
5. Choose **Create**.
6. Verify that the Function is up and running:

    ```shell
    kubectl -n dev get function s4hana-materialstock
    ```

### Call the API

Use the APIRule:

- `https://s4hana-materialstock.{cluster-domain}/orders`
- `https://s4hana-materialstock.{cluster-domain}/orders/10000001`
