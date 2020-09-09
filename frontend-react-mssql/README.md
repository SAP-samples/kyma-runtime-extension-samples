# Overview

This sample provides a frontend UI configured with any of the sample `Order` APIs. This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

This sample demonstrates how to:

- Create a development Namespace in the Kyma runtime.
- Configure and build a React.js Docker image.
- Deploy a frontend in the Kyma runtime which includes:
  - A ConfigMap that contains the URL to the backend API.
  - A Deployment of the frontend image with the ConfigMap mounted to a volume.
  - A Service to expose the UI to other Kubernetes resources.
  - An API to expose the frontend externally.

## Prerequisites

- SAP Cloud Platform, Kyma runtime instance
- [Docker](https://www.docker.com/)
- [Node.js](https://nodejs.org/en/)
- [Yarn](https://yarnpkg.com/)
- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) configured to use the `KUBECONFIG` file downloaded from the Kyma runtime

## Steps

### Run the frontend locally

1. Clone the project.

2. Inside the directory, run:

 ```
 yarn install
 ```

3. Adjust the value of the **window.Config.API_URL** parameter in the `public/config.js` file to match your orders API URL.

4. To start the application, run:

  ```
  yarn start
  ```

  This command loads the application at `http://localhost:3000`.

### Build the Docker image

1. Build and push the image to your Docker repository:

  ```
  docker build -t {your-docker-account}/fe-react-mssql -f docker/Dockerfile .
  docker push {your-docker-account}/fe-react-mssql
  ```

2. To run the image locally, adjust the value of the **window.Config.API_URL** parameter in the `public/config.js` file and mount it into the image:

  ```
  docker run --mount type=bind,source=$(pwd)/public/config.js,target=/usr/share/nginx/html/config.js -p 3000:80 -d {your-docker-account}/fe-react-mssql:latest
  ```

### Deploy the frontend

1. Create a new `dev` Namespace:

```shell script
kubectl create namespace dev
```

2. Adjust the ConfigMap.

  * Within the `/k8s/deployment.yaml` file, adjust the value of the **window.Config.API_URL** parameter found in the ConfigMap to your API.

  * Apply the Deployment:

  ```shell script
  kubectl -n dev apply -f ./k8s/deployment.yaml
  ```

3. Use the APIRule to open the application:

  ```
  https://fe-react-mssql.{cluster-domain}
  ```
