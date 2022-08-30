# Create a Kubernetes Secret from a Cloud Foundry Service Key

There are some reasons why you want to access a service instance created from Cloud Foundry from Kyma:
- There are some services that do not allow creation from Kubernetes/Kyma, for example SAP HANA Cloud and Workflow.
- You want to try out your Kyma application with an existing Cloud Foundry service instance.
- ...

This sample shows how to create a Kubernetes secret from a Cloud Foundry service key, that can be used by any application that can consume [servicebinding.io and SAP BTP Service Operator service bindings](https://blogs.sap.com/2022/07/12/the-new-way-to-consume-service-bindings-on-kyma-runtime/).

## Usage

```
node create-k8s-secret-from-cf-service-key.js CF-SERVICE-INSTANCE-NAME [CF-SERVICE-KEY-NAME]
```

## Example Usage

```
cf create-service hana hdi-shared my-hdi-container
cf create-service-key my-hdi-container my-hdi-key
node create-k8s-secret-from-cf-service-key.js my-hdi-container my-hdi-key | kubectl apply -f -
```

This creates a secret from the credentials of the HDI container service key.

## Details

A secret property needs to be created for each top-level property of the service key. Non-string properties, such as arrays, objects, integers or booleans are serialized as JSON.

Additionally the secret contains properties for `tags`, `label`, `type` (same as `label`), `plan`, `instance_name` and `instance_guid`. These properties may be used by applications to find the desired service instance.

The `.metadata` property contains a JSON string that describes the credential properties (`credentialProperties`) and the properties that describe the service (`metaDataProperties`).

You can find more information in the blog post [The new way to consume Service Bindings on Kyma Runtime
](https://blogs.sap.com/2022/07/12/the-new-way-to-consume-service-bindings-on-kyma-runtime/).