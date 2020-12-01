# Overview

A Helm chart definition to deploy the sample micronaut extension.

## Parameters

| Parameter        | Description                                | Default Value                          |
| ---------------- | ------------------------------------------ | -------------------------------------- |
| image.repository | The docker image                           | gabbi/sample-extension-micronaut:0.0.3 |
| image.pullPolicy | The image pull policy                      | Always                                 |
| jdbc.url         | URL of Database to connect                 | jdbc:h2:mem:testdb                     |
| jdbc.user        | Database username                          | sa                                     |
| jdbc.password    | Database password                          | kyma4ever                              |
| jdbc.driver      | JDBC Driver                                | org.h2.Driver                          |

## To Deploy

### Must Haves

* [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
* [Helm3](https://helm.sh/docs/intro/install/)
* `kubectl` is configured to `KUBECONFIG` downloaded from Kyma Runtime.

### Helm install

To install the helm chart in `dev` namespace, run the following command.

You can provide the various parameters in the install command as shown below. Change to use your image. You can also override other parameters defined in [values.yaml](values.yaml)

```shell script
helm -n dev install kymaapp . --set image.repository=gabbi/sample-extension-micronaut:0.0.3 --set jdbc.user={db user} --set jdbc.password={db password}
```

or,

provide a customized [values.yaml](values.yaml) with parameters configured and run the command

```shell script
helm install kymaapp . -f values.yaml -n dev
```

### Cleanup

```shell script
helm del kymaapp -n dev
```
