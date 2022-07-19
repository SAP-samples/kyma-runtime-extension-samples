# Cloud Events handling

## Overview

This sample demonstrates how to subscribe Kyma Functions to the Cloud Events from SAP Event Mesh. It is based on the [ce-coffee](https://github.com/SAP-archive/cloud-function-nodejs-samples/tree/master/examples/ce-coffee) SAP FaaS Runtime example, and it's purpose is to show how to migrate similar use cases from deprecated SAP FaaS Runtime into Kyma runtime.


## Additional prerequisites

Besides the prerequisites described in the parent folder, you must have access to an SAP BTP Event Mesh instance. Put the EMS instance data into the `sap-ems.env` file.


## Steps

### Inspect the Function files

Go to the `cloud-events/ce-coffee` folder and inspect the code (`handler.js`), dependencies (`package.json`) and the Function configuration file, which manifests the features of the Function (`config.yaml`) - in this case, the subscriptions to 3 types of Cloud Events.

> **NOTE:** the `eventType` property must start with the `sap.kyma.custom` prefix and be followed by at least 4 comma-separated sections (7 in total).

### Enable SAP EMS as Eventing backend

Create a Secret containing your EMS instance credentials.

```shell
kubectl create secret generic my-ems-instance --from-env-file=./sap-ems.env
```

Label the Secret so that Kyma Eventing can look it up and apply configuration.

```shell
kubectl label secret my-ems-instance kyma-project.io/eventing-backend=beb
```

> **NOTE:** For more information on how to enable EMS eventing in Kyma runtime, see the following [documentation](https://help.sap.com/docs/BTP/65de2977205c403bbc107264b8eccf4b/407d1266017f4b529b61665fa7408c41.html?version=Cloud).



### Deploy the Function using Kyma CLI

> **NOTE:** If you prefer to deploy the scenario using kubectl CLI, use the attached `ce-coffee-resources.yaml` with the `kubectl apply` command and skip to the testing part.


Run the following command to deploy the Function:

```shell
$ kyma apply function
```

To verify if the Function was built run:

```shell
$ kubectl get functions   
NAME              CONFIGURED   BUILT   RUNNING   RUNTIME    VERSION   AGE
ce-coffee         True         True    True      nodejs14   1         36s
```

To verify your subscription run:

```bash
$ kubectl get subscriptions
NAME        READY   AGE   CLEAN EVENT TYPES
ce-coffee   true    64s   ["sap.kyma.custom.commerce.coffee.required.v1","sap.kyma.custom.commerce.coffee.produced.v1","sap.kyma.custom.commerce.coffee.consumed.v1"]
```


### Test the setup

- port forward `eventing-publisher-proxy`

```bash
kubectl port-forward -n kyma-system pod/$(kubectl get pod -n kyma-system -l app.kubernetes.io/name=eventing-publisher-proxy -ojsonpath="{.items[].metadata.name}") 8080:8080
```

- send Cloud Event message; make sure that the source and type have valid values

```bash
curl -v -X POST \
    -H "Content-Type: application/cloudevents+json" \
    --data '
    {
        "specversion": "1.0",
        "source": "/default/sap.kyma/faas-ems-test",
        "type": "sap.kyma.custom.commerce.coffee.required.v1",
        "eventtypeversion": "v1",
        "id": "A234-1234-1234",
        "data" : "{\"foo\":\"bar\"}",
        "datacontenttype":"application/json"
    }' http://localhost:8080/publish
```
