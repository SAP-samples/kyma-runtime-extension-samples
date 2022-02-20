# SAP Cloud for Customer Backend Extensibility

As a custom IAS tenant is used, it is required to log in using a private browsing session not to interfere with the global SAP IAS tenant.

## Scenario abstract

The demo requires an SAP Cloud for Customer system integrated with SAP BTP, Kyma runtime. The SAP Cloud for Customer system must be connected to SAP Cloud Identity instance.

Part of this project are two lambda functions. Both functions are bound to Redis and SAP Cloud for Customer instances and exposed via HTTP. For authentication, the JWKS URL and Issuer of the SAP Cloud Identity tenant is required.

The UI extension is an Angular application with OIDC client. An OIDC client is required to authenticate the user in the frontend. The extension UI is hooked into an activity task using SAP Cloud for Customer Mashups.

## Project structure

The project contains the following directories:

- `functions`
- `customization`

### Functions

This directory contains the following functions:

- **create-customization.js** - a function that stores a customization request
- **get-customization.js** - a function that retrieves a customization
- **update-customization** - a function that retrieves a webhook from Slack to update the customization request

### Customization

This directory contains an Angular application that is used inside a mashup.
