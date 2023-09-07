# Overview

Many a time, customers would like to innovate by building applications and deploying them on Kyma runtime. Since Kyma is based on Kubernetes, they must package their application binaries as Docker images. These images then need to be stored on a Docker registry server.

The customers have the option to use a third-party Docker registry hosted on public clouds such as:

- Google Artifact Registry
- Azure Container Registry
- AWS Elastic Container Registry
- and other vendor offerings

Although this is a reliable option, customers do not wish to store their artifacts on public clouds. This could be due to various reasons, such as:

- Security and compliance requirements that prohibit storing artifacts on public clouds
- Customers wishing to use the bundled on-premise Docker registry licenses with their source versioning offerings.
- Customers who do not wish to set up contract with public cloud vendor.
- other reasons...

These customers can consider leveraging a Docker registry running on-premise. Docker images are pulled then by connecting the Kubernetes cluster to the registry using connectivity proxy and Cloud Connector.

See the following sample flow of how this can be achieved

![flow](assets/on-prem-docker-reg.png)

Here, nginx as a reverse proxy is used to forward the HTTP requests for pulling Docker images from the on-premise Docker registry using connectivity proxy and Cloud Connector.

>**NOTE:** In this sample, nginx as a reverse proxy is used to pull the images from an on-premise Docker registry. The setup relies on the Docker registry API v2 and proves the concept. This can be replaced with another reverse proxy or a custom implementation based on API and requirements.

## Prerequisites

- [SAP BTP, Kyma runtime instance](../prerequisites/#kyma)
- [Docker](../prerequisites/#docker)
- [GNU Make](https://www.gnu.org/software/make/)
- [Kubernetes tooling](../prerequisites/#kubernetes)
- [Cloud Connector on your machine or test system](../prerequisites/#sap-cloud-connector)
- [Connectivity Proxy instance configured in Kyma](https://help.sap.com/docs/btp/sap-business-technology-platform/configure-sap-btp-connectivity-in-kyma-environment)
- [OpenSSL](https://www.openssl.org/) or another similar tool to generate the certificates
- [htpasswd](https://httpd.apache.org/docs/2.4/programs/htpasswd.html) installed

## Setup

The commands have been verified on OSX. However, it should be possible to adapt them for a windows laptop.

### Environment variables

- Export the following environment variables:

```shell
export KUBECONFIG=<path-to-kubeconfig>
export NAMESPACE={kyma-namespace-used-for-this-sample}
export CLUSTER_DOMAIN={kyma-cluster-domain}
export REG_USER_NAME={docker-registry-user}
export REG_USER_PASSWD={docker-registry-password}
export EMAIL={your-email}
```

### On-premise Docker registry

In this sample, we set up a simple Docker registry running on your machine. This can be replaced with a productive alternate deployed in your corporate network. The only requirement is that it should be reachable using Cloud Connector.

- Generate the self-signed certificate for enabling HTTPS for the Docker registry. Be sure to specify the `CN` as `myregistry.kyma`

```shell
make generate-self-signed-cert
```

- Add the newly created certificate to your trust storage

```shell
make trust-self-signed-cert
```

- Generate the `htpasswd`. This is used for accessing the on-premise Docker registry.

```shell
make generate-htpasswd
```

- Start the Docker registry server

```shell
make start-docker-registry
```

- Add DNS entry to the `/etc/hosts` file

```shell
127.0.0.1 myregistry.kyma
```

- Configure Cloud Connector to access the on-premise Docker registry.
  ![cc-config](assets/cc-config.png)

## nginx as reverse proxy

We use Nginx as a reverse proxy to forward the HTTP requests for pulling Docker images from the on-premise Docker registry using connectivity proxy and Cloud Connector.

It is exposed as the `NodePort` service. This exposes the Service on the Kubernetes worker node on a port. Kubelet is a component running on each Kubernetes worker node. Among other tasks, it is responsible for pulling the Docker images.

When creating a deployment, we specify the Docker registry as `localhost:{NodePort}`. This is the address of the nginx reverse proxy. The nginx reverse proxy then forwards the call to the on-premise Docker registry using connectivity proxy and Cloud Connector.

This sample shows a simple configuration with nginx as a reverse proxy. You can use any other reverse proxy implementation based on your on-premise Docker registry behavior and APIs.

- Create namespace and enable istio sidecar injection if not done earlier.

```shell
kubectl create namespace ${NAMESPACE}
kubectl label namespace ${NAMESPACE} istio-injection=enabled
```

- Deploy the nginx as a reverse proxy. The following components will be deployed:
  - [ConfigMap](./k8s/configmap.yaml) for nginx configuration
  - [Deployment and Service](./k8s/deployment.yaml)
  - [PeerAuthentication](./k8s/peer-authentication.yaml) set to `PERMISSIVE` to allow for communication between kubelet and the nginx reverse proxy.

```shell
make deploy-nginx-reverse-proxy
```

- Wait for the nginx reverse proxy to be up and running

```shell
make check-nginx-reverse-proxy
```

- Export NodePort for the nginx reverse proxy as an environment variable

```shell
export NGINX_NODE_PORT=$(kubectl get svc nginx -o jsonpath='{.spec.ports[0].nodePort}')
```

## Test workload

Let's deploy a sample workload that will use an image from the on-premise Docker registry.

- Log in to the created on-premise docker registry

```shell
make docker-login
```

- Create and store a sample Docker image in the on-premise Docker registry. It uses an image tag based on the current time.

```shell
make create-test-image
```

- Update the [deployment.yaml for test workload](./test-image-deployment/deployment.yaml).
  - Replace `{nginx-reverse-proxy-node-port}` with the `NGINX_NODE_PORT` value.
  - Replace `{generate-image-tag}` with the tag of the generated image.

- Create Kubernetes Secret with credentials to pull the Docker image.

```shell
make create-secret-to-pull-image
```

- Deploy the test workload. Notice that in the [deployment file](./test-image-deployment/deployment.yaml), the image is specified as `localhost:30930/....`. This is the localhost wrt to the Kubernetes worker node, and the port is the NodePort of the nginx reverse proxy service.

```shell
make deploy-test-workload
```

- Wait until the Pod is up and running. Check the status using the following command:

```shell
make check-test-workload
```

- Once the Pod is up and running, you can access the application

```shell
make access-test-workload
```

## Cleanup

- Remove the test workload, the nginx reverse proxy, and the local Docker registry

```shell
make cleanup
```

- Remove the entry from Cloud Connector.

## Takeaways

- It is possible to have a setup to pull Docker images from the on-premise Docker registry for applications deployed on SAP BTP, Kyma runtime
- Docker images are pulled using connectivity proxy and Cloud Connector.
- The reverse proxy component must be installed from the customer side. This will adapt and forward the requests to the on-premise Docker registry using connectivity proxy.
- The reverse proxy can be an off-the-shelf component such as nginx or a custom implementation depending upon what APIs and behavior are supported by the on-premise Docker registry.