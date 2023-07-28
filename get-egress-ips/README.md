# Overview

This sample contains utility script to get the Egress IPs of SAP BTP Kyma Runtime cluster. Kyma cluster is deployed in a minimal of 3 availability zones.

You might need Egress IPs for various whitelisting configurations when connecting to backing or DB Services such as SAP HANA Cloud, PostgreSQL on SAP BTP, hyperscaler option or any other third-party service which requires whitelisting.

The script intelligently runs the curl pod in each of the different availability zones to get the Egress IPs.

## Prerequisites

- [SAP BTP, Kyma runtime instance](../prerequisites#kyma)
- [Kubernetes tooling](../prerequisites#kubernetes)

## To run

- On MacOS or Linux, run the following command

```shell
./get-egress-ips.sh
```
