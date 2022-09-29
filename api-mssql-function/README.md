# Serverless Function MS SQL database API

## Overview

This sample provides a Serverless Function configured as an API endpoint for communication with the MS SQL database that you can find in the `database-mssql` folder. You can also configure the API endpoint to use the database example provided in the `database-azure-mssql` folder. The `deployment.yaml` defines the Function definition as well as an APIRule to expose the Function without authentication. The Deployment contains the following parameters for the `database-mssql` example that you can configure to modify the default options:

| Parameter    | Value                         |
| ------------ | ----------------------------- |
| **database** | `DemoDB`                      |
| **host**     | `mssql.dev.svc.cluster.local` |
| **password** | `Yukon900`                    |
| **username** | `sa`                          |

> **Note:** If you use the `database-azure-mssql` example, remove the parameters provided by the Function and use the ServiceInstance instead.

This sample demonstrates how to:

- Create a development Namespace in the Kyma runtime.
- Deploy a Serverless Function and an APIRule.

## Prerequisites

- SAP BTP, Kyma runtime instance
- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) configured to use the `KUBECONFIG` file downloaded from the Kyma runtime

## Steps

### Deploy the Function

1. Create a new `dev` Namespace:

   ```shell script
   kubectl create namespace dev
   kubectl label namespaces dev istio-injection=enabled
   ```

2. Apply the Deployment:

   ```shell script
   kubectl -n dev apply -f ./k8s/deployment.yaml
   ```

3. Verify that the Function is up and running:

   ```shell script
   kubectl -n dev get function api-mssql-function
   ```

4. Use the APIRule:

- `https://api-mssql-function.{cluster-domain}/orders`
- `https://api-mssql-function.{cluster-domain}/orders/10000001`
