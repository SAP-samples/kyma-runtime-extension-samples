# Setup SAP Event Mesh as your eventing backend for Kyma Runtime

## Setup steps

### 1. Add the required entitlements to your SAP BTP subaccount

1. In your BTP subaccount, select `Entitlements` -> `Configure Entitlements`.

   ![Configure Entitlements](../assets/setup-step-6/1.png)

2. Select `Add Service Plans`.

   ![Add Service Plans](../assets/setup-step-6/2.png)

3. Search for `Event Mesh`. Then, select its `default` and `standard (Application)` plans and select `Add 2 Service Plans`.

   ![Add Service Plans](../assets/setup-step-6/3.png)

4. Save your changes by selecting `Save`.

   ![Save your changes](../assets/setup-step-6/4.png)

### 2. Create an instance of SAP Event Mesh service in your Kyma Runtime (default plan)

1. Go to your Kyma workspace and select `Namespaces`. Then, select your namespace. For example, select the `cdc` namespace.

   ![Select your namespace](../assets/setup-step-6/5.png)

2. Select `Service Management` -> `BTP Service Instances` and select `Create Service Instance +`.

   ![Create service instance](../assets/setup-step-6/6.png)

3. Enter the name of the instance as `enterprise-messaging-client-1`, the `Offering Name` as `enterprise-messaging`, the `Plan Name` as `default`. Then, select the YAML tab.

   ![Create service instance](../assets/setup-step-6/7.png)

4. Within the YAML tab, add the parameters listed in the next step.

   ![Create service instance](../assets/setup-step-6/8.png)

5. Copy and paste the following JSON code snippet into the parameters field.

   ```shell
   {
      "options": {
         "management": true,
         "messagingrest": true,
         "messaging": true
      },
      "rules": {
         "topicRules": {
               "publishFilter": [
                  "${namespace}/*"
               ],
               "subscribeFilter": [
                  "${namespace}/*"
               ]
         },
         "queueRules": {
               "publishFilter": [
                  "${namespace}/*"
               ],
               "subscribeFilter": [
                  "${namespace}/*"
               ]
         }
      },
      "version": "1.1.0",
      "emname": "enterprise-messaging-client-1",
      "namespace": "default/sap.kyma.custom/cdc.1"
   }
   ```

6. Review the JSON code snippet to ensure that the value of `emname` is the same as the instance name. Then, select Create.

   ![Create service instance](../assets/setup-step-6/9.png)

7. Wait for the status of the service instance to change to `PROVISIONED`. Then, select `Service Management` -> `BTP Service Bindings` and select `Create Service Binding +`.

   ![Create binding](../assets/setup-step-6/10.png)

8. For `Name` enter `enterprise-messaging-client-1-binding` and for `Service Instance Name`, select `enterprise-messaging-client-1`. Then, select `Create`.

   ![Create binding](../assets/setup-step-6/11.png)

### 3. Switch the default eventing of Kyma Runtime from NATS to SAP Event Mesh

1. After the previous step, wait for the status of the service instance binding to change to `PROVISIONED`. Then, select the service binding. For example, `enterprise-messaging-client-1-binding`.

   ![Create binding](../assets/setup-step-6/12.png)

2. Select the secret.

   ![Create binding](../assets/setup-step-6/13.png)

3. Select `Edit` to edit the secret.

   ![Create binding](../assets/setup-step-6/14.png)

4. Select the `YAML` tab.

   ![Create binding](../assets/setup-step-6/15.png)

5. Enter the following YAML code snippet to add the `kyma-project.io/eventing-backend: beb` label to the Secret. Then, select `Update`.

   ```shell
   labels:
     kyma-project.io/eventing-backend: beb
   ```

   ![Create binding](../assets/setup-step-6/16.png)

## Optional steps to setup SAP Event Mesh Enterprise Messaging application in your SAP BTP cockpit

> **Note:** The following steps are optional and allow you to view, manage and monitor the SAP Event Mesh Enterprise Messaging application within your SAP BTP cockpit.

## 1. Create a subscription for SAP Event Mesh service in your SAP BTP account (standard plan)

1. Within your BTP subaccount, go to **Services** > **Service Marketplace**, search for **Event Mesh** and click **Create**.

   ![Create Event Mesh instance](../assets/setup-step-6/17.png)

2. Select the **standard** plan and click **create**.

   ![Create Event Mesh instance](../assets/setup-step-6/18.png)

## 2. Assign the required Role Collections to the admin user

1. Assign the required Role Collections to the admin user. In your BTP subaccount, select `Security` -> `Users`. Search for your user. Then, select the right arrow below the `Actions' column.

   ![Select Actions](../assets/setup-step-6/19.png)

2. Scroll down and click on the three dots below `Role Collections`. Then select `Assign Role Collection`.

   ![Select Actions](../assets/setup-step-6/20.png)

3. Select all the following options and select `Assign Role Collection`.

   * Enterprise Messaging Administrator
   * Enterprise Messaging Developer
   * Enterprise Messaging Display
   * Enterprise Messaging Subscription Administrator
   * Event Mesh Integration Administrator

   ![Select Actions](../assets/setup-step-6/21.png)

## 3. Navigate to the SAP Event Mesh Enterprise Messaging application

1. Go to `Services` -> `Instances and Subscriptions` and select the `Event Mesh` application.

   ![Select Actions](../assets/setup-step-6/22.png)

2. Select `kyma-enterprise-messaging-client`.

   ![Select Actions](../assets/setup-step-6/23.png)

3. Navigate through the various tabs and explore the user interface of the SAP Event Mesh Enterprise Messaging application.

   ![Select Actions](../assets/setup-step-6/24.png)

## Refer to the following documentation page for more information :arrow_lower_right&#58;

### [Use Kyma Eventing with SAP Event Mesh](https://help.sap.com/products/BTP/65de2977205c403bbc107264b8eccf4b/407d1266017f4b529b61665fa7408c41.html)

## Navigation

| [:house:](../../README.md) | :arrow_backward: [Setup : Step 6 - Apply the Webhook Event Subscription](step-6.md) | :arrow_forward: [Verification : Step 1 - Verify that all the resources of the app are running](../verification/step-1.md) |
| -------------------------- | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
