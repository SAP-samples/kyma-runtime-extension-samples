
# Jupyter Environment running in Kyma

We run beautiful code in notebooks, and it looks easy, but often it doesn't make it to production.
The main reason is usually a lack of tangible business benefit, for which technology isn't the answer, even when it comes with interactive colored charts.
That being said, sometimes we face some very silly issues because our respective envrionments have a wide range of configurations. Running notebooks in the same environment is one step to harmonize developments. It is also useful for long running jobs that could fail if the network link is interrupted.

## What this is exactly

Jupyter [Hub](https://z2jh.jupyter.org/en/stable/) is a multi user Jupyter environment. And because this is Kubernetes, each user has a container and 10 GB of storage.

# Setup

## First a connection to Kyma

Install command line tools
* [kubectl](https://kubernetes.io/docs/tasks/tools/) 
* [kubectl plugin](https://github.com/int128/kubelogin)
* [helm](https://helm.sh/docs/intro/install/)

Access the Kyma instance as specified [in the doc](https://help.sap.com/docs/BTP/65de2977205c403bbc107264b8eccf4b/3e25944e491049b2aeec68c562a5ee48.html).

## Install the helm chart

```
helm repo add jupyterhub https://jupyterhub.github.io/helm-chart/
helm repo update
```

You should use a separate namespace for jupyter hub

```
helm install jhubremi jupyterhub/jupyterhub --create-namespace --namespace <your_namespace> --values config.yaml
```

The content of `config.yaml` is minimal. **Change the password**:
```yaml
hub:
  extraConfig:
    myConfig.py: |
      c.DummyAuthenticator.password = "zuper zecret Pazzword 321"
 
proxy:
  service:
    type: ClusterIP
```

And that is enough to get jupyter hub running 😎 !
<FONT SIZE=1>
<pre>
Release "jhubremi" has been upgraded. Happy Helming!
NAME: jhubremi
LAST DEPLOYED: Tue Oct 25 15:14:08 2022
NAMESPACE: mlteam
STATUS: deployed
REVISION: 4
TEST SUITE: None
NOTES:
.      __                          __                  __  __          __
      / / __  __  ____    __  __  / /_  ___    _____  / / / / __  __  / /_
 __  / / / / / / / __ \  / / / / / __/ / _ \  / ___/ / /_/ / / / / / / __ \
/ /_/ / / /_/ / / /_/ / / /_/ / / /_  /  __/ / /    / __  / / /_/ / / /_/ /
\____/  \__,_/ / .___/  \__, /  \__/  \___/ /_/    /_/ /_/  \__,_/ /_.___/
              /_/      /____/

       You have successfully installed the official JupyterHub Helm chart!

[...]
- Verify web based access:

    You have not configured a k8s Ingress resource so you need to access the k8s
    Service proxy-public directly.

    If your computer is outside the k8s cluster, you can port-forward traffic to
    the k8s Service proxy-public with kubectl to access it from your
    computer.

      kubectl --namespace=mlteam port-forward service/proxy-public 8080:http

    Try insecure HTTP access: http://localhost:8080
</pre>
</FONT>

## Expose to internet

In the helm chart, we configured the service to be only internal. To expose it to the internet, we create an API rule:

```
kubectl create -n <your namespace> -f apirule.yaml
```
And `apirule.yaml` is:
```yaml
apiVersion: gateway.kyma-project.io/v1beta1
kind: APIRule
metadata:
  name: jupyter
  labels:
    app.kubernetes.io/name: jupyter
spec:
  gateway: kyma-gateway.kyma-system.svc.cluster.local
  host: jupyter
  rules:
    - accessStrategies:
        - handler: noop
      methods:
        - GET
        - POST
        - DELETE
        - PUT
        - PATCH
        - HEAD
      path: /.*
  service:
    name: proxy-public
    port: 80
```

You can now open the web browser at *https://jupyter.&lt;your Kyma domain&gt;*

If you want a quick reminder of how to get the domain name:

`kubectl config view -o=jsonpath='{.clusters[0].cluster.server}' | sed -e "s#https://api\.##"`

However, be mindful of **serious limitations!!**
- **Users have the same single password**
- **There is no control of user names**

To mitigate the second point, we could set a fixed list of user names in the config
```yaml
hub:
  config:
    Authenticator:
      allowed_users:
        - user1
        - user2
        - ...
 ```

To solve both problems, we need to implement an authenticator. While jupyterhub [supports many](https://z2jh.jupyter.org/en/latest/administrator/authentication.html), we'll use the one provided by SAP and restrict network traffic inside SAP BTP.

# Setup Jupyter to use SAP Identity As a Service (IAS)

## Configure IAS

For that, you'll need admin access to an IAS tenant.
Then create an a new application.

<img src="./ias%201.png" height= "150"/>

Put the apirule URL and choose "Non-SAP solution"

<img src="./ias%202.png" width= "250"/>

The set Protocol to OpenID

<img src="./ias%203.png" width= "250"/>

And create a new OpenID Connect Configuration

<img src="./ias%204.png" width= "250"/>

Then scroll down and click on **Application APIs** / Client Authentication

<img src="./ias%205.png" width= "250"/>

Then **Secrets** / **+ Add**. And **write down the client id and  client secret.**

<img src="./ias%206.png" width= "250"/>

Lastly, you can add a jupyter logo because it makes the login page nicer.

<img src="./ias%207.png" width= "250"/>

And since we're at it, activate biometric authentication !

<img src="./ias%208.png" width= "250"/>

We have finished configuring the IAS tenant for JupyterHub. If Single Sign On (SSO) doesn't automatically log the user in, one of those two pages will be presented. 

<img src="./ias%209.png" width= "250"/>
<img src="./ias%2010.png" width= "250"/>


## Reconfigure Jupyter

With the command `helm upgrade` we switch the authentication mechanism without uninstalling the helm solution instance.

```
helm upgrade jhubremi jupyterhub/jupyterhub --namespace mlteam --values config.ias.yaml
```

with `config.ias.yaml`:

```yaml
hub:
  extraConfig:
    myConfig.py: |
      from oauthenticator.generic import GenericOAuthenticator
      #c.Application.log_level = 'DEBUG'
      c.JupyterHub.authenticator_class = GenericOAuthenticator
      c.GenericOAuthenticator.client_id = "bdc5f710-f82f-4152-9beb-**********"
      c.GenericOAuthenticator.client_secret = "3GFVcw=6Ak-**:******************"
      c.GenericOAuthenticator.oauth_callback_url = "https://jupyter.*******.kyma.ondemand.com/hub/oauth_callback"
      c.GenericOAuthenticator.login_service = "SAP BTP OpenID Authentication"
      #c.GenericOAuthenticator.username_key = lambda r: r.get('given_name').lower() + r.get('family_name').lower()
      c.GenericOAuthenticator.username_key = lambda r: r.get('mail').split('@')[0]
      c.GenericOAuthenticator.authorize_url = "https://<your ias tenant>.accounts400.ondemand.com/oauth2/authorize"
      c.GenericOAuthenticator.token_url = "https://<your ias tenant>.accounts400.ondemand.com/oauth2/token"
      c.GenericOAuthenticator.userdata_url = "https://<your ias tenant>.accounts400.ondemand.com/oauth2/userinfo"
      c.GenericOAuthenticator.scope = ['openid', 'profile']
proxy:
  service:
    type: ClusterIP
```

You can now log back in 

<img src="./ias%2011.png" width= "250"/>