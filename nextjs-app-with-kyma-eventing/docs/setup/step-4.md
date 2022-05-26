# Step 4 - Apply the Event Registration Subscription

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
   kubectl apply -f ./event-subscription/k8s/subscription.yaml
   ```

2. Verify that the subscription has been created in the **conference-registration** namespace.

   ```shell
   kubectl get subscription -n conference-registration
   ```

## Navigation

| [:house:](../../README.md) | :arrow_backward: [Setup : Step 3 - Deploy the Event Consumer function](step-3.md) | :arrow_forward: [Setup : Step 5 - Create an instance of SAP HANA Cloud](step-5.md) |
| -------------------------- | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
