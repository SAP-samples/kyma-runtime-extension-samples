# Step 3 - Set up the connectivity proxy

> DSAG Technologietage 2022 Category: 👀

## Goal 🎯

This step covers the setup of the connectivity proxy in your Kyma cluster to enable the access to on premise resources.

## Step 3.1 - Enable the Connectivity Service Entitlement

In order to configure the Connectivity Proxy within the Kyma Runtime you must first make sure that the Connectivity Service Entitlement is present within your subaccount. This can be accomplished by

- Within your global account…
- Choose **Entitlements -> Entity Assignments**
- Search **for Connectivity Service**
- Choose **connectivity_proxy** for the plan
- Choose **Add 1 Service Plan**
- Choose **Save**

## Step 3.2 - Provision the Service in the Kyma Runtime

he next step involves creating a service instance of the Connectivity Proxy and then a service binding. Once the creation of the service binding is detected by the Kyma Control Plane, the Connectivity Proxy will be provisioned in the runtime into the namespace `kyma-system`:

- Within your desired namespace
- Choose **Service Management -> Catalog**
- Search for and select the **Connectivity** tile
- Choose **Add**
- If desired provide a name, otherwise the auto-generated name can be used
- Choose the Plan **connectivity_proxy**
- The option to add parameters can be skipped
- Choose **Create**

After that, create the service binding:

- Within the same namespace
- Choose **Service Management -> Instances**
- Choose the Service Instance created in previous step
- Choose the option **Add Service Binding**
- If desired provide values for the **Name** and **Secret Name**, otherwise the auto-generated values can be used
- Choose **Create**

The Kyma Control Plane should now provision the Connectivity Proxy. This will generate the pod `connectivity-proxy-0` which can be found by running:

```shell
kubectl get pods -n kyma-system
```

> 📝 **Tip** - The provisioning is not a synchronous action. You creation request will be picked up by the Kyma reconciler that runs periodically. It might take 5-10 minutes until you see the pod up and running.

From within the Kyma runtime the proxy will be accessible using the URL `connectivity-proxy.kyma-system.svc.cluster.local:20003`.

## Summary

🎉 Congratulations - You've now completed the setup of the Connectivity Proxy!

Continue to [Step 4 - Set up the SAP Event Mesh](step4.md).

[◀ Previous step](step2.md) | [🔼 Overview](../README.md) | [Next step ▶](step4.md)
