# Overview

A Helm chart definition to deploy the sample event tigger.

## Parameters

| Parameter         | Description                                | Default Value                         |
| ----------------  | ------------------------------------------ | ------------------------------------- |
| image.repository  | The docker image                           | gabbi/sample-event-trigger-java:0.0.2 |
| image.pullPolicy  | The image pull policy                      | Always                                |
| subscription.application    | The connected system which will send event | TBA                                   |
| subscription.eventType | The event type which will trigger the app  | TBA                                   |

## To Deploy

### Must Haves

* [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
* [Helm3](https://helm.sh/docs/intro/install/)
* `kubectl` is configured to `KUBECONFIG` downloaded from Kyma Runtime.

### Helm install

To install the helm chart in `dev` namespace, run the following command.

You can provide the various parameters in the install command as shown below.

```shell script
helm install kymaapp . --set image.repository=gabbi/sample-event-trigger-java:0.0.2 --set subscription.application=mp-mock-commerce-2 --set subscription.eventType=order.created -n dev
```

or,

provide a [values.yaml](./values.yaml) with parameters configured and run the command

```shell script
helm install kymaapp . -f values.yaml -n dev
```

### Cleanup

```shell script
helm del kymaapp -n dev
```
