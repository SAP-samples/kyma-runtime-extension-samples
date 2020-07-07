# Overview

This sample provides a frontend ui configured with any of the sample order apis. This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

This sample demonstrates:

- Creating a development namespace in Kyma Runtime.
- Configuring and building a reactjs docker image
- Deploying a the frontent in the Kyma runtime which includes
  - A config map containg the url to the backend api
  - A deployment of the frontent image with the config map mounted to a volumn
  - A service to expose the UI to other Kubernetes resources
  - An API to expose the frontend externally

## Prerequisites

- SAP Cloud Platform Extension Factory, Kyma Runtime instance
- [Docker](https://www.docker.com/)
- [Node.js](https://nodejs.org/en/)
- [Yarn](https://yarnpkg.com/)
- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
- `kubectl` is configured to `KUBECONFIG` downloaded from Kyma Runtime.

## Running the Frontend Locally

- Clone the project
- Inside the directory run `yarn install`
- Adjust the value of `window.Config.API_URL` found in `public/config.js` to match your orders api url.
- To start the app run `yarn start` which should load the app at `http://localhost:3000`

## Building the Docker Image

- Build and push the image to your docker repository.

  ```
  docker build -t {your-docker-account}/fe-react-mssql -f docker/Dockerfile .
  docker push {your-docker-account}/fe-react-mssql
  ```

- To run the image locally use adjust the value of `window.Config.API_URL` found in `public/config.js` and mount it into the image.

  ```
  docker run --mount type=bind,source=$(pwd)/public/config.js,target=/usr/share/nginx/html/config.js -p 3000:80 -d {your-docker-account}/fe-react-mssql:latest
  ```

## Deploying the Frontend

- Create a new Namespace `dev`

```shell script
kubectl create namespace dev
```

- Adjust the config map.
  - Within `/k8s/deployment.yaml` adjust the value of window.Config.API_URL found in the config map to your api

* Apply the deployment.

```shell script
kubectl -n dev apply -f ./k8s/deployment.yaml
```

- Use the API Rule to open the app
  - `https://fe-react-mssql.<cluster-domain>`
