# Cloud Events Handling

## Overview

This sample demonstrates how to subscribe kyma Functions to the cloud events from SAP Evnt Mesh. It is based on the [ce-coffee](https://github.com/SAP-archive/cloud-function-nodejs-samples/tree/master/examples/ce-coffee) SAP FaaS Runtime example and it's purpose is to show how to migrate similar usecases from deprecated SAP FaaS Runtime into Kyma runtime.


## Additional Prerequisites

Besides the prerequisistes described in the parent folder, for this sample it is required to have access to an SAP BTP Event Mesh instance. Fill in the ems instance data into the `sap-ems.env` file.


## Steps

### Inspect the Function files

Go to the `cloud-events/ce-coffee` folder and inspect the code (`handler.js`), dependencies (`package.json`) and the Function configuration file which manifests the features of the Function (`config.yaml`) - in this case the subscriptions to 3 types of cloud events.

> **NOTE** the `eventType` property must start with the `sap.kyma.custom` prefix and be followed by at least 4 comma separated sections (7 in total).

### Enable SAP EMS as eventing backend.

Create a secret containing your EMS instance credentails.

```shell
kubectl create secret generic my-ems-instance --from-env-file=./sap-ems.env
```

Label the secret so that kyma eventing can look it up and apply configuration.

```shell
kubectl label secret my-ems-instance kyma-project.io/eventing-backend=beb
```

> **NOTE** For more information on how to enable EMS eventing in kyma runtime please see the following [documentation](https://github.tools.sap/kyma/documentation/blob/master/how-to-guides/switching-eventing-backend.md).



### Deploy the Function using kyma CLI

Run the following command to deploy the Function

```shell
$ kyma apply function
```

Verify if the Function was successfully built.

```shell
$ kubectl get functions   
NAME              CONFIGURED   BUILT   RUNNING   RUNTIME    VERSION   AGE
ce-coffee         True         True    True      nodejs14   1         36s
```

Verify subscription.

```bash
$ kubectl get subscriptions -n ce-coffee
NAME        READY   AGE   CLEAN EVENT TYPES
ce-coffee   true    64s   ["sap.kyma.custom.commerce.coffee.required.v1","sap.kyma.custom.commerce.coffee.produced.v1","sap.kyma.custom.commerce.coffee.consumed.v1"]
```


### Test the setup

- port forward `eventing-publisher-proxy`

```bash
kubectl port-forward -n kyma-system pod/$(kubectl get pod -n kyma-system -l app.kubernetes.io/name=eventing-publisher-proxy -ojsonpath="{.items[].metadata.name}") 8080:8080
```

- send cloud event message; make sure that the source and type have valid values

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
