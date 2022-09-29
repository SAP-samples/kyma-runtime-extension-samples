# Azure MS SQL database

## Overview

This sample provisions the MS SQL database within Microsoft Azure using the Open Service Broker. This process generates a randomly named database, user and password. Once the provisioning is completed, the database is configured with a sample `Orders` table populated with two rows of sample data. The generation of the table and data is handled within the `seed-db` lambda function which is defined in the `k8/deployment.yaml` file.

This sample demonstrates how to:

- Create a development Namespace in the Kyma runtime.
- Provision the Azure MS SQL database using the Open Service Broker.
- Deploy a Serverless Function and an APIRule.

## Prerequisites

- SAP BTP, Kyma runtime instance
- Microsoft Azure Account
- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) configured to use the `KUBECONFIG` file downloaded from the Kyma runtime

## Steps

### Provisioning the Open Service Broker

1. Create a new `dev` Namespace:

   ```shell
   kubectl create namespace dev
   kubectl label namespaces dev istio-injection=enabled
   ```

2. Open the Kyma Console and choose the `dev` Namespace.
3. Within the `dev` Namespace, choose **Service Management** -> **Catalog** -> **Add-Ons**.
4. Choose the `Azure Service Broker`.
5. Follow the steps to create the `azure-broker-data` Secret noted in the `Documentation`.
6. Within the Azure Service Broker Add-On, choose the **Add once** option.
7. Choose your desired `Minimum services stability`. The MS SQL service is available in `Stable`.
8. Set the `Azure Secret name` to `azure-broker-data`.
9. Choose the **Create** option.

## Provision the MS SQL database

1. Open the Kyma Console and choose the `dev` Namespace.
2. Within the `dev` Namespace, choose **Service Management** -> **Catalog** -> **Services**.
3. Choose the `Azure SQL Database 12.0` tile.
4. Choose the following:

   - Plan: Basic Tier
   - Connection Plan: Default
   - Location: Your desired location
   - Resource Group: The resource group to assign the database to

5. Choose **Create**.

### Deploy the Function/APIRule

1. Apply the Deployment:

   ```shell
   kubectl -n dev apply -f ./k8s/deployment.yaml
   ```

2. Verify that the Function is up and running:

   ```shell
   kubectl -n dev get function seed-db
   ```

### Bind the Function to the MS SQL database

1. Open the Kyma Console and choose the `dev` Namespace.
2. Within the `dev` Namespace, choose **Development** -> **Functions**.
3. Choose the `seed-db` Function.
4. Choose the **Configuration** tab.
5. Choose the **Create Service Binding** option.
6. Choose the ServiceInstance for the Azure SQL.
7. Choose **Create**.

### Call the API to seed the MS SQL database

1. Open the Kyma Console and choose the `dev` Namespace.
2. Within the `dev` Namespace, choose **Configuration** -> **API Rules**.
3. Choose the `seed-db` APIRule.
4. Choose the Host value link. The expected response is `database has been initialized....`.
5. Remove the Function/APIRule Deployment:

   ```shell
   kubectl -n dev delete -f ./k8s/deployment.yaml
   ```
