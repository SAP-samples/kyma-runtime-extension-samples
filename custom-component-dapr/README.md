# Installation of Custom Resources into Kyma

[![Build docker Custom Component Dapr](https://github.com/SAP-samples/kyma-runtime-extension-samples/actions/workflows/build-docker-custom-component-dapr.yml/badge.svg?branch=main)](https://github.com/SAP-samples/kyma-runtime-extension-samples/actions/workflows/build-docker-custom-component-dapr.yml/)

This repository contains the setup of the [Dapr](https://dapr.io/) in SAP Business Technology Platform (BTP), Kyma runtime based on open source Kyma 2.0 and provides a sample app to interact with the [state store component](https://docs.dapr.io/concepts/components-concept/) of Dapr.

## Prerequisites

>> This tutorial is targetingS AP BTP, Kyma runtime based on open source Kyma 2.0

You need to have the following prerequisites as described here:

* [Prerequistes - Docker](../prerequisites/README.md#docker)
* [Prerequistes - Kubernetes](../prerequisites/README.md#kubernetes)
* [Prerequistes - Build Tooling](../prerequisites/README.md#build-tooling)
* [Prerequistes - REST Client](../prerequisites/README.md#rest-clients)

The sample in this repository is validated with [Docker Desktop](https://www.docker.com/products/docker-desktop) for building the containers. While other alternatives like [podman](https://podman.io/) mights also work, we did not validate it.

In addition we assume that [Docker Hub](https://hub.docker.com/) is used as container registry.

>> ⚠ Be aware of the licensing model of Docker that changed concerning the usage in enterprises. For details see the [official announcement](https://www.docker.com/blog/updating-product-subscriptions/)

As an alternative, this tutorial contains a [develop container](.devcontainer/devcontainer.json).

## Scenario

### Business Part

We want to develop a *wishlist service* (e.g. for Christmas, birthdays etc.). So anybody should be able to place three wishes (yes only three) on a wishlist. The services should offer endpoints to get a list of wishes already on the list as well as be able to place wishes to the list. In addition, there should be a management endpoint that allows to delete all wishes from the list (yes that's for you you naughty folks out there).

To implement this we want to use a state store, but as a cross-functional requirement we do not want to rely on a specific state store. We want to be able to exchange this at any point in time. On the other hand we want to make the life of the developer as easy as possible when it comes to the consumption of the state store. Even when the concrete state store service changes there should be no need to change the implementation.

### Technical Part

Technically of course we deploy the solution to SAP BTP, Kyma runtime based on open source Kyma 2.0 and attach a state store like Redis.

To fulfill the cross-functional requirement we will use Dapr and its [state handling building block](https://docs.dapr.io/developing-applications/building-blocks/state-management/state-management-overview/). The installation of [Custom Resources](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/) is possible with SAP BTP, Kyma runtime based on open source Kyma 2.0 and we will use this new degree-of-freedom to make use of *Dapr* in the Kyma cluster. 

However, as Kyma represents an opinionated stack and already comes with some components, there are some points to consider when setting things up that we will cover in the following sections.

>>🔎 **Observation** - For the state store we use a deployment of Redis into the Kyma Cluster. This is not a production-grade setup, but for the sake of this sample we assume this approach as okay.

## Setup of Dapr in SAP BTP, Kyma runtime based on open source Kyma 2.0

In general there are two ways to deploy Dapr to a Kubernetes cluster:

* Using the [Dapr CLI](https://docs.dapr.io/operations/hosting/kubernetes/kubernetes-deploy/#install-with-dapr-cli)
* Using [helm](https://docs.dapr.io/operations/hosting/kubernetes/kubernetes-deploy/#install-with-helm-advanced)

We will use the `helm` option. Before we start the installation we must consider that [Istio](https://istio.io/) is running as service mesh in Kyma. This means that:

* Sidecar containers are injected by Istio in any namespace as default setup.
* Istio is taking care about securing communication via mTLS.

While the first aspect can potentially cause conflicts with any new custom resource, the second one is a functional overlap with Dapr's [service invocation](https://docs.dapr.io/developing-applications/building-blocks/service-invocation/service-invocation-overview/) component. In order to have a conflict-free installation both points must be handled, namely:

* no sidecar injection into the core Dapr components
* no mTLS setup on Dapr side

Let's do that.

1. Create a dedicated custom namespace for the installation of Dapr. We go for `dapr-system`:

   ```shell
   kubectl create ns dapr-system
   ```

2. Deactivate the sidecar container injection into the `dapr-system` namespace. We achieve this by labeling the namespace with `istio-injection=disabled`:

   ```shell
   kubectl label namespace dapr-system istio-injection=disabled
   ```

   >>🔎 **Observation** - You can of course also create the namespace via the new Kyma console and deactivate the sidecar injection there. Be aware to switch to the "Advanced" section in the namespace creation dialog.

3. Add the Dapr helm repository and update it:

  ```shell
  helm repo add dapr https://dapr.github.io/helm-charts/
  helm repo update
  # See which chart versions are available
  helm search repo dapr --devel --versions
  ```

4. Install the desired version of Dapr via helm into the custom namespace. In order to avoid clashes with the mTLS setup of Istio we globally deactivate the mTLS functionality for Dapr

  ```shell
  helm upgrade --install dapr dapr/dapr --version=1.6 --namespace dapr-system  --set global.mtls.enabled=false --wait
  ```

5. Verify the installation via:

  ```shell
  kubectl get pods --namespace dapr-system
  ```

  This should give you an output like:

  ```shell
  NAME                                     READY     STATUS    RESTARTS   AGE
  dapr-dashboard-7bd6cbf5bf-xglsr          1/1       Running   0          40s
  dapr-operator-7bd6cbf5bf-xglsr           1/1       Running   0          40s
  dapr-placement-7f8f76778f-6vhl2          1/1       Running   0          40s
  dapr-sidecar-injector-8555576b6f-29cqm   1/1       Running   0          40s
  dapr-sentry-9435776c7f-8f7yd             1/1       Running   0          40s
  ```

🎉 **Congratulations** - you have Dapr running on Kyma.

Let's move on and deploy Redis to Kyma which will act as state store.

## Setup of Redis and Sample App

In this sample we will deploy Redis as well as the sample app into the same custom namespace `dapr-sample` that we create via:

```shell
kubectl create ns dapr-sample
```

### Deploy Redis to SAP BTP, Kyma runtime based on open source Kyma 2.0

Next we deploy Redis to the namespace `dapr-sample` using helm. Apply the following commands:

```shell
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
helm install redis bitnami/redis --namespace dapr-sample
```

You can verify the installation via:

```shell
kubectl get pods -n dapr-sample
```

This should give you an output like:

```shell
NAME                READY   STATUS    RESTARTS   AGE
redis-master-0      1/1     Running   0          69s
redis-replicas-0    1/1     Running   0          69s
redis-replicas-1    1/1     Running   0          22s
```

>>🔎 **Observation** - The deployment of Redis also created a Kubernetes secret containing the password to access Redis. We can use to interact with Redis via Dapr.

🎉 **Congratulations** - you have a Redis store running on Kyma.

Let's move on and connect Redis to Dapr.

## Connect Redis to Dapr

To make Dapr aware of Redis as a state store we must create a so called Dapr *component*. To do so we apply the file [daprstate.yaml](./k8s/daprstate.yaml):

```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: statestore
spec:
  type: state.redis
  version: v1
  metadata:
  - name: redisHost
    value: redis-master.dapr-sample.svc.cluster.local:6379
  - name: redisPassword
    secretKeyRef:
      name: redis
      key: redis-password
```

The file contains the name of the store namely `statestore` which will be used to address it via the Dapr API from our application.

We apply the file via:

```shell
kubectl apply -f daprstate.yaml -n dapr-sample
```

>>🔎 **Observation** - We fetch the password to connect to Redis from the secrets file that was created in the deployment of Redis.

With this any container that is connected to Dapr can interact with the state store component via standardized APIs independent of the technical type of the state store itself.

>> 📝 **Tip** - You find more information about Dapr in the official [documentation](https://docs.dapr.io/concepts/components-concept/)

🎉 **Congratulations** - you have connected Redis to Dapr as a component.

Let's move on and create the wishlist application that uses the state store.

## The Sample Application

### Provide the Configuration

In order to avoid hard-coded configuration values in our application code we create a config map that contains some basic parameters to call Dapr from the app. The values are available as environment variables for our app. The `configmap.yaml` contains the following data:

```
apiVersion: v1
kind: ConfigMap
metadata:
  name: configfordaprwishlistapp
  labels:
    app: daprwishlistapp
data:
  daprhost: http://localhost
  statestoreid: statestore
```

Apply this configuration to your namespace via:

```shell
kubectl apply -f configmap.yaml -n dapr-sample
```

### Implement the Application

As the focus of the sample is to deploy a custom resource to Kyma we will not go into the depth of the implementation here, we will just shortly highlight how the interaction with Dapr works from the code.

To implement the business logic we provided three functions i.e. *Azure Functions* in TypeSCript that give us the three endpoints. The code is contained in the following directories:

* `DaprWishListMessage`: this function contains the logic to add a wish to the wishlist (including the constraint to put only three on one list) for a given key and and is available via the path `/api/wishlistentry/{key}` for `POST` requests.
* `DaprWishListReport`: this function contains the logic to get the wishes on a list for a specific key and is available via the path `/api/wishlist/{key}` for `GET` requests.
* `DaprWishListManagementApi`: this function contains the logic to completely delete a wishlist for a specific key and is available via the path `/api/wishlistmanagement/{key}` for `DELETE` requests.

The logic is defined in the `index.ts` files in the corresponding directories, the configuration (e.g. what HTTP verbs are supported) is defined in the `function.json` files.  

Let's take a closer look at the core code of `DaprWishListReport` namely the `index.ts` file to get an impression of the interaction with the state store using Dapr:

```typescript
import { DaprClient } from "dapr-client"

...

const daprHost = process.env.HOST_OF_DAPR
const daprPort = process.env.DAPR_HTTP_PORT
const stateStoreName = process.env.STATE_STORE_ID
const stateStoreKey = context.bindingData.key

...

try {
    const daprClient = new DaprClient(daprHost, daprPort)
    const currentWishListEntries = <KeyValueType>await daprClient.state.get(stateStoreName, stateStoreKey)
    context.log(`Current state: ${currentWishListEntries}`)
    if (currentWishListEntries) {
        responseBody = `You have already ${currentWishListEntries.wishCounter} on your list. Your wishes are: ${currentWishListEntries.wishListItems}`
    }
    else {
        responseBody = "No wishes yet made. Go start filling you list but be aware that you only have 3 wishes"
    }
} catch (error) {
    context.log.error(error)
    responseStatusCode = 500
    responseBody = `An error occurred when fetching the data`
}
```

THe main building blocks are:

* We import the [Dapr SDK for JavaScript](https://github.com/dapr/js-sdk) to make the interaction with Dapr in a straightforward way.
* We assign the relevant parameters for the Dapr client from the environment variables and from the data we get via the request
* We create a Dapr client and access the uniform interface to the state store via the corresponding message, in this case via `state.get` to fetch the current state for a specific key.

The function returns the result to the caller in the body of the HTTP response.

>> 📝 **Tip** - If you want to learn more about the implementation details, we provide a CodeTour that gives you more insight into this.

### Build the container

Before we build the container, we need to install the dependencies and build the code via:

```shell
npm install
npm run build
```

Next we need to build the container for our functions. To do so we have a [Docker file](Dockerfile) in place which uses a predefined base image and is configured to expose the functions on port 7080. The build is executed via the Docker CLI.

To make the build and push of the container a bit more comfortable find a [Makefile](Makefile) in this repository. Replace the placeholder `<Your Docker ID>` in this file and then build and push the image to DockerHub via:

```shell
make build-and-push-image
```

### Deploy the Sample App

WHen the image is available in the container registry i.e. DockerHub, we can deploy the application to Kyma. In order to connect the deployment with Dapr (and technically inject the Dapr sidecar to the pod) we need to add the following annotations in the `deployment.yaml` file:

```yaml
...
metadata:
  labels:
    app: daprwishlistapp
  annotations:
    dapr.io/enabled: "true"
    dapr.io/app-id: "daprwishlistapp"
    dapr.io/app-port: "7080"
...
```

These annotations:

* enable the Dapr sidecar injection (`dapr.io/enabled`)
* provide an identifier for the app to Dapr (`dapr.io/app-id`)
* tell Dapr which port to listen to (`dapr.io/app-port`)

We execute the deployment in two steps:

1. Create the deployment and the service in Kyma via the file [deployment.yaml](k8s/deployment.yaml) in the directory `k8s`. Navigate in the directory, adjust the placeholder `<Your Docker ID>` and apply the file via:

  ```shell
  kubectl apply -f deployment.yaml -n dapr-sample
  ```

  After that you have the application up and running in your cluster. YOu can of course verify the deployment via the Kyma dashboard or via the CLI.
  
  >>🔎 **Observation** - When you look at the put of `kubectl get pods -n dapr-sample` you will see that the pod of the application consists of three containers, the container of the app itself, the Istio sidecar container and the Dapr sidecar container.

2. To make the endpoints callable we need an API rule in place that exposes the service. For that we prepared the file [apirules.yaml](k8s/apirule.yaml) that creates such a rule. Apply the file via:

  ```shell
  kubectl apply -f apirule.yaml -n dapr-sample
  ```

  >>🔎 **Observation** - We use the `noop` handler as access strategy. This is not a setup that should be used in production.

🎉 **Congratulations** - you have deployed the application to Kyma.

Now we can test and see if the bits and pieces work together as expected.

## Test the Setup

You can call the endpoints with your preferred tool like Postman, cUrl.

We have prepared the [samplerequest.http](samplerequests.http) file that you can use for the calls. For that you need the [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) extension for VSCode. The only thing you need do is to replace the placeholder `<Put your cluster domain here>` with the according value for your Kyma Cluster. You can retrieve that via:

```shell
kubectl get configmap -n kube-system shoot-info -ojsonpath='{.data.domain}'
```

Now you are set to execute the different calls to interact with the wishlist. Have fun!

>> 📝 **Tip** - You can use the .http file as template for the calls in any other tool you prefer.

🏆  **FINISHED** - you made it, you deployed Dapr as custom component as well as Redis to a Kyma cluster and setup an application that uses the Dapr state store component!

## Want more guidance - use the CodeTour

We also offer a [CodeTour](https://marketplace.visualstudio.com/items?itemName=vsls-contrib.codetour) for this repository. The tour provides you the information presented in this `README.md` and adds more detailed explanations the code snippets especially when it comes to the Azure Functions part.
