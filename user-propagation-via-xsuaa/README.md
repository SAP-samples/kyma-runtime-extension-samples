# Overview

![Flow](assets/identity-propagation-via-xsuaa.svg)

## Steps

- Create Destination Service instance
- Create Trust Between SCP and IAS
- Create XSUAA instance
- Deploy httpbin Application
- Deploy c4c-extension Application
- Deploy Auth Proxy Application

  ```shell script
  kubectl -n identity-propagation-via-xsuaa apply -f https://raw.githubusercontent.com/istio/istio/master/samples/httpbin/httpbin.yaml
  ```

## To DO

- [x] Put the modified angular app in this directory
- [x] Update the proxy so that `/api` is not required in the path
- [ ] The c4c-extension-with-user-context is not providing a proper response when a 401 occurs, UI receives 201 (login with uaa user to test)
- [x] Can the login screen be configured to only allow IAS auth, may be a property in xsuaa instance config?

## Create Trust Between SCP and IAS

<sup>Full details can be found at [help.sap.com](https://help.sap.com/viewer/65de2977205c403bbc107264b8eccf4b/Cloud/en-US/7c6aa87459764b179aeccadccd4f91f3.html#loio7c6aa87459764b179aeccadccd4f91f3) </sup>

- In your Identity Authentication service (IAS) tenant download the SAML Metadata file by choosing the menu option **Applications & Resources** -> **Tenant Settings** -> **SAML 2.0 Configuration**. Choose the option to **Download Metadata File**.
- In your SAP Cloud Platform Subaccount choose the menu option **Security** -> **Trust Configuration**. Choose the option **New Trust Configuration** and upload the file downloaded from your IAS tenant in the previous step.
- In your SAP Cloud Platform Subaccount choose the menu option **Security** -> **Trust Configuration**. Choose the option **SAML Metadata** to download the SCP metadata.
- In your Identity Authentication service (IAS) tenant choose the menu option **Applications & Resources** -> **Applications**. Choose **Add**, provide a name and save the application.
- In the IAS application choose **SAML 2.0 Configuration**. Choose the option **Browse** and provide the SAML Metadata file downloaded from SCP. Save the changes.
- In the IAS application choose **Subject Name Identifier** and set the **basic attribute** to use the field which would map to the C4C user. Save the changes.

## Create XSUAA Instance

1. Within the Kyma console open the namespace `dev`
2. Choose `Service Management` -> `Catalog`.
3. Choose the service `Authorization & Trust Management`
4. Choose `Add`
5. Choose the Plan `application`
6. Choose `Add parameters` and provide the object after adjusting it to your needs.

To specify use of only IAS authentication provide the **Origin Key** shown in the Trust Configuration list within SCP for the value of **allowedproviders**, otherwise this property can be omitted to allow either XSUAA or IAS users.

```json
{
  "oauth2-configuration": {
    "allowedproviders": ["<origin key>"],
    "redirect-uris": ["https://app-auth-proxy.<cluster domain>/oauth/callback"]
  },
  "xsappname": "c4c-user-prop"
}
```

<sup> For a complete list of parameters visit [Application Security Descriptor Configuration Syntax](https://help.sap.com/viewer/4505d0bdaf4948449b7f7379d24d0f0d/2.0.04/en-US/6d3ed64092f748cbac691abc5fe52985.html) </sup>

1. Once the instance is provisioned choose the option `Create Credentials`
2. Under the `Credentials` tab choose the `Secret` which should display the instance secret in a dialog. Choose `Decode` to view the values. These will be needed if running the sample locally.

## Deploy Auth Proxy Application

The [auth proxy](../app-auth-proxy/README.md) provides serverside authentication using the OIDC configuration provided by xsuaa. Due to the trust setup between SCP and IAS, IAS can be used to authenticate and provide a user store.

1. Within `./k8s/auth-proxy/configmap.yaml` adjust the **cluster-domain** value of the **redirect_uri** o match the domain of the Kyma runtime and then apply the ConfigMap:

```shell script
kubectl -n dev apply -f ./k8s/auth-proxy/configmap.yaml
```

3. Get the name of the xsuaa ServiceInstance:

```shell script
kubectl -n dev get serviceinstances
```

For example:

| NAME                   | CLASS                     | PLAN        | STATUS | AGE |
| ---------------------- | ------------------------- | ----------- | ------ | --- |
| **_xsuaa-showy-yard_** | ClusterServiceClass/xsuaa | application | Ready  | 63m |

4. Within `./k8s/auth-proxy/deployment.yaml` adjust the value of `<Service Instance Name>` to the XSUAA service instance name and the apply the Deployment:

```shell script
kubectl -n dev apply -f ./k8s/auth-proxy/deployment.yaml
```

5. Apply the APIRule:

```shell script
kubectl -n dev apply -f ./k8s/auth-proxy/apirule.yaml
```
