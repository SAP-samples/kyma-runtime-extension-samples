# Overview

This sample provides a serverless function configured to call the Material Stock API provided by S/4HANA using the SAP Cloud SDK.  This function is also exposed as an un-authenicated API.

This sample demonstrates:

- S/4HANA API usage
- Creating a development namespace in Kyma Runtime.
- Deployment of a serverless function and api-rule

## Prerequisites

- SAP Cloud Platform Extension Factory, Kyma Runtime instance
- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
- `kubectl` is configured to `KUBECONFIG` downloaded from Kyma Runtime.
- S/4HANA System

## Configure the System Connectivity

- Register the S/4HANA System 
  - https://help.sap.com/viewer/65de2977205c403bbc107264b8eccf4b/Cloud/en-US/28171b629f3549af8c1d66d7c8de5e18.html
- Configure the Entitlements
  - https://help.sap.com/viewer/65de2977205c403bbc107264b8eccf4b/Cloud/en-US/65ad330d11ac49a196948aa8db6470fb.html

## Deploying the function

- Create a new Namespace `dev`

```shell script
kubectl create namespace dev
```

- Apply the deployment.

```shell script
kubectl -n dev apply -f ./k8s/deployment.yaml
```

## Provision a Service Instance

Within the dev namespace

- Choose `SAP S/4HANA Cloud Extensibility`
- Choose `Add`
- Choose plan `api-access`
- Choose the option `Add Parameters` and provide the communication arrangement JSON.  For the material stock example use the following making sure to adjust the systemName.  
- 
```
{
  "systemName": "<System Name>",
  "communicationArrangement": {
    "communicationArrangementName": "INBOUND_COMMUNICATION_ARRANGEMENT",
    "scenarioId": "SAP_COM_0164",
    "inboundAuthentication": "BasicAuthentication"
  }
}
```

- Choose `Create`

## Bind a Service Instance to the function

- Open the `s4hana-materialstock` function
- Choose the tab `Configuration`
- In the `Service Bindings` pane choose the `Create Service Binding` option
- Choose the Service Instance for the S/4HANA system.
- Choose `Create`
- Verify the Function is up and running

```shell script
kubectl -n dev get function s4hana-materialstock
```

## Call the API

- Example Usage of the API Rule
  - `https://s4hana-materialstock.<cluster-domain>/orders`
  - `https://s4hana-materialstock.<cluster-domain>/orders/10000001`