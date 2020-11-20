# Overview

This sample demonstrates how a user propagation flow can be achieved when extending SAP Cloud for Customer(C4C) using SAP Cloud Platform, Kyma runtime.

It uses SAP Cloud Platform Identity Authentication Service (IAS) as an external identity provider with user federation. However, any external identity provider would also work as long as it supports SAML 2.0.

The JWT token received in Kyma needs to be exchanged for an OAuth2 token that can be authenticated by SAP Cloud for Customer. For this purpose, the [Destination Service](https://help.sap.com/viewer/cca91383641e40ffbe03bdc78f00f681/Cloud/en-US/7e306250e08340f89d6c103e28840f30.html) is used.

## Flow

![c4c-sso-kyma-identity-propagation](assets/sso-identity-propagation-flow-2.svg)

1. User signs in to C4C with a single ID and password (SSO).
2. C4C redirects the user to IAS for authentication.
3. User signs in to IAS.
4. User is signed in to C4C with SAML bearer assertion.
5. User accesses the frontend. The frontend can be a mesh inside C4C or a standalone app hosted on Kyma or somewhere else. The frontend redirects the user to IAS for automatic login. Along with the autologin request, the frontend receives the bearer token.
6. The frontend makes an API call to Kyma with the bearer token.
7. Kyma API Gateway verifies the token with IAS.
8. API Gateway forwards calls to a Function/microservice along with the bearer token. Token forwarding is made possible by adding an attribute to the Kyma API rule.
9. Microservice/Function does the token exchange via the Destination Service. The Destination Service calls C4C and performs the OAuth2 SAML bearer assertion flow.
10. Microservice/Function makes a call to C4C with the OAuth2 token it got from the Destination Service.

> **NOTE:** The flow does not use Application Gateway when calling C4C from the Kyma runtime. Instead, it calls the APIs directly.

## Prerequisites

* SAP Cloud Platform, Kyma runtime instance
* SAP Cloud for Customer tenant
* SAP Cloud Platform Identity Authentication Service tenant
* OAuth 2.0-based authentication between IAS, SAP Cloud Platform, and C4C requires the same user ID to exist in both IAS and C4C.

## Configuration

### Single sign-on

Set up single sign-on (SSO) using IAS with C4C. Refer to the [official documentation](https://help.sap.com/viewer/abfba1342cfb4832ab722fa041f6c4b7/CLOUD/en-US/f1e6f23267b542ce9a906823c70dc583.html) for details.

### User propagation

Configure user propagation between C4C and Kyma runtime.

[This blog](https://blogs.sap.com/2017/11/14/configuring-oauth-2.0-between-sap-hybris-cloud-for-customer-and-sap-cloud-platform/) was used as a reference. It was written for Neo, but some steps are also applicable for Kyma runtime.

You will end up creating a Destination Service in SAP Cloud Platform. It will be later on used by the microservice to do the token exchange.

* Download the `Trust` certificate from **Subaccount** --> **Destinations** --> **Download Trust**.
  ![download-trust](assets/download-trust.png)

* Log on to your C4C system as an administrator. Go to **ADMINISTRATOR** --> **Common Tasks**. Choose **Configure OAuth 2.0 Identity Provider** and select **New OAuth2.0 Provider**.

  * Get the issuing entity name from the certificate. You can use OpenSSL to view certificate details.

    ```shell script
    openssl x509 -in {cert path} -text -noout
    ```

  * Upload the certificate.
  ![new-oauth2-provider](assets/new-oauth2-provider.png)

* Register an Oauth2 Client in C4C.
  ![register-oauth-client](assets/register-oauth-client.png)

* Create a destination in SAP Cloud Platform. Under your subaccount, go to **Connectivity** --> **Destinations**.
  ![http-destination](assets/http-destination.png)

  Configure these additional properties:
  `authnContextClassRef` : `urn:none`
  `scope`                : `UIWC:CC_HOME`

### Identifier used by the Destination Service to get the token

The Destination Service uses whatever is specified in the `userIdSource` property. If not specified, it would require either `user_name` or `email` depending upon the `nameIdFormat`
In this example, `user_name` is mapped to the **Login name** attribute.

![assertion-atributes](assets/assertion-attributes.png)

## Components for the sample

### httpbin

httpbin is a service that returns all the request headers to the `/headers` endpoint.

It is used for demonstrating and verifying that the token is forwarded from the API Gateway to the microservice.

* Deploy httpbin.

    ```shell script
    kubectl -n identity-propagation apply -f https://raw.githubusercontent.com/istio/istio/master/samples/httpbin/httpbin.yaml
    ```

* Expose it with an [API rule](k8s/apirule-httpbin.yaml). The API rule is configured to forward headers, such as `Bearer Token`, to the microservice.

  * Update `jwks_urls` and `trusted_issuers` with the IAS tenant.

  * Deploy the API rule.

    ```shell script
    kubectl -n identity-propagation apply -f k8s/apirule-httpbin.yaml
    ```

### Extension

The second microservice is the one that implements the extension logic and where the user propagation happens.

* It receives the JWT token that is forwarded from the API Gateway.
* The token is used to do a token exchange via the Destination Service.
* A call is made to C4C to create a task with the exchanged token that contains the user context.
* The task is created with the logged-in user as the processor, not a static user.

#### Setup

* Create a Destination Service instance in the Kyma Service Catalog. This will be used to get the credentials to make the call to the Destination Service.

    ![create instance](assets/create-destination-instance.png)

* Create credentials for the instance.

    ![kyma destination service instance](assets/destination-service-kyma-instance.png)

* Deploy the extension with user propagation.

  * Update `DESTINATION_NAME` in [`deployment.yaml`](c4c-extension-with-user-context/k8s/deployment.yaml) with the name of the destination created in SAP Cloud Platform.

  * Deploy the extension.

    ```shell script
      kubectl apply -f c4c-extension-with-user-context/k8s/deployment.yaml
    ```

* Bind the extension to the Destination Service instance.
![bind instance](assets/bind-application.png)

* Expose it with an [API rule](c4c-extension-with-user-context/k8s/api-rule.yaml). Similarly to `httpbin`, the API rule is configured to forward headers, such as `Bearer Token`, to the microservice.

  * Update `jwks_urls` and `trusted_issuers` with the `SAP Cloud Identity` tenant.

  * Deploy the API rule.

    ```shell script
      kubectl -n identity-propagation apply -f c4c-extension-with-user-context/k8s/apirule.yaml
    ```

### Angular app

It simulates the SSO flow and makes API calls to the extensions deployed to the Kyma runtime.

The app automatically logs the user in after they have been signed into C4C through SSO. It is registered in the IAS as an application.
![angular-app-registeration](assets/angular-app-configuration.png)

The app makes a call to the httpbin service to the `/headers` URI path. The httpbin service replies with all the HTTP headers received.

![angular home](assets/angular-app-home.png)

It makes another call to create a C4C task for the logged-in user.

![angular create c4c task](assets/create-task.png)

#### Set up and access the app

Follow these steps:

* Update the [deployment file](k8s/angular-app.yaml). Provide values for `HTTP_BIN`, `OIDC_URL`, and `C4C_EXT_URL`.

* Deploy the app:

  ```shell script
  kubectl -n identity-propagation apply -f k8s/angular-app.yaml
  ```

* Expose the app using an API Rule:

  ```shell script
  kubectl -n identity-propagation apply -f k8s/apirule-angular-app.yaml
  ```

* Access the app at `https://sample-angular-app.{kyma-cluster-domain}`.`

## Takeaways

* It is possible to build in the Kyma runtime the extensions and flows that require user propagation. This feature has been requested by various customers.
* Although the sample is built for SAP Cloud for Customer, a similar approach can be applied to other SAP Solutions, such as SuccessFactors.
* The approach requires an extension to build the logic required to fetch the token.
* The flow does not make the call via Application Gateway but directly calls the SAP Cloud For Customer APIs with the token it got from the Destination Service.
