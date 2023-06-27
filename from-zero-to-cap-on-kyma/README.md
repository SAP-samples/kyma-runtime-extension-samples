# Overview

In this sample, we will start from scratch / zero to deploying an [CAP](https://cap.cloud.sap/docs/) application on Kyma runtime.

- You will create a sample Node.JS based CAP application (Bookshop)
- Using cds, you will create the necessary artifacts and configurations required to deploy on Kyma.
- Last, but not least, you will deploy and verify your running CAP application

> Note: For simplification most of the commands have been defined using the [Makefile](Makefile). In case you want to understand what the actual command is, run `make <command> --just-print`

## Pre-setup

- Set up required environment variables

  - In shell

    ```shell
    export DOCKER_ACCOUNT=<your-docker-account>
    export KUBECONFIG=<your-kubeconfig>
    export NAMESPACE=<your-kyma-namespace>
    export CLUSTER_DOMAIN=$(kubectl get cm -n kube-system shoot-info -ojsonpath='{.data.domain}')
    ```

  - In Windows powershell

    ```powershell
    $ENV:DOCKER_ACCOUNT = "<your-docker-account>"
    $ENV:KUBECONFIG="<your-kubeconfig>"
    $ENV:NAMESPACE="<your-kyma-namespace>"
    $ENV:CLUSTER_DOMAIN=$(kubectl get cm -n kube-system shoot-info -ojsonpath='{.data.domain}')
    ```

## CAP Application

- Initialize the Cap Bookshop sample

    ```shell
    make init
    ```

Let's take a minute to inspect our cap application. It is a simple Bookshop sample where you can access Book entries via API calls.

- Data model defined in [data-model.cds](./bookshop/db/data-model.cds)
- Core Data Service defined in [cat-service.cds](./bookshop/srv/cat-service.cds)

Directly from CAP website, CAP promotes getting started with minimal upfront setup, based on convention over configuration, and a grow-as-you-go approach, adding settings and tools later on, only when you need them.

- Run Local

    ```shell
    make run-local
    ```

- Access the CAP Srv at <http://localhost:4004>
- Terminate the local running app with `^C`

## Add Hana cloud

- Add Hana for production deployment

    ```shell
    make add-hana
    ```

## Build Docker images

- Build and push the Hana deployer image

    ```shell
    make build-hana-deployer
    make push-hana-deployer
    ```

- Build and push the CAP Srv image

    ```shell
    make build-cap-srv
    make push-cap-srv
    ```

## Deploy to Kyma runtime

### Create Helm chart

`cds` can intelligently inspect what all is defined in your cap application and generate the necessary configurations (Helm charts) to deploy it on Kyma runtime.

- Create Helm chart

    ```shell
    make create-helm-chart
    ```

Now take a moment to understand the generated Helm chart in the [chart](./chart) directory.

![helm-chart](assets/helm-chart.png)

- [bookshop/chart/Chart.yaml](bookshop/chart/Chart.yaml) contains the details about the chart and all its dependencies.
- [bookshop/chart/values.yaml](bookshop/chart/values.yaml) contains all the details to configure the chart deployment. You will notice that it has sections for `hana deployer`, `cap application` as well as required `service instances` and `service bindings`

### Deploy helm chart

- Check the make command by running

    ```shell
    make deploy-dry-run --just-print
    ```

You will notice that we are overriding a various properties defined in `chart/values.yaml`. This is standard helm feature where you can override your values by specifying them in the command line. This obviates the need to modify the `values.yaml` file. Of course, you can also update the `values.yaml` directly.

- Run the command to do a dry run

    ```shell
    make deploy-dry-run
    ```

Take some time to understand what all will be deployed and how does the configuration looks like.
It is interesting to notice that all these deployment configurations are auto-generated via cds.

**This ensures that you as a developer does not need work with the complexities of helm charts and configurations. At the same time, these pre-shipped charts follow the best practices when it comes to deploying on Kyma.**

- You can now proceed to do the actual deployment
  
    ```shell
    make deploy
    ```

### Verify your deployment

- Check the hana deployer logs

    ```shell
    kubectl logs -l app.kubernetes.io/name= hana-deployer
    ```

- Check the logs for the CAP application

    ```shell
    kubectl logs -l app.kubernetes.io/name= srv
    ```

- Access the application at the displayed URL after deploy. It will be of the form <https://cap-bookshop-srv-{your-kyma-namespace}.{your-kyma-cluster-domain}>

### Cleanup

```shell
make undeploy
```

This will delete the helm chart. Thereby all deployed applications, service instances and their bindings will be cleaned.
