# Overview

This sample provides an Golang API endpoint for communication to the mssql database provided in the samples `database-mssql` and `database-azure-mssql`.  An event trigger can also be enabled for either example.

## database-mssql sample

If using the `database-mssql` example the deployment.yaml should be used. This defines the deployment definition as well as an api rule to expose the function to the internet without authentication. The deployment also contains a config map and a secret containing the following parameters which may need to be changed if the default options of the `database-mssql` example were modified.

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
  - Deployment of API written in GO
  - An API-Rule
  - Service
  - Secret
   
## database-azure-mssql sample

The deployment-servicebinding.yaml should be used if connecting to the `database-azure-mssql` example.  This defines the deployment definition as well as an api rule to expose the function to the internet without authentication, but also defines a ServiceBinding and ServiceBindingUsage which configured it to use the `database-azure-mssql` ServiceInstance.

This sample demonstrates:

- Creating a development namespace in Kyma Runtime.
- Deployment of Kubernetes resources which include
  - Deployment of API written in GO
  - API-Rule
  - Service
  - ServiceBinding
  - ServiceBindingUsage


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

## Deploying the API - database-mssql sample

- Create a new Namespace `dev`

```shell script
kubectl create namespace dev
```

- Apply the Configmap.

```shell script
kubectl -n dev apply -f ./k8s/configmap.yaml
```

- Apply the Secret.

```shell script
kubectl -n dev apply -f ./k8s/secret.yaml
```

- Apply the deployment.

```shell script
kubectl -n dev apply -f ./k8s/deployment.yaml
```

- Apply the API Rule.

```shell script
kubectl -n dev apply -f ./k8s/apirule.yaml
```

- Verify the deployment is up and running

```shell script
kubectl -n dev get deployment api-mssql-go
```

- Example Usage of the API Rule
  - `https://api-mssql-go.<cluster-domain>/orders`
  - `https://api-mssql-go.<cluster-domain>/orders/10000001`


## Deploying the API - database-azure-mssql sample

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

## Deploying the Event Trigger

The event trigger will work with either sample.  It expects that either SAP Commerce Cloud or the Commerce Mock application has been connected and configure within the namespace.  You can find a blog detailing the Commerce Mock setup [here](https://blogs.sap.com/2020/06/17/sap-cloud-platform-extension-factory-kyma-runtime-commerce-mock-events-and-apis/)

The trigger and code within the Golang application are setup for the order.created event.  Prior to deploying the trigger verify that value of the source matches the name of your application.  

- Apply the deployment.

```shell script
kubectl -n dev apply -f ./k8s/event-trigger.yaml
```
- Within the mock app submit an order.created event - this will propulate the database with the submitted orderCode and a description that reads `order received from event`
  
