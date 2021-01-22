## Overview

This sample provides a [GeoServer](https://www.geoserver.org) instance with the plugin for SAP HANA Connectivity. Geoserver exposes in a variety of formats spatial data hosted in SAP HANA.

The docker image used is available [here](https://github.com/remi-sap/geoserver4hana/blob/master/Dockerfile). 

## Prerequisites

- SAP Cloud Platform, Kyma runtime instance
- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) configured to use the `KUBECONFIG` file downloaded from the Kyma runtime.
- A HANA Cloud instance

## Deployment method

You could either deploy geoserver manually or using the provided [helm chart](../helm-charts/geoserver/README.md)

## Deploy the app manually

1. Create a new `geo` Namespace:

```shell script
kubectl create namespace geo
```

2. Apply the PersistentVolumeClaim:

```shell script
kubectl -n geo apply -f ./k8s/geoserver-storage.yaml
```
This filesystem will be mounted as the data directory, and will contain configuration files including credentials and connection details.

3. Apply the Deployment:

Open [geoserver-deployments](./k8s/geoserver-deployments.yaml) and edit service.host at the bottom of the file to match your cluster url

```shell script
kubectl -n geo apply -f ./k8s/geoserver-deployment.yaml
```

4. Verify that the Pod ad service is up and running:

```shell script
kubectl -n geo get pods,svc
```

The expected result shows that the Pod for the `geoserver` Deployment is running:

```shell script
% kubectl -n geo get pods,svc
NAME                             READY   STATUS    RESTARTS   AGE
pod/geoserver-7b5f774c78-lh72w   2/2     Running   0          5h9m

NAME                TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE
service/geoserver   ClusterIP   100.67.44.241   <none>        8080/TCP   5h9m
```

Now you could open a web browser to the url you've specified in the deployment yaml file.

## Run the Docker image locally

To run the Docker image locally, run this command:

```shell script
mkdir /tmp/geoserver_data
docker run -d -it -p 8080:8080/tcp -v /tmp/geoserver_data:/geoserver/data_dir remiremi/geoserver4hana
```
