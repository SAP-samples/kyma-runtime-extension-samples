# Overview

Many a time, customers would like to innovate by building applications and deploying them on Kyma runtime. Since Kyma is based on Kubernetes, they must package their application binaries as Docker images. These images then need to be stored on a Docker registry server.

The customers have the option to use a third-party Docker registry hosted on public clouds such as:

- Google Container Registry
- Azure Container Registry
- AWS Elastic Container Registry
- and other vendor offerings

Although this is a reliable option, many a time, customers do not wish to store their artifacts on public clouds. This could be due to various reasons, such as:

- Security and compliance requirements that prohibit storing artifacts on public clouds
- Customers wishing to use the bundled on-premise docker registry licenses with their source versioning offerings.
- Customers who do not wish to set up contract with public cloud vendor.
- others...

For these customers, they can consider leveraging on-premise docker registry. Docker images are pulled then using connectivity proxy and cloud connector.

Below is a sample flow how this can be possibly achieved

![flow](assets/on-prem-docker-reg.png)

Here nginx as a reverse proxy is used to forward the HTTP requests for pulling docker images from on-premise docker registry via connectivity proxy and cloud connector.

>Note: In this sample, nginx as a reverse proxy is used to pull the images from an on-premise docker registry. The setup relies on docker registry API v2 and proves the concept. This can be replaced with another reverse-proxy or a custom implementation based on API and requirements.

## Prerequisites

- [SAP BTP, Kyma runtime instance](../prerequisites/#kyma)
- [Docker](../prerequisites/#docker)
- [make](https://www.gnu.org/software/make/)
- [Kubernetes tooling](../prerequisites/#kubernetes)
- [Cloud Connector on your laptop or test system](../prerequisites/#sap-cloud-connector)
- [OpenSSL](https://www.openssl.org/) or another similiar tool to generate the certificates
- [htpasswd](https://httpd.apache.org/docs/2.4/programs/htpasswd.html) installed

## Setup

### Environment variables

- Export the following environment variables

```shell
export NAMESPACE={kyma-namespace-used-for-this-sample}
export CLUSTER_DOMAIN={kyma-cluster-domain}
export REG_USER_NAME={docker-registry-user}
export REG_USER_PASSWD={docker-registry-password}
export EMAIL={your-email}
```

### On-premise Docker registry

In this sample, we will setup a simple docker registry running on your laptop. This can be replaced with a productive alternate deployed in your corporate network. The only requirement is that it should be reachable via cloud connector.

- Generate the self-signed certificate for enabling HTTPS for docker registry. Be sure to specify the `CN` as `myregistry.kyma`

```shell
make generate-self-signed-cert
```

- Configure trust for the generated self signed certificate

```shell
make trust-self-signed-cert
```

- Generate the `htpasswd`. This will be used for authenticating access to on-premise docker registry.

```shell
make generate-htpasswd
```

- Start the docker registry server

```shell
make start-docker-registry
```

- Add DNS entry to `/etc/hosts` file

```shell
127.0.0.1 myregistry.kyma
```

- Configure cloud connector to access on-premise docker registry.
  ![cc-config](assets/cc-config.png)

## Nginx as reverse proxy

We will be using nginx as a reverse proxy to forward the HTTP requests for pulling docker images from on-premise docker registry via connectivity proxy and cloud connector.

It will be exposed as `NodePort` service. This will expose the Service on the Kubernetes worker node on a port. Kubelet is a component running on each Kubernetes worker node. Among other tasks it is responsible for pulling the docker images.

When creating a deployment, we will specify the docker registry as `localhost:{NodePort}`. This will be the address of the nginx reverse proxy. The nginx reverse proxy will then forward the call to the on-premise docker registry via connectivity proxy and cloud connector.

In this sample, I am using a simple configuration with nginx as a reverse proxy. You are free to use any other reverse proxy implementation based on your on-premise docker registry behavior and APIs.

- Deploy the nginx as a reverse proxy. Following components will be deployed
  - [ConfigMap](./k8s/configmap.yaml) for nginx configuration
  - [Deployment and Service](./k8s/deployment.yaml)
  - [PeerAuthentication](./k8s/peer-authentication.yaml) set to permissive to allow communication between kubelet and nginx reverse proxy.

```shell
make deploy-nginx-reverse-proxy
```

- Wait for the Nginx reverse proxy to be up and running

```shell
make check-nginx-reverse-proxy
```

- Export the NodePort for Nginx reverse proxy as environment variable

```shell
export NGINX_NODE_PORT=$(kubectl get svc nginx -o jsonpath='{.spec.ports[0].nodePort}')
```

## Test workload

Let's deploy a sample workload that will use an image from the on-premise docker registry.

- Do a docker login to the created on-premise docker registry

```shell
make docker-login
```

- Create and store a sample docker image in on-premise docker registry. It uses an image tag based on current time.

```shell
make create-test-image
```

- Update the [deployment.yaml for test workload](./test-image-deployment/deployment.yaml).
  - Replace `{nginx-reverse-proxy-node-port}` with NGINX_NODE_PORT value.
  - Replace `{generate-image-tag}` with the tag of generated image.

- Create Kubernetes secret with credentials to pull the docker image.

```shell
make create-secret-to-pull-image
```

- Deploy the test workload. In the [deployment file](./test-image-deployment/deployment.yaml), you will notice the image is specified as `localhost:30930/....`. This is the localhost wrt to Kubernetes worker node and the port is the NodePort of the nginx reverse proxy service.

```shell
make deploy-test-workload
```

- You can wait until the pod is up and running. Check the status using the command

```shell
make check-test-workload
```

- Once pod is up and running, you can access the application

```shell
make access-test-workload
```

## Cleanup

- Remove the test workload, nginx reverse proxy and local docker registry

```shell
make cleanup
```

- Remove the entry fom the cloud connector.
