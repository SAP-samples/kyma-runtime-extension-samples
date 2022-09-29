# HANA Cloud NodeJS API

[![Build docker hana-nodejs](https://github.com/SAP-samples/kyma-runtime-extension-samples/actions/workflows/build-docker-hana-nodejs.yml/badge.svg?branch=main)](https://github.com/SAP-samples/kyma-runtime-extension-samples/actions/workflows/build-docker-hana-nodejs.yml)

This sample demonstrates how SAP HANA Cloud can be utilized within the Kyma runtime.

## Prerequisites

- SAP BTP, Kyma runtime instance
- [Docker](https://www.docker.com/)
- [Node.js](https://nodejs.org/en/)
- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) configured to use the `KUBECONFIG` file downloaded from the Kyma runtime.

## Set SAP HANA Cloud instance

Create a SAP HANA Cloud instance as describe in the first tutorial and complete the other two.

- [hana-clients-choose-hana-instance](https://developers.sap.com/tutorials/hana-clients-choose-hana-instance.html)
- [hana-clients-install](https://developers.sap.com/tutorials/hana-clients-install.html)
- [hana-clients-hdbsql](https://developers.sap.com/tutorials/hana-clients-hdbsql.html)

## Run the app locally

1. Clone the project.

2. Inside the app directory, run:

   ```shell
   npm install
   ```

### Set parameters for app

```shell
export HDB_HOST=**********.hana.trial-us10.hanacloud.ondemand.com
export HDB_PORT=443
export HDB_USER=USER1
export HDB_PASSWORD=Password1
```

### Start the app

```shell
node server.js
```

App will be available at [http://localhost:3000](http://localhost:3000)

## Build the Docker image

1. Build and push the image to your Docker repository:

   ```shell
   docker build -t {docker id}/hanadb-nodejs -f docker/Dockerfile .
   docker push {docker id}/hanadb-nodejs
   ```

2. Run the image locally

   ```shell
   docker run -e HDB_HOST=*******.hana.trial-us10.hanacloud.ondemand.com -e HDB_PORT=443 -e NODE_ENV=production -e HDB_USER=USER1 -e HDB_PASSWORD=Password1 -p 3000:3000 -d {docker id}/hanadb-nodejs
   ```

### Deploy the application

1. Create a new `dev` Namespace:

   ```shell
   kubectl create namespace dev
   kubectl label namespaces dev istio-injection=enabled
   ```

2. Adjust the values of the configmap to match your HANA Cloud instance and apply the Resources:

   ```shell
   kubectl -n dev apply -f ./k8s/deployment.yaml
   kubectl -n dev apply -f ./k8s/apirule.yaml
   kubectl -n dev apply -f ./k8s/configmap.yaml
   kubectl -n dev apply -f ./k8s/secret.yaml
   ```

3. Use the APIRule to open the application:

   ```shell
   https://hanadb-nodejs.{cluster-domain}
   ```

### Further Information

If you would like to set the HANA Cloud firewall to limit IP Addresses, the following query can be ran to determine the callers IPs.

```shell
select * from M_CONNECTIONS
where user_name LIKE 'USER1'
```
