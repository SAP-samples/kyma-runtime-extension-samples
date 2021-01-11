Setup app-auth-proxy with config

### Create XSUAA Service Instance

1. Create a new `saas` Namespace:

```shell script
kubectl create namespace saas
```

2. Within the Kyma console open the namespace `saas`
3. Choose `Service Management` -> `Catalog`.
4. Choose the service `Authorization & Trust Management`
5. Choose `Add`
6. Choose the Plan `application`
7. Choose `Add parameters` and provide the object after adjusting it to your needs.

```json
{
  "oauth2-configuration": {
    "redirect-uris": ["https://app-auth-proxy.<cluster domain>/oauth/callback"]
  },
  "scopes": [
    {
      "name": "$XSAPPNAME.Viewer",
      "description": "Viewer"
    },
    {
      "name": "$XSAPPNAME.Editor",
      "description": "Editor"
    },
    {
      "description": "With this scope set, the callbacks for tenant onboarding, offboarding and getDependencies can be called.",
      "grant-as-authority-to-apps": [
        "$XSAPPNAME(application,sap-provisioning,tenant-onboarding)"
      ],
      "name": "$XSAPPNAME.Callback"
    }
  ],
  "tenant-mode": "shared",
  "xsappname": "saas-provisioning-demo"
}
```

### Deploy App Auth Proxy

1. In the file **./k8s/app-auth-proxy/deployment.yaml** adjust the name of the <Service Instance Name> to the name of the SaaS Provisioning service instance.

```shell script
kubectl apply -f ./k8s/app-auth-proxy/config-map.yaml -n saas
```

```shell script
kubectl apply -f ./k8s/app-auth-proxy/apirule.yaml -n saas
```

```shell script
kubectl apply -f ./k8s/app-auth-proxy/deployment.yaml -n saas
```

### Deploy SAAS Provisioning App

```shell script
docker build -t <docker id>/saas-provisioning -f docker/Dockerfile .
```

```shell script
docker push <docker id>/saas-provisioning
```

```shell script
kubectl apply -f ./k8s/saas-provisioning/deployment.yaml -n saas
```

Adjust Issuer and JWKS URI within apirule.yaml, for example

**TRIAL**

- Issuer: https://sap-provisioning.authentication.us10.hana.ondemand.com/uaa/oauth/token
- JWKS URI: http://sap-provisioning.localhost:8080/uaa/oauth/token

**PRODUCTION**

- Issuer: https://sap-provisioning.authentication.sap.hana.ondemand.com/token_keys
- JWKS URI: http://sap-provisioning.localhost:8080/uaa/oauth/token

```shell script
kubectl apply -f ./k8s/saas-provisioning/apirule.yaml -n saas
```

### Create SAAS Provioning Instance

1. Choose the generated secret
2. Choose `Decode`
3. Copy the **xsappname**, this will be used as the **appId** in the **Create SAAS Provioning Instance** step.

4. In **Service Management -> Instances** open the **Authorization & Trust Management** instance
5. Choose the **Credentials** tab and choose the **secret**
6. Choose **Decode**
7. Copy the **xsappname**, this will be used as the **appId** in the json below.
8. Choose **Service Management** -> **Catalog**.
9. Choose the service **SaaS Provisioning**
10. Choose **Add**
11. Choose the Plan **application**
12. Choose **Add parameters** and provide the object after adjusting it to your needs.

```json
{
  "xsappname": "saas-provisioning-demo",
  "displayName": "Kyma SAAS Provisioning Demo",
  "description": "A sample app to explain the concepts of Multitenancy",
  "category": "Kyma Demo",
  "appUrls": {
    "onSubscription": "https://saas-provisioning-demo.<cluster domain>/callback/v1.0/tenants/{tenantId}"
  }
}
```

### HTTPBin test

```shell script
kubectl -n saas apply -f https://raw.githubusercontent.com/istio/istio/master/samples/httpbin/httpbin.yaml
```

```json
{
  "authorities": ["$ACCEPT_GRANTED_AUTHORITIES"],
  "foreign-scope-references": ["$ACCEPT_GRANTED_SCOPES"],
  "oauth2-configuration": {
    "redirect-uris": ["https://app-auth-proxy.<cluster domain>/oauth/callback"]
  },
  "role-collections": [
    {
      "description": "My SaaS App Administrator",
      "name": "saas-provisioning-demo_Administrator",
      "role-template-references": [
        "$XSAPPNAME.Administrator",
        "$XSAPPNAME.User"
      ]
    },
    {
      "description": "My SaaS App User",
      "name": "saas-provisioning-demo_User",
      "role-template-references": ["$XSAPPNAME.User"]
    }
  ],
  "role-templates": [
    {
      "description": "Administrator",
      "name": "Administrator",
      "scope-references": ["$XSAPPNAME.Administrator"]
    },
    {
      "description": "User",
      "name": "User",
      "scope-references": ["$XSAPPNAME.User"]
    }
  ],
  "scopes": [
    {
      "description": "With this scope set, the callbacks for tenant onboarding, offboarding and getDependencies can be called.",
      "grant-as-authority-to-apps": [
        "$XSAPPNAME(application,sap-provisioning,tenant-onboarding)"
      ],
      "name": "$XSAPPNAME.Callback"
    },
    {
      "description": "Administrate the application",
      "name": "$XSAPPNAME.Administrator"
    },
    {
      "description": "Use the application",
      "name": "$XSAPPNAME.User"
    }
  ],
  "tenant-mode": "shared",
  "xsappname": "saas-provisioning-demo"
}
```

HELP
https://help.sap.com/viewer/65de2977205c403bbc107264b8eccf4b/Cloud/en-US/ff540477f5404e3da2a8ce23dcee602a.html
