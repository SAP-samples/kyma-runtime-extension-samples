# Overview

This sample provides a frontend sapui5 app which can be configured with any of the sample order apis.

This sample demonstrates:

- Creating a development namespace in Kyma Runtime.
- Configuring and building a sapui5 docker image
- Deploying a the frontent in the Kyma runtime which includes
  - A config map containg the url to the backend api
  - A deployment of the frontent image with the config map mounted to a volumn
  - A service to expose the UI to other Kubernetes resources
  - An API to expose the frontend externally

## Prerequisites

- SAP Cloud Platform Extension Factory, Kyma Runtime instance
- [Docker](https://www.docker.com/)
- [Node.js](https://nodejs.org/en/)
- [UI5 Tooling](https://github.com/SAP/ui5-tooling)
- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
- `kubectl` is configured to `KUBECONFIG` downloaded from Kyma Runtime.

## Running the Frontend Locally

- Clone the project
- Inside the directory run `npm install`
- Adjust the value of `API_URL` found in `webapp/config.js` to match your orders api url.
- To start the app run `npm run-script start` which should load the app at `http://localhost:8080`

## Building the Docker Image

- Build and push the image to your docker repository.

  ```
  docker build -t {your-docker-account}/fe-ui5-mssql -f docker/Dockerfile .
  docker push {your-docker-account}/fe-ui5-mssql
  ```

- To run the image locally use adjust the value of `API_URL` found in `webapp/config.js` and mount it into the image.

  ```
  docker run --mount type=bind,source=$(pwd)/webapp/config.json,target=/usr/share/nginx/html/config.json -p 8080:80 -d {your-docker-account}/fe-ui5-mssql:latest
  ```

## Deploying the Frontend

- Create a new Namespace `dev`

```shell script
kubectl create namespace dev
```

- Adjust the config map.
  - Within `/k8s/deployment.yaml` adjust the value of API_URL found in the config map to your api

* Apply the deployment.

```shell script
kubectl -n dev apply -f ./k8s/deployment.yaml
```

- Use the API Rule to open the app
  - `https://fe-ui5-mssql.<cluster-domain>`
