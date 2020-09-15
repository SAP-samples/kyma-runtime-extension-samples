# Overview

This directory contains various helm chart examples which can be used to deploy and manage Kubernetes resources.  Each chart contains a `values.yaml` which contains the configuration parameters of the chart.

For more information see [helm](https://helm.sh/)

## Prerequisites

- SAP Cloud Platform, Kyma Runtime instance
- [Helm](https://helm.sh/)
- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
- `kubectl` is configured to `KUBECONFIG` downloaded from Kyma Runtime.

## Samples

- [UI5 Frontend MSSQL](./frontend-ui5-mssql/README.md)
- [Golang MSSQL Database API](./api-mssql-go/README.md)
- [MSSQL Database](./database-mssql/README.md)
- [Sample Event Trigger Java](../sample-event-trigger-java/helm/README.md)
- [Sample Extension Java](../sample-extension-java/helm/README.md)
- [Sample Extension .Net](../sample-extension-dotnet/helm/README.md)
