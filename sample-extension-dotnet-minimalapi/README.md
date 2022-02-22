# Overview

This sample demonstrates how to build and deploy an ASP.NET Core-based microservice as an extension leveraging the minimal web API functionality and exposing the API in SAP BTP, Kyma runtime.

You can find the application code in the [ToDoApi](./ToDoApi) directory.

This sample demonstrates how to:

* Create a development Namespace in the Kyma runtime.
* Create and deploy an ASP.NET Core-based application in the Kyma runtime.
* Expose the ASP.NET Core application using [APIRules](https://kyma-project.io/docs/kyma/latest/05-technical-reference/00-custom-resources/apix-01-apirule/#documentation-content).
* Call the API.

## ToDo App

The application used in this sample is described [here](https://docs.microsoft.com/aspnet/core/tutorials/min-web-api?view=aspnetcore-6.0&tabs=visual-studio)

## Prerequisites

This tutorial requires the following prerequisites:

* [Docker and Kubernetes](../prerequisites#docker-and-kubernetes)
* [.NET](../prerequisites#net)
* [REST Client Extension](../prerequisites#rest-clients)
* [Build Tooling](../prerequisites#build-tooling)

## Steps

### Prepare for deployment

* Create a new `dotnetdev` Namespace:

```shell script
kubectl create namespace dotnetdev
```

* Adjust the placeholder `DOCKER_ACCOUNT` in the [Makefile](sample-extension-dotnet-minimalapi\Makefile) and then build and push the image to the Docker repository:

```shell script
DOCKER_ACCOUNT={your-docker-account} make build-and-push-image
```

* Update the image name in the [Kubernetes Deployment](k8s/deployment.yaml). Refer to the standard Kubernetes [Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/) and [Service](https://kubernetes.io/docs/concepts/services-networking/service/) definitions.

### Kubernetes Deployment

This section details out deploying the extension using standard Kubernetes resources.

To deploy as Helm chart, please refer to [Helm Chart Deployment](#helm-chart-deployment)

* Deploy the application:

```shell script
kubectl -n dotnetdev apply -f ./k8s/deployment.yaml
```

* Verify that the Pods are up and running:

```shell script
kubectl -n dotnetdev get po -l app=sample-extension-dotnet-minimalapi
```

The expected result shows that the Pod for the `sample-extension-dotnet` Deployment is running:

```shell script
kubectl -n dotnetdev get po -l app=sample-extension-dotnet-minimalapi
NAME                                                  READY   STATUS    RESTARTS   AGE
sample-extension-dotnet-minimalapi-774fbc5c7b-x44pd   2/2     Running   0          15s
```

#### Expose the API

1. Create an APIRule. In the APIRule, specify the Kubernetes Service that is exposed:

```yaml
apiVersion: gateway.kyma-project.io/v1alpha1
kind: APIRule
metadata:
  name: sample-extension-dotnet-minimalapi
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
    host: sample-extension-dotnet-minimalapi
    name: sample-extension-dotnet-minimalapi
    port: 5046
```  

This sample snippet exposes the `sample-extension-dotnet-minimalapi` Service. The Service is specified in the **spec.service.name** field.
The `sample-extension-dotnet-minimalapi` subdomain is specified in the **spec.service.host** field.

* Apply the APIRule:

```shell script
kubectl -n dotnetdev apply -f ./k8s/api-rule.yaml
```

### Helm Chart Deployment

A [Helm Chart definition](../helm-charts/sample-extension-dotnet/README.md) is also available for developers to try out.

#### Must Haves

* [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
* [Helm3](https://helm.sh/docs/intro/install/)

#### Helm install

To install the helm chart in `dotnetdev` namespace, run the following command. Change the placeholder `<YOUR DOCKER ACCOUNT>` to use your account.

```shell script
helm install kymaapp ../helm-charts/sample-extension-dotnet-minimalapi --set image.repository=<YOUR DOCKER ACCOUNT>/dotnet6minimalapi:0.0.1 -n dotnetdev
```

To verify, the installed chart, run

```shell
helm -n dotnetdev ls`
```

This should give you an output like

```shell script
NAME            NAMESPACE       REVISION        UPDATED                                 STATUS          CHART                           APP VERSION
dev-gateway     dev             1               2020-09-14 17:34:58.607853163 +0000 UTC deployed        gateway-0.0.1
kymaapp         dev             1               2020-09-15 15:18:34.502591 +0200 CEST   deployed        sample-extension-dotnet-0.1.0   1.16.0
```

### Try it out

Access the APIs through this URL:

```shell script
https://sample-extension-dotnet.{cluster domain}
```

Make an HTTP call using curl:

```shell script
curl https://sample-extension-dotnet.{cluster domain}
Hello from dotnet app running on Kyma Runtime
```
