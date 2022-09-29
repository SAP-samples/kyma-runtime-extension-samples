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
   kubectl label namespaces dev istio-injection=enabled
   ```

2. Apply the Deployment:

   ```shell
   kubectl -n dev apply -f ./k8s/deployment.yaml
   ```

### Provision a ServiceInstance and Binding

Within the `dev` Namespace:

1. Apply the service instance and binding by running

   ```shell
   kubectl -n dev apply -f ./k8s/s4hana-materialstock-instance.yaml
   ```

### Bind a ServiceInstance to the Function

1. Open the `s4hana-materialstock` Function.
2. Choose the buttom **Add Environment Variable** and choose **Secret Variable**.
3. Provide the value **S4\_** for the **name**.
4. Choose the value **s4-hana-cloud-0164-binding** for the secret.
5. Choose **\<All Keys>**.
6. Choose **Create**
7. Verify that the Function is up and running:

   ```shell
   kubectl -n dev get function s4hana-materialstock
   ```

### Call the API

Use the APIRule:

- `https://s4hana-materialstock.{cluster-domain}/orders`
- `https://s4hana-materialstock.{cluster-domain}/orders/10000001`
