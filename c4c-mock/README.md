
# Cloud for Customer Mock

This application emulates SAP Cloud for Customer. It uses the **varkes-api-server** to connect to a `SAP Business Technology Platform, Kyma Runtime` and register the bundled ODATA APIs which are also mocked using the  **varkes-odata-mock**. For the list of mocked APIs, see [`varkes_config.json`](varkes_config.json).

## Run locally using Docker

To run the mock locally, run:

```bash
docker run -p 10000:10000 \
  --restart=always \
  --name c4c-mock \
  ghcr.io/sap-samples/xf-application-mocks/c4c-mock:latest
```

### Access the mock locally

* For the mock UI, see `http://localhost:10000`
* For the API used to to pair the mock, see `http://localhost:10000/console`
* For mocked APIs, see:
  * `http://localhost:10000/sap/c4c/odata/v1/c4codataapi/console`
  * `http://localhost:10000/sap/c4c/odata/v1/c4codataapi/`

## Run mock using `SAP Business Technology Platform, Kyma Runtime`

To run the mock using `SAP Business Technology Platform, Kyma Runtime`, perform the following steps:

1. Set up a Namespace:

```bash
kubectl create namespace mocks
```

2. Deploy the mock

```bash
kubectl apply -f https://raw.githubusercontent.com/SAP/xf-application-mocks/main/c4c-mock/deployment/k8s.yaml -n mocks
kubectl apply -f https://raw.githubusercontent.com/SAP/xf-application-mocks/main/c4c-mock/deployment/kyma.yaml -n mocks
```

These commands expose the UI and API of the mock via an `API` resource and makes the UI accessible at: `https://c4c.{yourDomain}`

## Run mock on Kubernetes

1. Set up the Namespace:

```bash
kubectl create namespace mocks
```

2. Deploy the mock:

```bash
kubectl apply -f https://raw.githubusercontent.com/SAP/xf-application-mocks/main/c4c-mock/deployment/k8s.yaml -n mocks
```

This command deploys a `Service` of a ClusterIP type. You need to expose it manually using any Ingress type.

## Development

Use `npm` to build and run the mock locally for development:

```bash
npm install
npm start
```

This starts the mock locally on port 10000.
To enable the debug mode, set the **{DEBUG}** environment variable to `true`.

To run the test, execute:

```bash
npm test
```
