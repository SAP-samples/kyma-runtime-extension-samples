# Overview

This sample provides a serverless function configured as an api endpoint for communication to the mssql database found in the `database-mssql` folder. The deployment.yaml defines the function definition as well as an api rule to expose the function to the internet without authentication. The deployment contains the following parameters which may need to be changed if the default options of the `database-mssql` example where modified.

| Name     | Value                                  |
| -------- | -------------------------------------- |
| database | DemoDB                                 |
| server   | mssql-deployment.dev.svc.cluster.local |
| password | Yukon900                               |
| user     | sa                                     |

This sample demonstrates:

- Creating a development namespace in Kyma Runtime.
- Deployment of a serverless function and api-rule

## Prerequisites

- SAP Cloud Platform Extension Factory, Kyma Runtime instance
- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
- `kubectl` is configured to `KUBECONFIG` downloaded from Kyma Runtime.

## Deploying the function

- Create a new Namespace `dev`

```shell script
kubectl create namespace dev
```

- Apply the deployment.

```shell script
kubectl -n dev apply -f ./k8s/deployment.yaml
```

- Verify the Function is up and running

```shell script
kubectl -n dev get function function-mssql-api
```

- Example Usage of the API Rule
  - `https://function-mssql-api.<cluster-domain>/orders`
  - `https://function-mssql-api.<cluster-domain>/orders/10000001`
