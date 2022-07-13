# Kyma Serverless samples migrated from matching SAP BTP FaaS Runtime examples

## Overview

This folder contains samples that will help you migrate most common scenarios from deprecated SAP FaaS Runtime Functions to Kyma runtime.
The samples aim to cover the migration of some common usecases described by the selected [FaaS Functions examples](https://github.com/SAP-archive/cloud-function-nodejs-samples/tree/master/examples)

## Scenarios

 - [qrcode-producer](./expose-via-http/) - Demonstrating how to expose kyma Function via HTTP
 - [s3uploader](./secret-handling/) - Demonstrating how to use k8s confg maps and secrets to consume configuration necessary i.e to access 3rd party service
 - [ce-coffee](./cloud-events/) - Demonstrating how to send and consume cloud events from SAP BTP Event Mesh in kyma Functions
 - [hello-timer](./time-based-trigger/) - Demonstrating how to model a time based trigger for a kyma Function using a k8s CronJob

## Prerequisites

All the samples have those common prerequisites. 

- SAP BTP, Kyma runtime instance
- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) configured to use the `KUBECONFIG` file downloaded from the Kyma runtime
- [kyma CLI](https://github.com/kyma-project/cli)

Individual samples may have additional prerequisistes as they are based on services outside of kyma runtime.