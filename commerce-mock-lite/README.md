# Light Commerce Mock

The light commerce mock emulates SAP Commerce Cloud on base of a reduced event and API catalog. It uses the **varkes-api-server** to connect to `SAP Business Technology Platform, Kyma Runtime` and register the bundled commerce APIs, which are also mocked using the **varkes-openapi-mock**. For the list of mocked APIs, see [`varkes_config.json`](varkes_config.json).

## Run locally using Docker

To run the mock locally, run:

```bash
docker run -d \
  -p 10000:10000 \
  --restart=always \
  --name commerce-mock-lite \
  ghcr.io/sap-samples/xf-application-mocks/commerce-mock-lite:latest
```

### Access the mock locally

* For the API to pair the mock, see `http://localhost:10000/console`
* For mocked APIs, see:
  * `http://localhost:10000/rest/v2/console`
  * `http://localhost:10000/assistedservicewebservices/console`
  * `http://localhost:10000/ordermanagementwebservices/console`
  * `http://localhost:10000/couponwebservices/console`
  * `http://localhost:10000/warehousingwebservices/console`

## Run mock using `SAP Business Technology Platform, Kyma Runtime`

To run the mock using `SAP Business Technology Platform, Kyma Runtime` as a runtime environment, perform the following steps:

1. Set up the Namespace:

```bash
kubectl create namespace mocks
```

2. Deploy the mock:

```bash
kubectl apply -f https://raw.githubusercontent.com/SAP/xf-application-mocks/main/commerce-mock-lite/deployment/k8s.yaml -n mocks
kubectl apply -f https://raw.githubusercontent.com/SAP/xf-application-mocks/main/commerce-mock-lite/deployment/kyma.yaml -n mocks
```

These commands expose the API of the mock via an `APIRule` resource and makes it accessible at `https://commerce-lite.{yourDomain}`.

## Run mock on Kubernetes

1. Set up the Namespace:

```bash
kubectl create namespace mocks
```

2. Deploy the mock:

```bash
kubectl apply -f https://raw.githubusercontent.com/SAP/xf-application-mocks/main/commerce-mock-lite/deployment/k8s.yaml -n mocks
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
