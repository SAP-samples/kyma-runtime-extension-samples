## Overview

This sample provides a CAP Service application service.

This sample demonstrates how to:

- Create a development Namespace in the Kyma runtime.
- Configure and build an CAP Service Docker image.
- Deploy the CAP Service in the Kyma runtime which includes:
  - A Deployment of the CAP Service.
  - An API to expose the service externally.

## Prerequisites

- SAP BTP, Kyma runtime instance
- [Docker](https://www.docker.com/)
- [Docker Hub Account](https://hub.docker.com/signup)
- [Node.js](https://nodejs.org/en/)
- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) configured to use the `KUBECONFIG` file downloaded from the Kyma runtime.

### CAP Resources

- [CAP hints for SQLite on windows](https://cap.cloud.sap/docs/resources/troubleshooting#how-do-i-install-sqlite-on-windows)
- [Troubleshooting guide](https://cap.cloud.sap/docs/resources/troubleshooting#npm-installation) for CAP.

## Steps

### Run the frontend locally

1. Clone the project.

2. Inside the directory, run:

   ```shell
   npm install
   ```

3. Install the CAP tools

   ```shell
   npm i -g @sap/cds-dk
   ```

4. Verify the CAP tools install by running

   ```shell
   cds
   ```

5. Deploy the DB schemas to you local `sqlite` database

   ```shell
   cds deploy --to sqlite
   ```

6. Run the app using the command

   ```shell
   cds watch
   ```

The application loads at `http://localhost:4004`.

### Build the Docker image

1. Build and push the image to your Docker repository:

   ```shell
   docker build -t <your-docker-id>/cap-service -f docker/Dockerfile .
   docker push {your-docker-account}/cap-service
   ```

2. To run the image locally, adjust the value of the **API_URL** parameter in the `webapp/config.js` file and mount it into the image:

   ```shell
   docker run -p 4004:4004 <dockerid>/cap-service:latest --name cap-service
   ```

### Deploy the application

1. Create a new `dev` Namespace:

   ```shell
   kubectl create namespace dev
   kubectl label namespaces dev istio-injection=enabled
   ```

2. Apply the Resources:

   ```shell
   kubectl -n dev apply -f ./k8s/deployment.yaml
   kubectl -n dev apply -f ./k8s/apirule.yaml
   ```

3. Use the APIRule to open the application:

   ```shell
   https://cap-service.{cluster-domain}
   ```

### Examples with HANA DB

- <https://www.youtube.com/watch?v=kwKr4JbscvY>
- <https://sap-samples.github.io/cloud-cap-risk-management/Kyma/#add-sap-hana-cloud>
