# Kyma Serverless samples migrated from matching SAP BTP FaaS Runtime examples

## Overview

This folder contains samples that help you migrate most common scenarios from deprecated SAP FaaS Runtime Functions to Kyma runtime.
The samples aim to cover the migration of common use cases, described by the selected [FaaS Functions examples](https://github.com/SAP-archive/cloud-function-nodejs-samples/tree/master/examples).

## Scenarios

 - [qrcode-producer](./expose-via-http/) - Demonstrating how to expose Kyma Function using HTTP.
 - [s3uploader](./secret-handling/) - Demonstrating how to use Kubernetes Config Maps and Secrets to consume configuration necessary, for example, to access 3rd party service.
 - [ce-coffee](./cloud-events/) - Demonstrating how to send and consume cloud events from SAP BTP Event Mesh in Kyma Functions.
 - [hello-timer](./time-based-trigger/) - Demonstrating how to model a time-based trigger for Kyma Function using Kubernetes Cron Job.

## Prerequisites

All the samples have the following common prerequisites:

- SAP BTP, Kyma runtime instance
- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) configured to use the `KUBECONFIG` file downloaded from Kyma runtime
- [kyma CLI](https://github.com/kyma-project/cli)

Individual samples may have additional prerequisites as they are based on services outside of Kyma runtime.