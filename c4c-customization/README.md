# C4C Backend Extensibility

As a custom IAS Tenant is used, it is required to login using a private browsing session to not interfere with the global SAP IAS Tenant.

## Scenario abstract

The demo requires C4C system, integrated with a Kyma or SAP CP XF box. On the Kyma box a redis database is required. The C4C system has to be connected to an SAP Cloud Identity Instance.

Part of this project are two lambda functions. Both functions are bound to the redis and c4c instance and exposed via https. For authentication, the JWKS URL and Issuer of the SAP Cloud Identity Tenant is required.

The UI Extension is a angular application with OIDC client. An OIDC Client is required to authenticated the user in the frontend. The Extension UI is hooked into an activity task using C4C Mashups.

## What's inside?

### Functions

**create-customization.js** A function to store a customization request.  
**get-customization.js** A function to retriev a customization
**update-customization** A function retrieving a webhook from slack to update the customization request

### Customization

Contains a angular app to be used inside a mashup.
