# Overview

This sample provisions a mssql database within Microsoft Azure using the Open Service Broker. This process generates a randomly named database, user and password. Once the provisioning if completed the database is configured with a sample table `Orders` populated with two rows of sample data. The generation of the table and data is handled within a lambda function `seed-db` which is defined in `k8/deployment.yaml`.

This sample demonstrates:

- Creating a development namespace in Kyma Runtime.
- Provisioning an Azure MSSQL database using the Open Service Broker
- Deployment of a serverless function and api-rule

## Prerequisites

- SAP Cloud Platform Extension Factory, Kyma Runtime instance
- Microsoft Azure Account
- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
- `kubectl` is configured to `KUBECONFIG` downloaded from Kyma Runtime.

## Provisioning the Open Service Broker

- Create a new Namespace `dev`

```shell script
kubectl create namespace dev
```

- Open the Kyma console and choose the namespace `dev`
- Within the `dev` namespace choose `Service Management` -> `Catalog` -> `Add-Ons`
- Choose the Azure Service Broker
- Follow the steps to create the `azure-broker-data` secret noted in the `Documentation`
- Within the Azure Service Broker Add-On choose the option `Add once`
- Choose your desired `Minimum services stability` - the MSSQL is availabe in `Stable`
- Set the `Azure Secret name` to `azure-broker-data`
- Choose the option `Create`

## Provisioning the MSSQL Database

- Open the Kyma console and choose the namespace `dev`
- Within the `dev` namespace choose `Service Management` -> `Catalog` -> `Services`
- Choose the tile `Azure SQL Database 12.0`
- Choose the following
  - Plan: Basic Tier
  - Connection Plan: Default
  - Location: Your desired location
  - Resource Group: The resource group to assign the database to
- Choose `Create`

## Deploying the function/api rule

- Apply the deployment.

```shell script
kubectl -n dev apply -f ./k8s/deployment.yaml
```

- Verify the Function is up and running

```shell script
kubectl -n dev get function seed-db
```

## Binding the function to the MSSQL Database

- Open the Kyma console and choose the namespace `dev`
- Within the `dev` namespace choose `Development` -> `Functions`
- Choose the function `seed-db`
- Choose the `Configuration` tab
- Choose the option `Create Service Binding`
- Choose the Service Instance for the Azure sql instance.
- Choose `Create`

## Call the api to seed the MSSQL Database

- Open the Kyma console and choose the namespace `dev`
- Within the `dev` namespace choose `Configuration` -> `API Rules`
- Choose the API Rule `seed-db`
- Choose the Host value link. This should result in the response `database has been initialized....`
- Remove the function/api rule deployment

```shell script
kubectl -n dev delete -f ./k8s/deployment.yaml
```
