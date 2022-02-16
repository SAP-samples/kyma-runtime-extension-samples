# Redis and Kyma Functions

## Overview

This sample provides a Redis deployment and two serverless functions that interact with it. The function `cache-order` is set to subscribe to an `order.created` event provided by the Commerce mock application. Once triggered, the function will perform an API call to the Commerce mock to obtain additional details regarding the order and then cache the information into Redis. The function `get-order`, exposed as an API, is used to then retrieve the order details from the Redis cache.

This sample demonstrates how to:

- Create a development Namespace using the Kyma Console.
- Deployment of Redis using the Kyma Console which includes:
  - A Service to expose Redis to other Kubernetes resources.
  - A Secret containing the Redis password.
- Deployment of the two serverless functions using the Kyma Console.
- Binding of Services to serverless functions.

## Prerequisites

- [Provision Kyma](https://developers.sap.com/tutorials/cp-kyma-getting-started.html)
- [Setup Mock Application](https://developers.sap.com/tutorials/cp-kyma-mocks.html)

## Details

You find detailed steps at [Use Redis in the Kyma Runtime to Store and Retrieve Data](https://developers.sap.com/tutorials/cp-kyma-redis-function.html).
