# commerce-impex

## Overview

This directory contains **Impex** files to configure components in SAP Commerce. For information on how to import the data into SAP Commerce, see the SAP Commmerce Help topic on  [Data Management with Impex](https://help.sap.com/docs/SAP_COMMERCE/d0224eca81e249cb821f2cdf45a82ace/1b6dd3451fc04c3aa8e95937e9ef2471.html?q=impex)

## Impex Files

[projectdata-integration-objects.impex](projectdata-integration-objects.impex)

Contains the configuration for the `CustomerProductReview` Integration Object.  This is the payload that is sent by the SAP Commerce Cloud webhook for extension processing

[projectdata-register-integration-object.impex](projectdata-register-integration-object.impex)

Contains the configuration to create the Integration API access to the `CustomerProductReview` data.  For more information, please see this [blog post](https://blogs.sap.com/2022/10/14/commerce-cloud-exposing-integration-apis-to-sap-btp-kyma-runtime-with-oauth2/) on SAP Community.

**NOTE** The beginning of this file has 2 variables that should be adjusted to ensure your API is secure:
- `$oAuthUser`: The user ID in the `integrationadmingroup` which controls access to the Integration Object

- `$oAuthPassword`: The password for `$oAuthUser` which is also the client secret for the OAuth2 client used to get an access token for this Integration API

[webhooks.impex](webhooks.impex)


Contains the configuration to enable the outbound webhook processing to call our [webhook handler](../lambdas/customer-review-webhook/) in Kyma with the `CustomerProductReview` payload.  This configuration is based on the [SAP Commerce Cloud Help example](https://help.sap.com/docs/SAP_COMMERCE/50c996852b32456c96d3161a95544cdb/711e753f2fb546c5b88ed6c3b8dfb116.html)

**NOTE** The beginning of this file has 3 variables that should be adjusted to allow the webhook to successfully call the Kyma API. See [api-access.yaml](../lambdas/customer-review-webhook/k8s/api-access.yaml)

- `$kyma_domain`: The domain of your Kyma cluster

- `$oauth_client_id`: The client ID generated for the Kyma `OAuth2Client` named `sentiment-analysis-client` 

- `$oauth_client_secret`: The client secret generated for the same `OAuth2Client`


## Deploy

Import the `.impex` files in your SAP Commerce Cloud environment via the Adminstration Cockpit (hAC) or alternative method.

See the SAP Commmerce Help topic on  [Data Management with Impex](https://help.sap.com/docs/SAP_COMMERCE/d0224eca81e249cb821f2cdf45a82ace/1b6dd3451fc04c3aa8e95937e9ef2471.html?q=impex)

To add the Integration Object to the registered Kyma Destination Target, you must use the SAP Commerce Cloud Backoffice as described in **Expose Your API – Existing Destination Target** section in the referenced [blog post](https://blogs.sap.com/2022/10/14/commerce-cloud-exposing-integration-apis-to-sap-btp-kyma-runtime-with-oauth2/) on SAP Community

## Verify

Access the Integration API using Rest client such as Postman or command line:


* Set up environment variables

  * OSX

    ```shell script
    export CCHOST={your-sap-commerce-cloud-host}
    export CLIENT_SECRET={client secret configured in projectdata-register-integration-object.impex}
    ```

  * Windows PowerShell

    ```powershell
    $CCHOST={your-sap-commerce-cloud-host}
    $CLIENT_SECRET={client secret configured in projectdata-register-integration-object.impex}
    ```


```

curl -X POST -d "client_id=odatauser-client&client_secret=$CLIENT_SECRET&grant_type=client_credentials" https://$CCHOST/authorizationserver/oauth/token

## Extract access_token from response

curl -L -X GET https://$CCHOST/odata2webservices/CustomerProductReview/CustomerReviews -H 'Accept: application/json' -H 'Authorization: Bearer {your access_token}'
```

Test the Webhook using the **Validate Webhook Configuration** feature in SAP Commerce Cloud Backoffice. See [Validating Webhook Configurations](https://help.sap.com/docs/SAP_COMMERCE/50c996852b32456c96d3161a95544cdb/4a9ca4a5e2984375bc7d0b600dc26c47.html) in SAP Commerce Cloud Help.