# Consuming configuration from Kubernetes Secret or Config Map

## Overview

This sample demonstrates how to inject environment variables from Kubernetes Secret or Config Map into Kyma Function.
It is based on the [s3uploader](https://github.com/SAP-samples/cloud-function-nodejs-samples/tree/master/examples/s3uploader) SAP Faas Runtime example and can serve the purpose of showing how a similar use case can be migrated from deprecated SAP Faas Runtime into the Kyma runtime.

## Additional Prerequisites

Besides the prerequisites described in the parent folder, you must have access to a S3 compliant storage service. Put the EMS instance data into the `s3-config.env` and `s3-secret` files.

## Steps

### Deploy Secret and Config Map

First, you need to create the actual Secret and Config Map, that is referenced by the Function, to access S3 bucket for storing data.

> **NOTE**:  The `.env` files in this folder are just templates. Please paste the actual data into the files before running the following commands.

Use the following kubectl CLI command to create Secret from the file:
```shell
kubectl create secret generic s3-secret --from-env-file=./s3-secret.env
```

Use the following kubectl CLI command to create Config Map from the file:
```shell
kubectl create configmap s3-config --from-env-file=./s3-config.env
```
### Inspect the Function files

Go to the `secret-handling/s3uploader` folder and inspect the code (`handler.js`), dependencies (`package.json`) and the Function configuration file, which manifests the features of the Function (`config.yaml`) - in this case, the HTTP exposure using API Rule and the ENV definitions referencing Secret and Config Map.



### Deploy the Function using Kyma CLI

> **NOTE:** If you prefer to deploy the scenario using kubectl CLI, use the attached `s3uploader-resources.yaml` with the `kubectl apply` command and skip to the testing part.


Run the following command to deploy the Function:

```shell
kyma apply function
```


To verify if the Function was built run:

```shell
kubectl get functions
NAME              CONFIGURED   BUILT   RUNNING   RUNTIME    VERSION   AGE
s3uploader        True         True    True      nodejs14   1         4s
```



### Test

Send a POST request to the Function HTTP endpoint with JSON payload.
The content is stored in the S3 bucket, as you configured it.

```shell
curl --request POST \
  --url https://$FUNCTION_URL \
  --header 'Content-Type: application/json' \
  --data '{"foo": "bar"}'
```

You can learn the `FUNCTION_URL` on your cluster by inspecting virtual services in the Function Namespace.
```shell
kubectl get vs
```