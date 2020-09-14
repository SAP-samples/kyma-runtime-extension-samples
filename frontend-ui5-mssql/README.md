## Overview

This sample provides a frontend SAPUI5 application that you can configure with any of the sample `Order` APIs.

This sample demonstrates how to:

- Create a development Namespace in the Kyma runtime.
- Configure and build an SAPUI5 Docker image.
- Deploy the frontend in the Kyma runtime which includes:
  - A ConfigMap that contains the URL to the backend API.
  - A Deployment of the frontend image with the ConfigMap mounted to a volume.
  - A Service to expose the UI to other Kubernetes resources.
  - An API to expose the frontend externally.

## Prerequisites

- SAP Cloud Platform, Kyma runtime instance
- [Docker](https://www.docker.com/)
- [Node.js](https://nodejs.org/en/)
- [UI5 Tooling](https://sap.github.io/ui5-tooling/)
- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) configured to use the `KUBECONFIG` file downloaded from the Kyma runtime.

## Steps

### Run the frontend locally

1. Clone the project.

2. Inside the directory, run:

 ```
 npm install
 ```

3. Adjust the value of the **API_URL** parameter in the `webapp/config.js` file to match your `orders` API URL.

4. To start the application, run:

 ```
 npm run-script start
 ```

 The application loads at `http://localhost:8080`.

### Build the Docker image

1. Build and push the image to your Docker repository:

  ```
  docker build -t {your-docker-account}/fe-ui5-mssql -f docker/Dockerfile .
  docker push {your-docker-account}/fe-ui5-mssql
  ```

2. To run the image locally, adjust the value of the **API_URL** parameter in the `webapp/config.js` file and mount it into the image:

  ```
  docker run --mount type=bind,source=$(pwd)/webapp/config.json,target=/usr/share/nginx/html/config.json -p 8080:80 -d {your-docker-account}/fe-ui5-mssql:latest
  ```

### Deploy the frontend

1. Create a new `dev` Namespace:

  ```shell script
  kubectl create namespace dev
  ```

2. Adjust the ConfigMap. Within the `/k8s/deployment.yaml` file, adjust the value of the **API_URL** parameter found in the ConfigMap to your API.

3. Apply the Deployment:

  ```shell script
  kubectl -n dev apply -f ./k8s/deployment.yaml
  ```

4. Use the APIRule to open the application:
  ```
  https://fe-ui5-mssql.{cluster-domain}
  ```
