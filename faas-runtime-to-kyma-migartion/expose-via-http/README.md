# Exposing Function via HTTP

## Overview

This sample demonstrates a sample HTTP-triggered Function. The Function, when triggered via HTTP, responds with a qr code that represents current timestamp. This sample is based on the [qrcode producer](https://github.com/SAP-samples/cloud-function-nodejs-samples/tree/master/examples/qrcode-producer) and it's purpose is to show how to migrate a similar use case from deprecated SAP BTP Faas Runtime into the Kyma runtime.

## Additional Prerequisites

Besides the prerequisistes described in the parent folder, for the second part of this sample (JWT restricted access) it is required to have access to a JWT token issuer.
## Steps

### Inspect the Function files

Go to the `expose-via-http/qrcode-producer` folder and inspect the code (`handler.js`), dependencies (`package.json`) and the Function configuration file which manifests the features of the Function (`config.yaml`) - in this case the the http exposure via API Rule.

### Deploy the Function using kyma CLI

Run the following command to deploy the Function

```shell
kyma apply function
```

Verify if the Function was successfully built.

```shell
kubectl get functions   
NAME              CONFIGURED   BUILT   RUNNING   RUNTIME    VERSION   AGE
qrcode-producer   True         True    True      nodejs14   1         15s
```

### Test

Open the Function's exposed URL in the browser.
You can learn the URL be inspecting virtual services in the Function namespace
```shell
kubectl get vs
```

### Configure JWT token access

If you have a jwt token issuer (i.e  SAP XSUAA instance or a custom tenant of SAP Cloud Identity Services ) you can configure it in this scenario so that access to the Function will be restricted to requests with valid token.

Inspect the OIDC configuration of you jwt token issuer by opening it's manifest endpoint in the web browser:
`https://{yourIssuerUrl}/.well-known/openid-configuration`


Copy `issuer` and `jwks_uri` values and use them in the `config.yaml` to configure jwt access strategy.

```yaml
...
apiRules:
    - service:
        host: qrcode-producer
      rules:
        - methods:
            - GET
          accessStrategies:
            - config:
                jwksUrls:
                    - {jwks_uri of you jwt issuer}
                trustedIssuers:
                    - {url of your jwt token issuer}
              handler: jwt
```

Apply the changes via Kyma CLI command

```shell
kyma apply function
```

Now, when you open the same URL in the browser you will see a 401 ( Unauthorised ) response.
Only requests containing a valid token from your issuer will be passed through the Kyma API Gateway and will reach your Function 

