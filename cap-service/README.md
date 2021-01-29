## Overview

This sample provides a CAP Service application that you can configure with any of the sample `Order` APIs.

This sample demonstrates how to:

- Create a development Namespace in the Kyma runtime.
- Configure and build an SAPUI5 Docker image.
- Deploy the frontend in the Kyma runtime which includes:
  - A ConfigMap that contains the URL to the backend API.
  - A Deployment of the frontend image with the ConfigMap mounted to a volume.
  - A Service to expose the UI to other Kubernetes resources.
  - An API to expose the frontend externally.

## Prerequisites

- SAP BTP, Kyma runtime instance
- [Docker](https://www.docker.com/)
- [Docker Hub Account](https://hub.docker.com/signup)
- [Node.js](https://nodejs.org/en/)
- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) configured to use the `KUBECONFIG` file downloaded from the Kyma runtime.

### CAP Resources

[CAP hints for SQLite on windows](https://cap.cloud.sap/docs/resources/troubleshooting#how-do-i-install-sqlite-on-windows)
[Troubleshooting guide](https://cap.cloud.sap/docs/resources/troubleshooting#npm-installation) for CAP.

## Steps

### Run the frontend locally

1. Clone the project.

2. Inside the directory, run:

```
npm install
```

3. Install the CAP tools

```Shell/Bash
npm i -g @sap/cds-dk
```

4. Verify the CAP tools install by running

```Shell/Bash
cds
```

5. Deploy the DB schemas to you local `sqlite` database

```Shell/Bash
cds deploy --to sqlite
```

6. Run the app using the command

```Shell/Bash
cds watch
```

The application loads at `http://localhost:4004`.

### Build the Docker image

1. Build and push the image to your Docker repository:

````

docker build -t <your-docker-id>/cap-service -f docker/Dockerfile .
docker push {your-docker-account}/cap-service

```

2. To run the image locally, adjust the value of the **API_URL** parameter in the `webapp/config.js` file and mount it into the image:

```
docker run -p 4004:4004 <dockerid>/cap-service:latest --name cap-service
````

### Deploy the application

1. Create a new `dev` Namespace:

```shell script
kubectl create namespace dev
```

2. Apply the Resources:

```shell script
kubectl -n dev apply -f ./k8s/deployment.yaml
kubectl -n dev apply -f ./k8s/apirule.yaml
```

3. Use the APIRule to open the application:

```
https://cap-service.{cluster-domain}
```

### Examples with HANA DB

https://www.youtube.com/watch?v=kwKr4JbscvY

https://sap-samples.github.io/cloud-cap-risk-management/Kyma/#add-sap-hana-cloud
