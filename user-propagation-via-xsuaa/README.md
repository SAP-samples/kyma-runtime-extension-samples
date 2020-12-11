# Overview

![Flow](assets/identity-propagation-via-xsuaa.svg)

## Steps

- Create Destination Service instance
- Deploy c4c-extension
- Create xsuaa instance
- Create trust between SCP and IAS
- Deploy auth proxy
- Deploy httpbin.

  ```shell script
  kubectl -n identity-propagation-via-xsuaa apply -f https://raw.githubusercontent.com/istio/istio/master/samples/httpbin/httpbin.yaml
  ```

## To DO

- [x] Put the modified angular app in this directory
- [x] Update the proxy so that `/api` is not required in the path
- [ ] The c4c-extension-with-user-context is not providing a proper response when a 401 occurs, UI receives 201 (login with uaa user to test)
- [ ] Can the login screen be configured to only allow IAS auth, may be a property in xsuaa instance config?

## Create trust between SCP and IAS

- In your Identity Authentication service (IAS) tenant download the SAML Metadata file by choosing the menu option **Applications & Resources** -> **Tenant Settings** -> **SAML 2.0 Configuration**. Choose the option to **Download Metadata File**.
- In your SAP Cloud Platform Subaccount choose the menu option **Security** -> **Trust Configuration**. Choose the option **New Trust Configuration** and upload the file downloaded from your IAS tenant in the previous step.
- In your SAP Cloud Platform Subaccount choose the menu option **Security** -> **Trust Configuration**. Choose the option **SAML Metadata** to download the SCP metadata.
- In your Identity Authentication service (IAS) tenant choose the menu option **Applications & Resources** -> **Applications**. Choose **Add**, provide a name and save the application.
- In the IAS application choose **SAML 2.0 Configuration**. Choose the option **Browse** and provide the SAML Metadata file downloaded from SCP. Save the changes.
- In the IAS application choose **Subject Name Identifier** and set the **basic attribute** to use the field which would map to the C4C user. Save the changes.
