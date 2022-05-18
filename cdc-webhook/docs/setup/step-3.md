# Step 3 - Deploy a Memcached memory-caching service

A Memcached memory-caching service will be used to cache the `id` of events that are received from SAP Customer Data Cloud to eliminate duplicates and to ensure that events aren't processed more than once.

**Note:** _"Since events may be sent more than once, use the id to check for duplicates. The id for a specific event will always be the same."_ — Source: [SAP Customer Data Cloud documentation for Webhooks](https://help.sap.com/docs/SAP_CUSTOMER_DATA_CLOUD/8b8d6fffe113457094a17701f63e3d6a/417f918270b21014bbc5a10ce4041860.html)

> Read more about Memcached [here](https://memcached.org/).

1. Create a namespace with the name **cdc**.

   ```shell
   kubectl create namespace cdc
   ```

2. Add the Bitnami chart repository.

   ```shell
   helm repo add bitnami https://charts.bitnami.com/bitnami
   ```

3. Download and install bitnami/memcached in the **cdc** namespace. This command will create a Kubernetes **deployment** as well as a **service** with the name `bm-memcached`.

   ```shell
   helm install bm bitnami/memcached --namespace cdc
   ```

## Navigation

| [:house:](../../README.md) | :arrow_backward: [Setup : Step 2 - Create a lite registration screen in SAP Customer Data Cloud](step-2.md) | :arrow_forward: [Setup : Step 4 - Deploy the Webhook endpoint](step-4.md) |
| -------------------------- | --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
