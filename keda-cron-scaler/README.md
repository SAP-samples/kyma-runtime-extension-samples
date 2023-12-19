# SAP BTP Kyma Runtime: Transitioning to a Modular Architecture with KEDA

SAP Business Technology Platform (BTP) Kyma runtime is undergoing a significant change: it's transitioning to a modular architecture. With the new modular architecture, customers will have the flexibility to pick and choose the component / capabilities they need, reducing unnecessary bloat and complexity. One of the early modules to be introduced in this new structure is KEDA (Kubernetes Event-driven Autoscaling).

## What is KEDA?

[KEDA](https://keda.sh/) is an open-source project that provides event-driven autoscaling for Kubernetes workloads. It was initially created by Microsoft and Red Hat, and now it's a CNCF sandbox project. KEDA focuses on autoscaling applications based on events from various sources, such as Kafka, RabbitMQ, or cloud-specific services like Azure Service Bus and Google Pub/Sub.

## What does KEDA provide?

KEDA brings a new level of flexibility and efficiency to the autoscaling game. It extends Kubernetes to enable fine-grained autoscaling for event-driven workloads. With KEDA, you can scale your deployments from zero to n depending on the number of events they have to process.

## Enabling the KEDA module in SAP BTP Kyma runtime

KEDA can be enabled as any other module by following the official instructions to [enable and disable a module](https://help.sap.com/docs/btp/sap-business-technology-platform/enable-and-disable-kyma-module)

## KEDA Cron-based Scaler

KEDA supports a wide array of scaling strategies. One of them is the cron-based scaler. With this scaler, you can schedule scaling actions based on the time of day. This feature is extremely useful for handling predictable variations in workload.

For example, you can:

- **Handle Peaks in Traffic and Request Volume**: With the cron-based scaler, you can schedule your applications to scale up during peak hours or during high-traffic events like Black Friday and New Year sales. You can also set your applications to scale up during off-hours for batch processing tasks.

- **Optimize Resource Usage and Save Cost**: The cron-based scaler can help you save resources and reduce costs by scheduling your applications to scale down during off-work hours or when the demand is predictably low.