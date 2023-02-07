Power of serverless with SAP BTP, Kyma runtime. Dockerless and serverless
==========

### Pre-requisites

Please make sure you comply with the global [project](https://github.com/SAP-samples/kyma-runtime-extension-samples) pre-requisistes [here](https://github.com/SAP-samples/kyma-runtime-extension-samples/tree/main/prerequisites)


Additionally, this sample may require that you:  
1. Have your Free Tier SAP HANA Cloud database instance ready and up and running
2. Have your Free Tier SAP Kyma, BTP runtime provisioned
3. Prepare your own Github account SSH key.  
  * you may refer to this [blog post of mine](https://blogs.sap.com/2021/12/08/kyma-functions-with-gitrepository-source-with-ssh-authentication./) that describes how to enable SSH for your github account: 
  * the source code needs to be stored in an *internet-facing* github repository thus other Github authentication methods are *strongly* discouraged
  * furthermore, SSH may be the only way to access the source code in the github repositories with 2FA activated even the public ones.

### Structure of the project  
  * `fun-srv` folder contains the serverless source code
  * `helm` folder contains the helm charts

```
📦fun
 ┣ 📂fun-srv
 ┃ ┣ 📜handler.js
 ┃ ┗ 📜package.json
 ┣ 📂helm
 ┃ ┣ 📂fun-app
 ┃ ┃ ┣ 📂templates
 ┃ ┃ ┃ ┣ 📜NOTES.txt
 ┃ ┃ ┃ ┣ 📜_helpers.tpl
 ┃ ┃ ┃ ┣ 📜apirule.yaml
 ┃ ┃ ┃ ┣ 📜configmap.yaml
 ┃ ┃ ┃ ┣ 📜deployment.yaml
 ┃ ┃ ┃ ┣ 📜resources.yaml
 ┃ ┃ ┃ ┣ 📜service.yaml
 ┃ ┃ ┃ ┗ 📜xs-app.yaml
 ┃ ┃ ┣ 📜.helmignore
 ┃ ┃ ┣ 📜Chart.yaml
 ┃ ┃ ┗ 📜values.yaml
 ┃ ┣ 📂fun-db
 ┃ ┃ ┣ 📂templates
 ┃ ┃ ┃ ┣ 📜NOTES.txt
 ┃ ┃ ┃ ┣ 📜_helpers.tpl
 ┃ ┃ ┃ ┣ 📜binding-hdi.yaml
 ┃ ┃ ┃ ┣ 📜job.yaml
 ┃ ┃ ┃ ┣ 📜service-hdi.yaml
 ┃ ┃ ┃ ┗ 📜src.yaml
 ┃ ┃ ┣ 📜.helmignore
 ┃ ┃ ┣ 📜Chart.yaml
 ┃ ┃ ┗ 📜values.yaml
 ┃ ┗ 📂fun-srv
 ┃ ┃ ┣ 📂templates
 ┃ ┃ ┃ ┣ 📜NOTES.txt
 ┃ ┃ ┃ ┣ 📜_helpers.tpl
 ┃ ┃ ┃ ┣ 📜apirule.yaml
 ┃ ┃ ┃ ┣ 📜binding-dest-x509.yaml
 ┃ ┃ ┃ ┣ 📜binding-dest.yaml
 ┃ ┃ ┃ ┣ 📜binding-uaa.yaml
 ┃ ┃ ┃ ┣ 📜function.yaml
 ┃ ┃ ┃ ┣ 📜service-dest.yaml
 ┃ ┃ ┃ ┗ 📜service-uaa.yaml
 ┃ ┃ ┣ 📜.helmignore
 ┃ ┃ ┣ 📜Chart.yaml
 ┃ ┃ ┗ 📜values.yaml
 ┣ 📜Makefile
 ┗ 📜readme.md

```

The fun project features a hdi deployer job that run once and a serverless backend service that runs forever...  
The communication channel between the approuter frontend and the backend is via an approuter destination.

### **Usage**:

1. fork this public repository to yours or clone this repository and then push it yours
2. clone your github repository

```
gh repo clone <repo>
cd kyma-runtime-extension-samples/kyma-serverless/fun/
```
3. running **make** in the fun directory of the project will display the list of the available targets, as follows:


```
$ make

Usage:
   make <target>
  help             Display this help.
  helm-template-srv  Template backend (srv+db) helm chart
  helm-template-app  Template html5 helm chart
  helm-template    Template all helm charts
  helm-deploy-srv  deploy srv helm chart
  helm-deploy-app  deploy fronted html5 helm chart
  helm-deploy      deploy helm chart
  helm-undeploy    undeploy helm chart
  get-cluster-id   get cluster id for hanacloud instance mapping
  create-git-secret  create git secret
  delete-git-secret  delete git secret

```

The below make parameters can be defined as env variables or passed as parameters in the make command line:  

```
CHART_SRV=fun-srv
CHART_APP=fun-app
CHART_HDB=fun-db

NAMESPACE=default
KUBECONFIG=~/.kube/kubeconfig--btp-easy--btp.yaml
CLUSTER_DOMAIN= $(shell kubectl get cm -n kube-system shoot-info --kubeconfig $(KUBECONFIG) -ojsonpath='{.data.domain}' )
ISTIO_GATEWAY=kyma-gateway.kyma-system.svc.cluster.local

RSA_KEY= $(shell ls ~/.ssh/id_rsa)
GIT_KEY=git-ssh-secret
GIT_URL=git@github.com:ptesny/k8s-samples.git
GIT_DIR=/k8s-samples/faas/fun/fun-srv/
GIT_BRANCH=master

PORT=8080 or PORT=${RANDOM} 
```

a. The **Makefile** requires only one mandatory input parameter, namely your **kubeconfig**.  
b. ***KUBECONFIG*** can be defined as an environmental variable, in the make command line or defined in the  Makefile.  
c. Additionally, you can override the target ***default*** namespace with ***NAMESPACE***.  
  * Your namespace must exist, otherwise the helm chart will abort. 
  * There is also no need to enable the istio sidecar for the namespace.  
d. The default cluster domain is retrieved from the kyma cluster itself as follows:

```
CLUSTER_DOMAIN= $(shell kubectl get cm -n kube-system shoot-info --kubeconfig $(KUBECONFIG) -ojsonpath='{.data.domain}' )

```
e. you can override it with the value of your custom domain alongside the value of your istio gateway, for instance:  
`ISTIO_GATEWAY=quovadis-azure-gateway.azure-dns.svc.cluster.local `  
`CLUSTER_DOMAIN=quovadis-anywhere.com`  

### **Targets:**

##### retrieve the cluster id

run the following make target: `make get-cluster-id`  
then, goto SAP HANA Central and add the cluster mapping for your database instance

##### create-git-secret

`make create-git-secret`  
  * it is assumed the `id_rsa` is located as follows: `ls ~/.ssh/id_rsa`  
  * if it weren't the case, you may override its name and location on the make command line: `make RSA_KEY=<your RSA key file> create-git-secret`


##### helm-template

`make helm-template > dry-run.yaml`
  * if you are scratching your head looking for an error with the deployment files you may use a template (dry-run) feature of helm.
  * this way you can look up all the substituted values before trying this out against your test landscape

##### helm-deploy

```
$ make helm-deploy
helm upgrade -n default -i fun-db helm/fun-db \
     --set namespace=default \
     --install --kubeconfig ~/.kube/kubeconfig--btp-easy--btp.yaml
Release "fun-db" does not exist. Installing it now.
NAME: fun-db
LAST DEPLOYED: ***************
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
Thank you for installing fun-db. Your release is named fun-db and was deployed to the namespace default.
helm upgrade -n default -i fun-srv helm/fun-srv \
     --set clusterDomain=btp.btp-easy.shoot.canary.k8s-hana.ondemand.com \
     --set services.gitRepository.url=git@github.com:ptesny/k8s-samples.git \
     --set services.gitRepository.baseDir=/k8s/faas/fun/fun-srv/ \
     --set services.gitRepository.reference=master \
     --set services.gitRepository.auth.secretName=git-ssh-secret \
     --set namespace=default \
     --install --kubeconfig ~/.kube/kubeconfig--btp-easy--btp.yaml
Release "fun-srv" does not exist. Installing it now.
NAME: fun-srv
LAST DEPLOYED: ***************
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
Thank you for installing fun-srv. Your release is named fun-srv and was deployed to the namespace default.
helm upgrade -n default -i fun-app helm/fun-app \
    --set services.app.image.port=8080  \
     --set services.app.service.port=8080  \
     --set clusterDomain=btp.btp-easy.shoot.canary.k8s-hana.ondemand.com \
     --set namespace=default \
     --install --kubeconfig ~/.kube/kubeconfig--btp-easy--btp.yaml
Release "fun-app" does not exist. Installing it now.
NAME: fun-app
LAST DEPLOYED: ***************
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
Thank you for installing fun-app. Your release is named fun-app and was deployed to the namespace default.

```

##### helm-undeploy

```
$ make helm-undeploy
helm uninstall -n default fun-app --kubeconfig ~/.kube/kubeconfig--btp-easy--btp.yaml
release "fun-app" uninstalled
helm uninstall -n default fun-srv --kubeconfig ~/.kube/kubeconfig--btp-easy--btp.yaml
release "fun-srv" uninstalled
helm uninstall -n default fun-db --kubeconfig ~/.kube/kubeconfig--btp-easy--btp.yaml
release "fun-db" uninstalled
```

### Tools
kubectl, helm, git, make

### Troubleshooting
Helm runs all the charts asynchronously.  
If your hdi service has not been provisioned the most likely reason is you have not mapped your hana cloud database instance to the cluster yet or/and your *Free Tier* SAP HANA Cloud database instance may have been stopped.  

<img width="1510" alt="image" src="https://user-images.githubusercontent.com/52403733/216764400-a73eff7f-e6a1-4e7e-8fea-0a6d45769ed7.png">


#### SAP HANA Cloud database instance mapping to your kyma cluster
You can retrieve the cluster id using `get-cluster-id` make target. You will need it to create the mapping.  
You may refer to [Consuming SAP HANA Cloud from the Kyma environment | SAP Blogs](https://blogs.sap.com/2022/12/15/consuming-sap-hana-cloud-from-the-kyma-environment/) for more details.  

<img width="1245" alt="image" src="https://user-images.githubusercontent.com/52403733/216962213-f61a5be9-4f65-4811-ab71-2e9418ce4f18.png">

Following this, you can re-run `make helm-deploy` or `make PORT=${RANDOM} helm-deploy`

<img width="1507" alt="image" src="https://user-images.githubusercontent.com/52403733/216768465-ecf4b1f1-a42f-47d9-971b-780cb919cd52.png">

### x509 credentials rotation

Every ten hours, with a precision of a swisse horloge, the btp service operator controller will trigger a full reconciliation, namely the clean-up of temporary bindings.  
All the temp bindings that both meet the TTL (=age) and rotation frequency  criteria will be "purged"...
For instance, we have created a binding 3 hours after the last reconciliation loop and configured the rotation values to be relatively low (most likely not a productive scenario).  
As a result, after 7 hours the full reconciliation is triggered (10-3=7), during this reconciliation the old binding will be deleted (since it is more than 10 minutes old) and a new one will be created (since more than 1 hour has passed since the last rotation)...  

<img width="1509" alt="image" src="https://user-images.githubusercontent.com/52403733/216779877-fac32236-ba8f-4ec3-b29a-653a2b04b64c.png">

### Custom domains

Custom domains are supported out-of-the-box.  
In order to create an API rule with a custom domain you need to override the default cluster istio gateway and domain as follows:  

`ISTIO_GATEWAY=quovadis-azure-gateway.azure-dns.svc.cluster.local `  
`CLUSTER_DOMAIN=quovadis-anywhere.com`  

for instance:  
```
$ make NAMESPACE=demo-us21 ISTIO_GATEWAY=quovadis-azure-gateway.azure-dns.svc.cluster.local CLUSTER_DOMAIN=quovadis-anywhere.com KUBECONFIG=~/.kube/kubeconfig--btp-easy--btp.yaml helm-deploy


helm upgrade -n demo-us21 -i fun-db helm/fun-db \
     --set namespace=demo-us21 \
     --install --kubeconfig ~/.kube/kubeconfig--btp-easy--btp.yaml
Release "fun-db" does not exist. Installing it now.
NAME: fun-db
LAST DEPLOYED: ***************
NAMESPACE: demo-us21
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
Thank you for installing fun-db. Your release is named fun-db and was deployed to the namespace demo-us21.
helm upgrade -n demo-us21 -i fun-srv helm/fun-srv \
     --set clusterDomain=quovadis-anywhere.com \
     --set gateway=quovadis-azure-gateway.azure-dns.svc.cluster.local \
     --set services.gitRepository.url=git@github.com:ptesny/k8s-samples.git \
     --set services.gitRepository.baseDir=/k8s/faas/fun/fun-srv/ \
     --set services.gitRepository.reference=master \
     --set services.gitRepository.auth.secretName=git-ssh-secret \
     --set namespace=demo-us21 \
     --install --kubeconfig ~/.kube/kubeconfig--btp-easy--btp.yaml
Release "fun-srv" does not exist. Installing it now.
NAME: fun-srv
LAST DEPLOYED: ***************
NAMESPACE: demo-us21
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
Thank you for installing fun-srv. Your release is named fun-srv and was deployed to the namespace demo-us21.
helm upgrade -n demo-us21 -i fun-app helm/fun-app \
     --set services.app.image.port=8080  \
     --set services.app.service.port=8080  \
     --set clusterDomain=quovadis-anywhere.com \
     --set gateway=quovadis-azure-gateway.azure-dns.svc.cluster.local \
     --set namespace=demo-us21 \
     --install --kubeconfig ~/.kube/kubeconfig--btp-easy--btp.yaml
Release "fun-app" does not exist. Installing it now.
NAME: fun-app
LAST DEPLOYED: ***************
NAMESPACE: demo-us21
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
Thank you for installing fun-app. Your release is named fun-app and was deployed to the namespace demo-us21.
```
