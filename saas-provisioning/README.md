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
    "redirect-uris": [
      "https://saas-provisioning-demo.<cluster domain>/oauth/callback"
    ]
  },
  "scopes": [
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

Adjust Issuer and JWKS URI within apirule.yaml

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

App is not calling the callback url when authenticating

subscribe failed in create callback. Parameters: rootSubscription: RootSubscription : { xsuaaAppId: saas-provisioning-demo!t13477, consumerTenant: a2388988-fb48-4ecb-800a-3ae08fe0fb21, subdomain: 1-16-17-upgrade2 }. Error description: Timestamp: Wed Dec 16 22:03:02 UTC 2020, correlationId: 16faed94-108b-466d-9eff-2fd208356d26, Details: Error manage callbacks: Application saas-provisioning-demo!t13477 for subscription did not return subscriptionUrl. CorrelationId: 16faed94-108b-466d-9eff-2fd208356d26
