# C4C Backend Extensibility

As a custom IAS tenant is used, it is required to log in using a private browsing session not to interfere with the global SAP IAS tenant.

## Scenario abstract

The demo requires C4C system integrated with Kyma or SAP Cloud Platform box. In case of the Kyma box, a Redis database is required. The C4C system must be connected to SAP Cloud Identity instance.

Part of this project are two lambda functions. Both functions are bound to Redis and C4C instances and exposed via HTTP. For authentication, the JWKS URL and Issuer of the SAP Cloud Identity tenant is required.

The UI extension is an Angular application with OIDC client. An OIDC client is required to authenticate the user in the frontend. The extension UI is hooked into an activity task using C4C Mashups.

## Project structure

The project contains the following directories:
- `functions`
- `customization`

### Functions

This directory contains the following functions:

**create-customization.js** - a function that stores a customization request
**get-customization.js** - a function that retrieves a customization
**update-customization** - a function that retrieves a webhook from Slack to update the customization request

### Customization

This directory contains an Angular application that is used inside a mashup.
