# sentiment-analysis

## Overview

This function is the main business logic for the product review sentiment analysis use case.

It uses the `nodejs16` function runtime and is triggered by a `CloudEvent` called `sap.kyma.custom.internal.product.reviewsubmitted.v1`.  

This function requires a `Secret` named `sentiment-analysis` with entries described in the [main README.md](../../README.md)


[handler.js](handler.js) - Javscript source code for the business logic.

[package.json](package.json) - Dependencies for the function

[k8s/function.yaml](k8s/function.yaml) - `Function` configuration for the function.

[k8s/subscription.yaml](k8s/subscription.yaml) - `Subscription` to enable the event trigger.  

**NOTE** if you deploy the function into a namespace other than `sentiment-analysis` you will need to adjust the `sink` value in this file.


## Deploy
The [k8s](k8s) directory contains the yaml file with the `Deployment` and `Subscription` configuration. 

**NOTE** if you deploy the function into a namespace other than `sentiment-analysis` you will need to adjust the `sink` value in [k8s/subscription.yaml](k8s/subscription.yaml).

Apply the configuration as follows:


* Set up environment variables

  * OSX

    ```shell script
    export NS={your-namespace}
    ```

  * Windows PowerShell

    ```powershell
    $NS={your-namespace}
    ```


```
kubectl apply -n $NS -f k8s/function.yaml
kubectl apply -n $NS -f k8s/subscription.yaml
```

## Verify

Trigger the function with an OData Payload via the `sap.kyma.custom.internal.product.reviewsubmitted.v1` event, 
or via SAP Commerce Cloud Webhook if you have the [customer-review-webhook](../customer-review-webhook) function configured.

See [Main README.md](../../README.md) for example payload.