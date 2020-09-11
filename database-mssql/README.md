# Overview

This sample provides a mssql database configured with a sample database `DemoDB` which contains one table `Orders` populated with two rows of sample data. The generation of the database, table and data is handled within `app/setup.sql`. The database user and password can also be configured within the `app/init-db.sh` which should match the configuration of the secret defined within the `k8s/ßdeployment.yaml`.

This sample demonstrates:

- Creating a development namespace in Kyma Runtime.
- Configuring and building a MSSQL database docker image
- Deploying a MSSQL database in Kyma runtime which includes
  - A secret containing the database user/password
  - A PersistentVolumeClaim for the storage of the database data
  - A deployment of the MSSQL image with the secret and PersistentVolumeClaim configuration
  - A service to expose the database to other Kubernetes resources

## Prerequisites

- SAP Cloud Platform, Kyma Runtime instance
- [Docker](https://www.docker.com/)
- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
- `kubectl` is configured to `KUBECONFIG` downloaded from Kyma Runtime.

## Deploying the database

- Create a new Namespace `dev`

```shell script
kubectl create namespace dev
```

- Build and push the image to your docker repository.

```shell script
docker build -t {your-docker-account}/mssql -f docker/Dockerfile .
docker push {your-docker-account}/mssql
```

- Apply the Persistent Volume Claim.

```shell script
kubectl -n dev apply -f ./k8s/pvc.yaml
```

- Apply the Secret.

```shell script
kubectl -n dev apply -f ./k8s/secret.yaml
```

- Apply the Deployment.

```shell script
kubectl -n dev apply -f ./k8s/deployment.yaml
```

- Verify the Pod is up and running

```shell script
kubectl -n dev get po
```

You should see the pod for deployment `mssql` running.

```shell script
NAME                                     READY   STATUS    RESTARTS   AGE
mssql-6df65c689d-nf9dk        2/2     Running   0          93s
```

## Running the docker image locally

```shell script
docker run -e 'ACCEPT_EULA=Y' -e 'SA_PASSWORD=Yukon900' -p 1433:1433 -d <docker id>/mssql
```
