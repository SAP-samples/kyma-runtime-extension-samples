# Overview

Sample Scala application deployed to a Kyma cluster using GitOps. It is exposed as a Kyma API over internet.

## Developer Flow

* Build & push the docker image

```shell script
make build-image
make push-image
```

* Generate Kubernetes resources to deploy on Kyma and expose API

```shell script
make create-service
make expose-service
```

* Push the changes to the repository

```shell script
git add . && git commit -m "my scala extension" && git push origin master
```

## GitOps

* Flux running inside Kyma cluster will pick up the git commits from the repo and apply it to Kyma cluster.