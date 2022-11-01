# Product Review Sentiment Analysis with SAP Commerce and SAP BTP, Kyma runtime

## Introduction

Marketers strive to get feedback on their customers' sentiment regarding the products they sell. SAP Commerce is in a unique position to capture this data, analyze it and respond in real-time.  This example shows how to leverage the product review functionality of SAP Commerce with a **side-by-side extension** deployed in SAP BTP, Kyma runtime.  The benefit of this approach is that there are no code changes required in SAP Commerce.  All that is required is some configuration and data.  This **allows** the following:

- Event driven business process decoupled from the core commerce processing

- Increased agility to build and deploy the extension, and to adapt it as as requirements change.

- Increased customer engagement and improved customer experience by quickly addressing concerns.

The following things are **avoided** with SAP Commerce Cloud:

- Downtime for deployments

- Impact to ongoing upgrades due to complicated custom code (keeping the core clean!)

- Runtime impact due to additional processing

- Extension delivery tied to core SAP Commerce deployment schedule

## Architecture

![Architecture Diagram](diagram.jpg "Architecture Diagram")


The architecture diagram describes use case flow.

## Components

- [SAP Commerce Cloud configuration](commerce-impex) - Impex files to configure the Integration API, webhook, exposed and consumed destinations and OAuth2 credentials for SAP Commerce.

- [Content moderation service](services/content-moderation) - Microservice to provide an indication if the text content is appropriate for publication on the storefront website.

### Functions

- [Customer Review Webhook Handler](lambdas/customer-review-webhook) - Handler function for the outbound webhook configured in SAP Commerce.  It creates an internal CloudEvent to trigger downstream processing.

- [Text Analysis Function](lambdas/text-analysis) - Function that analyzes text input and provides an indication of positive or negative sentiment.

- [Sentiment Analysis Function](lambdas/sentiment-analysis) - The main function that processes the event and calls downstream services to analyze text and update SAP Commerce and SAP Sales Cloud, and send notification messages to Slack

## Configuration

The extension requires a `Secret` named `sentiment-analysis` configured in the Kyma namespace containing the following values:

- `baseSite`:  The SAP Commerce baseSite value e.g. `electronics`, required by the SAP Commerce OCC API.

- `c4cUpdateFlag`: Feature flag to enable the calls to SAP Sales Cloud to create customer and service ticket for negative reviews.

- `gateway_url_c4c` - URL for the SAP Sales Cloud API provided by the Kyma Central Application Gateway

- `gateway_url_review` - URL for the SAP Commerce Cloud Integration API for Customer Reviews provided by the Kyma Central Application Gateway

- `slackUrl` - The Slack webhook for posting messages to the notification channel.

- `svcUrlContentModeration` - URL for the local [Content moderation service](services/content-moderation)

- `svcUrlTextAnalysis` - URL for the local [Text Analysis function](lambdas/text-analysis)

