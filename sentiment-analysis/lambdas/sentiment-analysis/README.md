# sentiment-analysis

This function is the main business logic for the product review sentiment analysis use case.

It uses the `nodejs16` function runtime and is triggered by a `CloudEvent` called `sap.kyma.custom.internal.product.reviewsubmitted.v1`.  

This function requires a `Secret` named `sentiment-analysis` with entries described in the [main README.md](../../README.md)


[handler.js](handler.js) - Javscript source code for the business logic.

[package.json](package.json) - Dependencies for the function

[k8s/function.yaml](k8s/function.yaml) - `Function` configuration for the function.

[k8s/subscription.yaml](k8s/subscription.yaml) - `Subscription` to enable the event trigger.