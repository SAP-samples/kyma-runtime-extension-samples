# Overview

This sample demonstrates how to build and deploy a Micronaut-based microservice as an extension and expose the API in SAP Cloud Platform, Kyma runtime.

![extension](./assets/extension.png)

This sample demonstrates how to:

* Create a development Namespace in the Kyma runtime.
* Create and deploy a Micronaut application in the Kyma runtime.
* Expose the application using [APIRules](https://kyma-project.io/docs/components/api-gateway#custom-resource-api-rule).
* Explore the APIs.

## Prerequisites

* SAP Cloud Platform, Kyma runtime instance
* [Docker](https://www.docker.com/)
* [make](https://www.gnu.org/software/make/)
* [Gradle](https://gradle.org/)
* [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) configured to use the `KUBECONFIG` file downloaded from the Kyma runtime
* [Java 11+](https://openjdk.java.net/projects/jdk/11/)

## Application

The Micronaut application implements a simple `Orders` API with CRUD operations.

## Steps

### Prepare for deployment

* Create a new `dev` Namespace:

```shell script
kubectl create namespace dev
```

* Build and push the image to the Docker repository:

```shell script
DOCKER_ACCOUNT={your-docker-account} make push-image
```

### Kubernetes Deployment

This section details out deploying the extension using standard Kubernetes resources.

To deploy as Helm chart, please refer to [Helm Chart Deployment](#helm-chart-deployment)

* Update the image name in the [Kubernetes Deployment](k8s/deployment.yaml). Refer to the standard Kubernetes [Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/) and [Service](https://kubernetes.io/docs/concepts/services-networking/service/) definitions.

* Deploy the application:

```shell script
kubectl -n dev apply -f ./k8s/deployment.yaml
```

* Verify that the Pods are up and running:

```shell script
kubectl -n dev get po
```

The expected result shows that the Pod for the `sample-extension-micronaut` Deployment is running:

```shell script
NAME                                     READY   STATUS    RESTARTS   AGE
sample-extension-micronaut-6c7bd95746-vl2jc   2/2     Running   0          93s
```

#### Expose the API

* Create an APIRule. In the APIRule, specify the Kubernetes Service that is exposed:

```yaml
apiVersion: gateway.kyma-project.io/v1alpha1
kind: APIRule
metadata:
  name: sample-extension-micronaut
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
    host: sample-extension-micronaut
    name: sample-extension-micronaut
    port: 8080
```  

This sample snippet exposes the `sample-extension-micronaut` Service. The Service is specified in the **spec.service.name** field.
The `sample-extension-micronaut` subdomain is specified in the **spec.service.host** field.

* Apply the APIRule:

```shell script
kubectl -n dev apply -f ./k8s/api-rule.yaml
```

### Helm Chart Deployment

A [Helm Chart definition](../helm-charts/sample-extension-micronaut/README.md) is also available for developers to try out.

#### Must Haves

* [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
* [Helm3](https://helm.sh/docs/intro/install/)

#### Helm install

To install the helm chart in `dev` namespace, run the following command. Change to use your image.

```shell script
helm install kymaapp ../helm-charts/sample-extension-micronaut --set image.repository=gabbi/sample-extension-micronaut:0.0.7 --set db.user={db user} --set db.password={db password} --set cluster.domain={cluster domain} -n dev
```

To verify, the installed chart, run `helm -n dev ls`

```shell script
NAME            NAMESPACE       REVISION        UPDATED                                 STATUS          CHART                           APP VERSION
dev-gateway     dev             1               2020-09-14 17:34:58.607853163 +0000 UTC deployed        gateway-0.0.1
kymaapp         dev             1               2020-09-15 15:04:41.679339 +0200 CEST   deployed        sample-extension-micronaut-0.1.0     1.16.0
```

### Try it out

Access the APIs through this URL: <https://sample-extension-micronaut.{cluster domain}/orders>

Try out various APIs.