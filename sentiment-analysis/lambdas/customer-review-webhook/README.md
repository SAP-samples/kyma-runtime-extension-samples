# customer-review-webhook

This function is the handler for the `CustomerProductReview` webhook configured in SAP Commerce. (see [webhooks.impex](../../commerce-impex/webhooks.impex)) 

It uses the `nodejs16` function runtime and creates a `CloudEvent` from the webhook payload and places it on an internal custom event called `sap.kyma.custom.internal.product.reviewsubmitted.v1`.  

This API is protected with OAuth2 which also must be configured in SAP Commerce. 

It is configured to pull the source code directly from Git.  The 

[handler.js](handler.js) - Javscript source code for the webhook handler

[package.json](package.json) - Dependencies for the function

[k8s/function.yaml](k8s/function.yaml) - `Function` configuration for the handler.

[k8s/api-access.yaml](k8s/api-access.yaml) - `APIRule` to expose the function and a `OAuth2Client` to provide the OAuth2 authentication token.  