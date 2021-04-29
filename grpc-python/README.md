Work In Progress

## Overview

This sample demostrates gRPC connectivity between a gRPC server running in the Kyma runtime and a gRPC client running outside of the Kyma runtime. The sample utilizes the root certificate used by the Kyma runtime to establish a TLS connection between the client and server and verifies the connection with a token.

## Prerequisites

- SAP BTP, Kyma runtime instance
- [Docker](https://www.docker.com/)
- [Python](https://www.python.org/)
- [pip](https://pip.pypa.io/en/stable/installing/)
- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) configured to use the `KUBECONFIG` file downloaded from the Kyma runtime.

## Steps

### Run the sammple locally

1. Clone the project.

2. Inside the directory, run:

   ```shell script
   pip install grpcio-tools
   ```

3. For running locally the environment variable **_DEV_** needs to be set to true.

   ```shell script
   export _DEV_="true"
   ```

4. Run the server

   ```shell script
    python orders-server.py
   ```

5. In another terminal run the client
   ```shell script
   python orders-client.py
   ```

### Run the server in Kyma

1. Download the [root certificate](https://www.identrust.com/dst-root-ca-x3) used by Kyma from and save the certificate content as kyma.pem in the directory of the sample.
2. Build and push the image to your Docker repository:

```shell script
  docker build -t {your-docker-account}/grpcorderserver -f docker/Dockerfile .
  docker push {your-docker-account}/grpcorderserver
```

3. Adjust the **imaage** of the deployment.yaml to reference your docker hub account.
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

4. Prepare local environment by setting the **_DEV_** to false and the **_GRPC_TOKEN_** to match the value set on the server within the deployment.yaml

   ```shell script
   export _DEV_="false"
   export _GRPC_TOKEN_="12345678"
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
