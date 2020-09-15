# Overview

A Helm chart definition to deploy the sample java extension.

## Parameters

| Parameter        | Description                                | Default Value                         |
| ---------------- | ------------------------------------------ | ------------------------------------- |
| image.repository | The docker image                           | gabbi/sample-extension-java:0.0.7     |
| image.pullPolicy | The image pull policy                      | Always                                |
| cluster.domain   | The domain of the Kyma cluster             | TBA                                   |
| db.user          | Database username                          | TBA                                   |
| db.password      | Database password                          | TBA                                   |


## To Deploy

### Must Haves

* [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
* [Helm3](https://helm.sh/docs/intro/install/)
* `kubectl` is configured to `KUBECONFIG` downloaded from Kyma Runtime.

### Helm install

To install the helm chart in `dev` namespace, run the following command.

You can provide the various parameters in the install command as shown below. Change to use your image.

```shell script
helm install kymaapp ./sample-extension-java --set image.repository=gabbi/sample-extension-java:0.0.7 --set db.user={db user} --set db.password={db password} --set cluster.domain={cluster domain} -n dev
```

or,

provide a [values.yaml](sample-extension-java/values.yaml) with parameters configured and run the command

```shell script
helm install kymaapp ./sample-extension-java -f values.yaml -n dev
```

### Cleanup

```shell script
helm del kymaapp -n dev
```
