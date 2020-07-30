# Overview

This sample demonstrates how to build and deploy a ASP.NET based microservice as an extension and expose the API in _SAP Cloud Platform Extension Factory, Kyma Runtime_.

![extension](assets/extension.png)

This sample demonstrates:

* Creating a development namespace in Kyma Runtime.
* Creating and deploying a ASP.Net application in Kyma runtime.
* Exposing the ASP.Net application via [APIRules](https://kyma-project.io/docs/components/api-gateway#custom-resource-api-rule).
* Calling the APIs

## Prerequisites

* SAP Cloud Platform Extension Factory, Kyma Runtime instance
* [Docker](https://www.docker.com/)
* [make](https://www.gnu.org/software/make/)
* [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
* `kubectl` is configured to `KUBECONFIG` downloaded from Kyma Runtime.

## Deploying the application

* Create a new Namespace `dev`

```shell script
kubectl create namespace dev
```

* Build the and push image to the docker repository.
  
```shell script
DOCKER_ACCOUNT={your-docker-account} make push-image
```

* Update image name in the [Kubernetes Deployment](k8s/deployment.yaml). These are standard Kubernetes [Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/) and [Service](https://kubernetes.io/docs/concepts/services-networking/service/) definitions.

* Deploy the application.

```shell script
kubectl -n dev apply -f ./k8s/deployment.yaml
```

* Verify the Pods are up and running

```shell script
kubectl -n dev get po -l app=sample-extension-dotnet
```

You should see the pod for deployment `sample-extension-dotnet` running.

```shell script
kubectl -n dev get po -l app=sample-extension-dotnet
NAME                                       READY   STATUS    RESTARTS   AGE
sample-extension-dotnet-774fbc5c7b-x44pd   2/2     Running   0          15s
```

### Exposing the API

Create an APIRule. In the APIRule, you specify the Kubernetes Service that is exposed.

In the below snippet, service `sample-extension-dotnet` is expose. It is specified in `spec.service.name` field.
The subdomain `sample-extension-dotnet` is specified in `spec.service.host` field.

The APIs can be accessed on the URL <https://sample-extension-dotnet.{cluster domain}>.

```yaml
apiVersion: gateway.kyma-project.io/v1alpha1
kind: APIRule
metadata:
  name: sample-extension-dotnet
spec:
  gateway: kyma-gateway.kyma-system.svc.cluster.local
  rules:
    - accessStrategies:
        - config: {}
          handler: noop
      methods:
        - GET
        - POST
        - PUT
        - DELETE
      path: /.*
  service:
    host: sample-extension-dotnet
    name: sample-extension-dotnet
    port: 80
```  

```shell script
kubectl -n dev apply -f ./k8s/api-rule.yaml
```

### Trying it out

Make an HTTP call using curl

```shell script
curl https://sample-extension-dotnet.{cluster domain}
Hello from dotnet app running on Kyma Runtime
```
