Work In Progress

## Overview

This sample demostrates gRPC connectivity between a gRPC server running in the Kyma runtime and a gRPC client running outside of the Kyma runtime. The sample utilizes the root certificate used by the Kyma runtime to establish a TLS connection between the client and server and verifies the connection with a token. The client app streams auto generated order data to the server and receives back the amount of orders created and the elapsed time. Then will request a stream of existing orders which are displayed within the terminal. Running locally established a insecure connection which is based on an environment varialbe `_DEV_` being set to true. A secure connection is required when running the server app within the Kyma runtime. In this case the variable `_DEV_` most be set to false.

## Prerequisites

- SAP BTP, Kyma runtime instance
- [Docker](https://www.docker.com/)
- [Python](https://www.python.org/)
- [pip](https://pip.pypa.io/en/stable/installing/)
- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) configured to use the `KUBECONFIG` file downloaded from the Kyma runtime.

## Steps

### Run the sample locally

1. Clone the project.

2. Install grpcio-tools:

   ```shell script
   pip install grpcio-tools
   ```

3. Within the sample directory set the environment variable `_DEV_` to true and start the server

   ```shell script
   export _DEV_=true
   python orders-server.py
   ```

4. In another terminal within the sample directory set the environment variable `_DEV_` to true and start the client

   ```shell script
   export _DEV_=true
   python orders-client.py
   ```

### Run the server in Kyma

1. Download the [root certificate](https://www.identrust.com/dst-root-ca-x3) used by Kyma from and save the certificate content as kyma.pem in the directory of the sample.
2. Build and push the image to your Docker repository:

```shell script
  docker build -t {your-docker-account}/grpcorderserver -f docker/Dockerfile .
  docker push {your-docker-account}/grpcorderserver
```

3. Adjust the **image** of the deployment.yaml to reference your docker hub account.
4. Within the deployment.yaml you will find the envirnoment variable **_GRPC_TOKEN_** being set for the image. This is used as an authentication measure and requires that the client sends a matching token in the request.
5. Create a new `grpc` Namespace:

```shell script
kubectl create namespace grpc
```

3. Apply the Resources:

```shell script
kubectl -n grpc apply -f ./k8s/deployment.yaml
kubectl -n grpc apply -f ./k8s/apirule.yaml
```

4. Prepare the client environment by setting the `_DEV_` to false and the `_GRPC_TOKEN_` to match the value set, defaulted to 12345678, on the server within the deployment.yaml as well are the `_GRPC_SERVER_`.

   ```shell script
   export _DEV_="false"
   export _GRPC_TOKEN_="12345678"
   export _GRPC_SERVER_=grpcorderserver.*********.kyma.shoot.live.k8s-hana.ondemand.com:443
   ```

5. Run the client
   ```shell script
   python orders-client.py
   ```

### Other tips...

1. To regenerate the protocol

```shell script
python -m grpc_tools.protoc -I./ --python_out=. --grpc_python_out=. orders.proto
```

2. To regenerate the requirements

```shell script
pip3 freeze > requirements.txt
```
