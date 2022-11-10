# Product Review Sentiment Analysis with SAP Commerce Cloud and SAP BTP, Kyma runtime

## Introduction

Marketers strive to get feedback on their customers' sentiment regarding the products they sell. SAP Commerce Cloud is in a unique position to capture this data, analyze it and respond in real-time.  This example shows how to leverage the product review functionality of SAP Commerce Cloudwith a **side-by-side extension** deployed in SAP BTP, Kyma runtime.  The benefit of this approach is that there are no code changes required in SAP Commerce.  All that is required is some configuration and data.  This **allows** the following:

- Event driven business process decoupled from the core SAP Commerce Cloud processing

- Increased agility to build and deploy the extension, and to adapt it as as requirements change.

- Increased customer engagement and improved customer experience by quickly addressing concerns.

The following things are **avoided** with SAP Commerce Cloud:

- Downtime for deployments

- Impact to ongoing upgrades due to complicated custom code (keeping the core clean!)

- Runtime impact due to additional processing

- Extension delivery tied to core SAP Commerce Cloud deployment schedule

## Architecture

![Architecture Diagram](diagram.jpg "Architecture Diagram")


The architecture diagram describes use case flow.

## Components

- [SAP Commerce Cloud configuration](commerce-impex) - Impex files to configure the Integration API, webhook, exposed and consumed destinations and OAuth2 credentials for SAP Commerce.

- [Content moderation service](services/content-moderation) - Microservice to provide an indication if the text content is appropriate for publication on the storefront website.

### Functions

- [Customer Review Webhook Handler](lambdas/customer-review-webhook) - Handler function for the outbound webhook configured in SAP Commerce.  It creates an internal CloudEvent to trigger downstream processing.

- [Text Analysis Function](lambdas/text-analysis) - Function that analyzes text input and provides an indication of positive or negative sentiment.

- [Sentiment Analysis Function](lambdas/sentiment-analysis) - The main function that processes the event and calls downstream services to analyze text and update SAP Commerce Cloud and SAP Sales Cloud, and send notification messages to Slack

## Prerequisites

- An SAP BTP Kyma runtime instance is required.  The extension components run in a namespace named `sentiment-analysis` by default.

- SAP Commerce Cloud environment connected to SAP BTP Kyma runtime.  

- (Optional) SAP Sales Cloud (Cloud for Customer) connected to SAP BTP Kyma runtime if you enable the `c4cUpdateFlag` (see below)

See [SAP Help](https://help.sap.com/docs/BTP/65de2977205c403bbc107264b8eccf4b/83df31ad3b634c0783ced522107d2e73.html) for details on how to connect SAP Commerce Cloud and SAP Sales Cloud to SAP BTP Kyma runtime.

## Configuration

The extension requires a `Secret` named `sentiment-analysis` configured in the Kyma namespace containing the following values:

- `baseSite`:  The SAP Commerce Cloud baseSite value e.g. `electronics`, required by the SAP Commerce Cloud OCC API.

- `c4cUpdateFlag`: Feature flag to enable the calls to SAP Sales Cloud to create customer and service ticket for negative reviews. If value is `true` then the feature is enabled.

- `gateway_url_c4c` - URL for the SAP Sales Cloud API provided by the Kyma Central Application Gateway

- `gateway_url_review` - URL for the SAP Commerce Cloud Integration API for Customer Reviews provided by the Kyma Central Application Gateway

- `slackUrl` - The Slack webhook for posting messages to the notification channel.

- `svcUrlContentModeration` - URL for the local [Content moderation service](services/content-moderation)

- `svcUrlTextAnalysis` - URL for the local [Text Analysis function](lambdas/text-analysis)

## Deploy

Deployment steps are described in each component's README.md file.

- Deploy `projectdata-integration-objects.impex` and `projectdata-register-integration-object.impex` files in [commerce-impex](commerce-impex)

- Deploy the [content-moderation](services/content-moderation) service

- Deploy each function:

    - [Customer Review Webhook Handler](lambdas/customer-review-webhook) 
    
    - [Text Analysis Function](lambdas/text-analysis)

    - [Sentiment Analysis Function](lambdas/sentiment-analysis)

- Deploy `webhooks.impex` file in [commerce-impex](commerce-impex)

## Verify

In SAP Commerce Cloud storefront (Spartacus or Accelerator), log in as a user and create a product review.  

### Example Payload

```
{
    "d": {
        "__metadata": {
            "id": "https://backoffice.<your-env>.model-t.cc.commerce.ondemand.com:443/odata2webservices/CustomerProductReview/CustomerReviews('Online%7CapparelProductCatalog%7C1667409165852%7C29533%7Creviewer1%2540hybris.com')",
            "uri": "https://backoffice.<your-env>.model-t.cc.commerce.ondemand.com:443/odata2webservices/CustomerProductReview/CustomerReviews('Online%7CapparelProductCatalog%7C1667409165852%7C29533%7Creviewer1%2540hybris.com')",
            "type": "HybrisCommerceOData.CustomerReview"
        },
        "alias": null,
        "headline": "This is a fantastic product, did everything I wanted it to do.",
        "blocked": false,
        "comment": "Best product ever!",
        "creationtime": "/Date(1667409165852)/",
        "rating": "5.0",
        "integrationKey": "Online|apparelProductCatalog|1667409165852|29533|reviewer1%40hybris.com",
        "product": {
            "__deferred": {
                "uri": "https://backoffice.<your-env>.model-t.cc.commerce.ondemand.com:443/odata2webservices/CustomerProductReview/CustomerReviews('Online%7CapparelProductCatalog%7C1667409165852%7C29533%7Creviewer1%2540hybris.com')/product"
            }
        },
        "approvalStatus": {
            "__deferred": {
                "uri": "https://backoffice.<your-env>.model-t.cc.commerce.ondemand.com:443/odata2webservices/CustomerProductReview/CustomerReviews('Online%7CapparelProductCatalog%7C1667409165852%7C29533%7Creviewer1%2540hybris.com')/approvalStatus"
            }
        },
        "language": {
            "__deferred": {
                "uri": "https://backoffice.<your-env>.model-t.cc.commerce.ondemand.com:443/odata2webservices/CustomerProductReview/CustomerReviews('Online%7CapparelProductCatalog%7C1667409165852%7C29533%7Creviewer1%2540hybris.com')/language"
            }
        },
        "user": {
            "__deferred": {
                "uri": "https://backoffice.<your-env>.model-t.cc.commerce.ondemand.com:443/odata2webservices/CustomerProductReview/CustomerReviews('Online%7CapparelProductCatalog%7C1667409165852%7C29533%7Creviewer1%2540hybris.com')/user"
            }
        }
    }
}
```