# Consuming configuration from k8s secret or configMap

## Overview

This sample demonstrates how to inject environment variables from k8s secret or config map into a kyma Function.
It is based on the [s3uploader](https://github.com/SAP-samples/cloud-function-nodejs-samples/tree/master/examples/s3uploader) SAP Faas Runtime example and can serve the purpose to show how a similar use case could be migrated from deprecated SAP Faas Runtime into the Kyma runtime.

## Additional Prerequisites

Besides the prerequisistes described in the parent folder, for this sample it is required to have access to an S3 compliant storage service. Fill in the ems instance data into the `s3-config.env` and `s3-secret` files.

## Steps

### Deploy Secret and ConfigMap

First you need to create the actual secret and config map that will be referenced by the Function to access S3 bucket for storing data.

> **NOTE**:  The `.env` files in this folder are just templates. Please paste the actual data into the files before running the following commands

Use the following kubectl CLI command to create secret from file:
```shell
kubectl create secret generic s3-secret --from-env-file=./s3-secret.env
```

Use the following kubectl CLI command to create configMap from file:
```shell
kubectl create configmap s3-config --from-env-file=./s3-config.env
```
### Inspect the Function files

Go to the `secret-handling/s3uploader` folder and inspect the code (`handler.js`), dependencies (`package.json`) and the Function configuration file which manifests the features of the Function (`config.yaml`) - in this case the the http exposure via API Rule and the ENV definitions referencing secret and configmap.



### Deploy the Function using kyma CLI

Run the following command to deploy the Function

```shell
kyma apply function
```


Verify if the Function was successfully built.

```shell
kubectl get functions
NAME              CONFIGURED   BUILT   RUNNING   RUNTIME    VERSION   AGE
s3uploader        True         True    True      nodejs14   1         4s
```



### Test

Send a POST request to the Function http endpoint with JSON payload.
The content should get stored in the S3 bucket as you configured it.

```shell
curl --request POST \
  --url https://$FUNCTION_URL \
  --header 'Content-Type: application/json' \
  --data '{"foo": "bar"}'
```

You can learn the `FUNCTION_URL` on your cluster be inspecting virtual services in the Function namespace
```shell
kubectl get vs
```