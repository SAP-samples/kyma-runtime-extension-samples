# Step 6 - Apply the Webhook Event Subscription

## Prerequisite step: Select your eventing backend

### Prerequisite Option 1: Use NATS

**NATS** is the default eventing backend of SAP BTP, Kyma Runtime. If you haven't changed your eventing backend to SAP Event Mesh, then there are no additional steps required.

### Prerequisite Option 2: Use SAP Event Mesh

Optionally, use Kyma Eventing with **SAP Event Mesh** (only if you're not using a free tier or free trial BTP account).

   > **Note:** By default, Kyma clusters have an Eventing backend based on **[NATS](https://nats.io/)**. However, it is possible to switch this backend to **[SAP Event Mesh](https://help.sap.com/viewer/product/SAP_EM/Cloud/en-US)** if you're not using a free tier or free trial BTP account.

#### :arrow_right: [Setup SAP Event Mesh as your eventing backend for Kyma Runtime](optional-step.md)

## Apply the Event Registration Subscription

1. Create a Subscription to receive events. The subscription custom resource is used to subscribe to events.

   ```shell
   kubectl apply -f ./webhook-event-subscription/k8s/subscription.yaml
   ```

2. Verify that the subscription has been created in the **cdc** namespace.

   ```shell
   kubectl get subscription -n cdc
   ```

## Navigation

| [:house:](../../README.md) | :arrow_backward: [Setup : Step 5 - Deploy the Event Consumer Serverless Function](step-5.md) | :arrow_forward: [Verification : Step 1 - Verify that all the resources of the app are running](../verification/step-1.md) |
| -------------------------- | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
