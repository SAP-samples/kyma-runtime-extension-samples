# commerce-impex

This directory contains **Impex** files to configure components in SAP Commerce. For information on how to import the data into SAP Commerce, see the SAP Commmerce Help topic on  [Data Management with Impex](https://help.sap.com/docs/SAP_COMMERCE/d0224eca81e249cb821f2cdf45a82ace/1b6dd3451fc04c3aa8e95937e9ef2471.html?q=impex)

## Impex Files

[projectdata-integration-objects.impex](projectdata-integration-objects.impex)

> Contains the configuration for the `CustomerProductReview` Integration Object.  This is the payload that is sent by the SAP Commerce webhook for extension processing

[projectdata-register-integration-object.impex](projectdata-register-integration-object.impex)

> Contains the configuration to create the Integration API access to the `CustomerProductReview` data.  For more information, please see this [blog post](https://blogs.sap.com/2022/10/14/commerce-cloud-exposing-integration-apis-to-sap-btp-kyma-runtime-with-oauth2/) on SAP Community.

[webhooks.impex](webhooks.impex)

> Contains the configuration to enable the outbound webhook processing to call our [webhook handler](../lambdas/customer-review-webhook/) in Kyma with the `CustomerProductReview` payload.  This configuration is based on the [SAP Commerce Help example](https://help.sap.com/docs/SAP_COMMERCE/50c996852b32456c96d3161a95544cdb/711e753f2fb546c5b88ed6c3b8dfb116.html)

