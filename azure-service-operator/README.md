# Overview

With Kyma 2.0, customers will get full access to the underlying Kubernetes cluster. This implies they can deploy CRDs and operators.

Another significant change is the possibility to use operators offered by hyperscalers such as Azure, AWS and GCP to consume their services.

This is the recommended way forward as the Brokers previously used have been deprecated by hyperscalers in favor of operators.

Various operators are available on <https://operatorhub.io/>.

We will look at one example of deploying the [Azure service operator](https://operatorhub.io/operator/azure-service-operator) on Kyma runtime.

Then we will use the deployed operator to provision Azure Redis Cache and use it in a Kyma function.

> Here Azure Redis cache is used for the sake of simplicity. You can use the operator to provision any of the available services on the list.

## Prerequisites

This tutorial requires the following prerequisites:

* [Docker and Kubernetes](../prerequisites#kubernetes)
* [A Kyma runtime](../prerequisites/#kyma)
* An Azure Subscription along with Service Principal.

## Deploy the operator

* Create the namespaces for Operator Lifecycle management and deploying the operators themselves.

    ```shell
    kubectl create ns olm
    kubectl label namespaces olm istio-injection=disabled --overwrite

    kubectl create ns operators
    kubectl label namespaces operators istio-injection=disabled --overwrite
    ```

* Install the operator lifecycle manager. Here I am installing the latest available version at the time of writing this sample. You can use a newer version if available. Refer to [install section](https://operatorhub.io/operator/azure-service-operator)

    ```shell
    curl -sL https://github.com/operator-framework/operator-lifecycle-manager/releases/download/v0.20.0/install.sh | bash -s v0.20.0
    ```

* Create a Secret that contains your Azure subscription details. It is required so that the operator can provision/manage Azure Services.

    ```shell
    kubectl -n operators create secret generic azureoperatorsettings \
    --from-literal=AZURE_TENANT_ID={provide-your-azure-tenant-id} \
    --from-literal=AZURE_SUBSCRIPTION_ID={provide-your-azure-subscription} \
    --from-literal=AZURE_CLIENT_ID={provide-your-azure-client-id} 
    --from-literal=AZURE_CLIENT_SECRET={provide-your-azure-client-secret} \
    --from-literal=AZURE_CLOUD_ENV=AzurePublicCloud
    ```

* Deploy the operator

    ```shell
    kubectl create -f https://operatorhub.io/install/azure-service-operator.yaml
    ```

* Check the status

    ```shell
    kubectl get csv -n operators
    ```

## Provision an Azure redis cache

* Update the [redis-cache.yaml](./k8s/redis-cache.yaml). Replace `{provide-a-name}` with a unique name of your choice. Take a moment to check out the file. It creates an Azure resource group and then an Azure redis cache in that resource group. You can check out further details about the parameters specified [here](https://github.com/Azure/azure-service-operator/blob/main/docs/v1/services/rediscache/rediscache.md).

* Create a namespace. Here we will deploy the function.

    ```shell
    kubectl create namespace dev
    kubectl label namespaces dev istio-injection=enabled
    ```

* Deploy the specification to request provisioning a resource group and redis cache.

    ```shell
    kubectl -n dev apply -f k8s/redis-cache.yaml
    ```

* Check the status

    ```shell
    kubectl -n dev get rediscache
    ```

    >Note: The provisioning can take a while depending upon how long does Azure takes to create the actual instance.

    Once provisioned, you should see a result similar to below.

    ```shell
    NAME                 PROVISIONED   MESSAGE
    my-test-cache        true          successfully provisioned
    ```

## Use the Service

Once provisioned, the credentials to access the Azure redis cache are available in a Kubernetes Secret in `dev` namespace.

The secret name will be `rediscache-{your-provided-name}`

We will deploy a Kyma function which will connect to the Azure redis cache. The Kyma function will be deployed [using Git repository](https://kyma-project.io/docs/kyma/latest/03-tutorials/00-serverless/svls-02-create-git-function/)

* Create a Service Entry for accessing redis cache on Azure. Replace `{your-provided-name}` with the name specified when creating the azure redis cache.

    ```shell
    kubectl -n dev apply -f k8s/service-entry.yaml
    ```

* Update the [my-function.yaml](./k8s/my-function.yaml). Replace `{your-provided-name}` with the name specified when creating the azure redis cache.

* Create the function

    ```shell
    kubectl -n dev apply -f k8s/my-function.yaml
    ```

* Ensure the pods are running

    ```shell
    kubectl -n dev get po
    ```

* To test lets expose the function via APIRule

    ```shell
    kubectl -n dev apply -f k8s/api-rule.yaml
    ```

* Add an entry via HTTP POST Request. This will be stored in Azure redis cache.

    ```shell
    curl -X POST -d '{"id" : "100", "description" : "100"}' -H 'Content-Type: application/json' https://use-azure-redis-cache.{your-cluster-domain}
    ```

* Retrieve the entry

```shell
curl https://use-azure-redis-cache.{your-cluster-domain}/100
```
