# Standalone approuter on SAP BTP, Kyma runtime

## Overview

SAP BTP, Kyma runtime is used to develop applications and extensions.

This also brings in the following requirements:

- Serve static content
- Authenticate and authorize users
- Forward to the appropriate identity provider for login
- Rewrite URLs
- Dispatch requests to other microservices while propagating user information

All these and more capabilities are provided by [SAP Application Router](https://help.sap.com/products/BTP/65de2977205c403bbc107264b8eccf4b/01c5f9ba7d6847aaaf069d153b981b51.html).

There are two options to use the Application Router capabilities in SAP BTP, Kyma runtime.

- Managed Application Router
- Standalone Application Router deployed on SAP BTP, Kyma runtime.

You can learn about both options in this [blog](https://blogs.sap.com/2021/12/09/using-sap-application-router-with-kyma-runtime/)

In this sample, we will deploy a Standalone Application Router deployed on SAP BTP, Kyma runtime.

## Scenario

We will deploy an approuter, expose it over the internet via APIRule. It will be exposing a backend API via its configured destinations and routes.

As a simple backend, we will use an HttpBin application that returns the request headers as a response. Good for understanding flows and troubleshooting.

![scenario](assets/scenario.svg)

> Note: Standalone approuter is deployed with 2 replicas. Session stickiness is achieved by configuring the [Destination rule](k8s/deployment.yaml)

## Prerequisites

- [SAP BTP, Kyma runtime instance](../prerequisites/#kyma)
- [Kubernetes tooling](../prerequisites/#kubernetes)

## Steps

- Create a namespace dev

    ```shell script
    kubectl create namespace dev
    kubectl label namespaces dev istio-injection=enabled
    ```

- Deploy the backend service

    ```shell script
    kubectl -n dev apply -f k8s/httpbin.yaml
    ```

- Create the XSUAA Instance.
  - Update the [service instance definition](k8s/xsuaa-service-instance.yaml). Replace {CLUSTER_DOMAIN} with the domain of your cluster.

   ```shell script
    kubectl -n dev apply -f k8s/xsuaa-service-instance.yaml
    ```

- Create the destinations and routes configurations for the approuter

    ```shell script
    kubectl -n dev apply -f k8s/config.yaml
    ```

- Deploy the approuter

    ```shell script
    kubectl -n dev apply -f k8s/deployment.yaml
    ```

- Expose the approuter via APIRule
  - Update the [APIRule](k8s/api-rule.yaml). Replace {CLUSTER_DOMAIN} with the domain of your cluster.

    ```shell script
    kubectl -n dev apply -f k8s/api-rule.yaml
    ```

## Accessing the Application

The approuter is exposed at <https://my-approuter.{CLUSTER_DOMAIN}>. Access the URL <https://my-approuter.{CLUSTER_DOMAIN}/sap/com/httpbin/headers> to get all the request headers
