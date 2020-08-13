# Overview

This sample provides an Golang API endpoint for communication to the mssql database found in the `database-mssql` folder. It can also be reconfigured to use the database example provided in `database-azure-mssql`. The deployment.yaml defines the function definition as well as an api rule to expose the function to the internet without authentication. The deployment also contains a config map and a secret containing the following parameters which may need to be changed if the default options of the `database-mssql` example where modified.

| Name     | Value                                  |
| -------- | -------------------------------------- |
| database | DemoDB                                 |
| host     | mssql-deployment.dev.svc.cluster.local |
| password | Yukon900                               |
| username | sa                                     |
| port     | 1433                                   |

This sample demonstrates:

- Creating a development namespace in Kyma Runtime.
- Deployment of Kubernetes resources which include
  - API written in GO
  - An API-Rule
  - A Kubernetes Service
  - A Kubernetes Secret
  - A Kubernetes Config Map

## Prerequisites

- SAP Cloud Platform Extension Factory, Kyma Runtime instance
- [Docker](https://www.docker.com/)
- [Go](https://golang.org/doc/install)
- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
- `kubectl` is configured to `KUBECONFIG` downloaded from Kyma Runtime.

## Running the API Locally

- Set the environment variables required for the database connection

```shell script
export MYAPP_username=sa
export MYAPP_password=Yukon900
export MYAPP_database=DemoDB
export MYAPP_host=localhost
export MYAPP_port=1433
```

- Run the program

```shell script
go run ./cmd/api
```

## Building the Docker Image

- Build and push the image to your docker repository.

```shell script
docker build -t {your-docker-account}/api-mssql-go -f docker/Dockerfile .
docker push {your-docker-account}/api-mssql-go
```

- To run the image locally

```shell script
  docker run -p 8000:8000 -d {your-docker-account}/api-mssql-go:latest
```

## Deploying the API - MSSQL running within Kyma cluster

- Create a new Namespace `dev`

```shell script
kubectl create namespace dev
```

- Apply the deployment.

```shell script
kubectl -n dev apply -f ./k8s/deployment.yaml
```

- Verify the deployment is up and running

```shell script
kubectl -n dev get deployment api-mssql-go
```

- Example Usage of the API Rule
  - `https://api-mssql-go.<cluster-domain>/orders`
  - `https://api-mssql-go.<cluster-domain>/orders/10000001`


## Deploying the API - MSSQL Service binding

- Create a new Namespace `dev`

```shell script
kubectl create namespace dev
```

- Get the name of the service instance 

```shell script
kubectl -n dev get serviceinstances
```

Example

| NAME                                  | CLASS                       | PLAN  | STATUS | AGE |
| ------------------------------------- | --------------------------- | ----- | ------ | --- |
| ***azure-sql-12-0-unkempt-entrance*** | ServiceClass/azure-sql-12-0 | basic | Ready  | 63m |


- Within the deployment-servicebinding.yaml, adjust the name of the instanceRef property of the ServiceBinding to match  

<pre>
<code>
apiVersion: servicecatalog.k8s.io/v1beta1
kind: ServiceBinding
metadata:
  name: azure-sql
spec:
  instanceRef:
    name:<b>azure-sql-12-0-unkempt-entrance</b>
</code>
</pre>

- Apply the deployment.

```shell script
kubectl -n dev apply -f ./k8s/deployment-servicebinding.yaml
```