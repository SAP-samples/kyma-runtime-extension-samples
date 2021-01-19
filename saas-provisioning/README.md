### Create a new `saas` Namespace:

```shell script
kubectl create namespace saas
```

### Deploy the Sample

The sample app is what will be called when a user subscribes to your application. This sample app will provision resources based on the configmap provided.

When a consumer subscribes to the app the Saas Provisioning Service will submit a JWT when calling the On-Subscription Endpoint which will be verified by the Kyma Application Gateway based on the values defined in the Issuer and JWKS URI. These values will cause the subscription to fail if the endpoints are not correct for the envirnoment. To verify the JWT adjust the Issuer and JWKS URI of the apirule.yaml, for example

- Issuer: http://sap-provisioning.localhost:8080/uaa/oauth/token
- JWKS URI: https://sap-provisioning.authentication.sap.hana.ondemand.com/token_keys

Deploy the the resources found in the directory **K8s** into the `saas` namespace

```shell script
kubectl apply -f ./k8s/apirule.yaml -n saas
```

For the config-map adjust at a minimun the value of **domain** to match the domain of your Kyma runtime

```shell script
kubectl apply -f ./k8s/config-map.yaml -n saas
```

```shell script
kubectl apply -f ./k8s/deployment.yaml -n saas
```

```shell script
kubectl apply -f ./k8s/service-account.yaml -n saas
```

### Create XSUAA Service Instance

1. Within the Kyma console open the namespace **saas**.
2. Choose **Service Management** -> **Catalog**.
3. Choose the service **Authorization & Trust Management**.
4. Choose **Add**.
5. Choose the Plan **application**.
6. Choose **Add parameters** and provide the object after adjusting it to your needs.
7. After the instance is created, choose the **Credentials** tab and choose the option **Create Credentials**.

Using tenant-mode external will provide the On-Subscription Endpoint of Saas application the tokenurl, clientsecret, and clientid of the subaccount of the subscribe. This information is then used to registered a dedicated App-auth-proxy for the consumer. More information can be found at:

<sub>https://help.sap.com/viewer/4505d0bdaf4948449b7f7379d24d0f0d/2.0.03/en-US/6d3ed64092f748cbac691abc5fe52985.html#loio6d3ed64092f748cbac691abc5fe52985__section_myf_zzy_2bb</sub>

<sub>https://help.sap.com/viewer/65de2977205c403bbc107264b8eccf4b/Cloud/en-US/ff540477f5404e3da2a8ce23dcee602a.html</sub>

```json
{
  "authorities": ["$ACCEPT_GRANTED_AUTHORITIES"],
  "foreign-scope-references": ["$ACCEPT_GRANTED_SCOPES"],
  "oauth2-configuration": {
    "redirect-uris": [
      "https://*.c-6d073c0.kyma-stage.shoot.live.k8s-hana.ondemand.com/oauth/callback"
    ]
  },
  "role-templates": [
    {
      "description": "User Role Template",
      "name": "SAASUserTemplate",
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
      "description": "User of the application",
      "name": "$XSAPPNAME.User"
    }
  ],
  "tenant-mode": "external",
  "xsappname": "saas-provisioning-demo-app"
}
```

### Create SAAS Provioning Instance

1. Choose **Service Management** -> **Catalog**.
2. Choose the service **SaaS Provisioning**
3. Choose **Add**
4. Choose the Plan **application**
5. Choose **Add parameters** and provide the object after adjusting it to your needs.
6. After the instance is created, choose the **Credentials** tab and choose the option **Create Credentials**.

```json
{
  "xsappname": "saas-provisioning-demo-app",
  "displayName": "Kyma SAAS Provisioning Demo",
  "description": "A Kyma SAAS Provisioning Demo Sample App",
  "category": "Kyma Demo",
  "appUrls": {
    "onSubscription": "https://saas-provisioning-demo.<cluster domain>/callback/v1.0/tenants/{tenantId}"
  }
}
```

### Subscribe to the App

1. Create another subaccount and open it
2. Choose the Subscriptions menu option
3. Find and open the **Kyma SAAS Provisioning Demo** tile
4. Choose Subscribe

### Configure Access to the App

1. When the subscription completes...
2. Choose Security -> Role Collections from the main menu.
3. Create a new Role Collection
4. Edit the Role Collection and provide `SAASUserTemplate` for the Role Template
5. Add your using to the Role Collection

### Access to the App

1. Choose the menu option Subscriptions
2. Find and open the **Kyma SAAS Provisioning Demo** tile
3. Choose the **Go to Application** link.

=================================

```json
{
  "authorities": ["$ACCEPT_GRANTED_AUTHORITIES"],
  "foreign-scope-references": ["$ACCEPT_GRANTED_SCOPES"],
  "oauth2-configuration": {
    "redirect-uris": [
      "https://*.c-6d073c0.kyma-stage.shoot.live.k8s-hana.ondemand.com/oauth/callback"
    ]
  },
  "role-collections": [
    {
      "description": "SAAS Demo App Role Collecction",
      "name": "myappsaas-jc_User",
      "role-template-references": ["$XSAPPNAME.User"]
    }
  ],
  "role-templates": [
    {
      "description": "SAAS Demo Role Template",
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
      "description": "SAAS Demo App User",
      "name": "$XSAPPNAME.User"
    }
  ],
  "tenant-mode": "external",
  "xsappname": "saas-provisioning-demo-app"
}
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

```json
{
  "authorities": ["$ACCEPT_GRANTED_AUTHORITIES"],
  "foreign-scope-references": ["$ACCEPT_GRANTED_SCOPES"],
  "oauth2-configuration": {
    "redirect-uris": [
      "https://*.c-6d073c0.kyma-stage.shoot.live.k8s-hana.ondemand.com/oauth/callback"
    ]
  },
  "role-collections": [
    {
      "description": "My SaaS App Administrator",
      "name": "myappsaas-jc_Administrator",
      "role-template-references": [
        "$XSAPPNAME.Administrator",
        "$XSAPPNAME.User"
      ]
    },
    {
      "description": "My SaaS App User",
      "name": "myappsaas-jc_User",
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
  "tenant-mode": "external",
  "xsappname": "saas-provisioning-demo"
}
```

About Destinations
https://blogs.sap.com/2020/08/03/multi-tenancy-of-destination-service-with-cloud-foundry-applications/
