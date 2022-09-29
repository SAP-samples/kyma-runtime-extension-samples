## Overview

This sample provides a CAP Service application service.

This sample demonstrates how to:

- Create a development Namespace in the Kyma runtime.
- Configure and build an CAP Service using [Paketo](https://paketo.io/).
- Creating a Helm chart with CAP
- Connecting a CAP application to Hana Cloud
- Protecting a CAP service with Authentication
- Deploy the CAP Service in the Kyma runtime which includes:
  - A Deployment of the CAP Service.
  - An API to expose the service externally.
  - An XSUAA instance
  - A Secret containing Hana credentials.

## Prerequisites

- SAP BTP, Kyma runtime instance
- [Docker](https://www.docker.com/)
- [Docker Hub Account](https://hub.docker.com/signup)
- [Node.js](https://nodejs.org/en/)
- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) configured to use the `KUBECONFIG` file downloaded from the Kyma runtime.
- [Paketo](https://paketo.io/)

### CAP Resources

- [CAP hints for SQLite on windows](https://cap.cloud.sap/docs/resources/troubleshooting#how-do-i-install-sqlite-on-windows)
- [Troubleshooting guide](https://cap.cloud.sap/docs/resources/troubleshooting#npm-installation) for CAP.

## Steps

### Run the frontend locally

1. Clone the project.

2. Inside the `app` directory, run:

```shell
npm install
```

3. Install the CAP tools

```shell
npm i -g @sap/cds-dk
```

4. Verify the CAP tools install by running

```shell
cds
```

5. Run the app using the command

```shell
cds watch
```

The application loads at `http://localhost:4004`.

### Provising the HANA Database

⚠ NOTE: The creation of the instance will take some time. Also please note that when using the SAP BTP trial, the HANA instance will need to be restarted each day.

1. In the SAP BTP global account choose Entitlements -> Entity Assignments. Choose your subaccount and choose Go. This will list all assigned entitlements.
2. Choose Configure Entitlements and Add Service Plans to select additional entitlements.
3. For the Entitlement choose **SAP HANA Cloud** and choose the Plan **hana**
4. Creat the Instance by choosing within the the subaccount view, open Cloud Foundry -> Spaces and select the dev space and choose the menu item SAP HANA Cloud. Choose Create -> SAP HANA Database.
5. In SAP HANA Cloud Central, select as Type the entry SAP HANA Cloud, SAP HANA Database. Choose Next Step at the bottom right.

6. Provide the following values:
   1. Instance Name: kyma
   2. Administrator Password: Any value
   3. Chose Next Step and keep the default values of the next two screens by choosing Next Step twice.
   4. On the SAP HANA Database Advanced Settings choose the option Allow all IP addresses and choose Next Step.
   5. Lastly, choose Review and Create and then Create Instance.

### Provising the SAP HANA Schemas & HDI Containers

⚠ NOTE: The step requires that the creation of the SAP HANA Cloud has completed.

1.  Within your SAP BTP subaccount choose Service Marketplace and select SAP HANA Schemas & HDI Containers. Choose Create with the options
    1. Plan: hdi-shared
    2. Instance Name: cap-kyma
2.  Choose Create and select the option View Instance. Once the instance is created, open the instance and choose the option Create under Service Keys. Provide the service Key Name kyma and choose Create.

3.  Once created choose the option View and copy the credentials.
4.  Open the file `k8s/hana-db-secret.yaml` and copy the values into the file.
5.  Create a new `dev` Namespace:

```shell
kubectl create namespace dev
kubectl label namespaces dev istio-injection=enabled
```

6.  Apply the secret

```shell
kubectl -n dev apply -f ./k8s/hana-db-secret.yaml
```

### Prepare the app for deployment

1. Within the directory `app`, run the command to add the hana feature to the project

```shell
cds add hana --for production
```

2. Within the directory `app`, run the command to add the helm feature to the project

```shell
cds add helm
```

3. Build the application for production

```shell
cds build --production
```

4. Build the service container using paketo

```shell
pack build <dockerid>/faq-srv --path gen/srv --builder paketobuildpacks/builder:base
```

5. Build the database deployer container using paketo

```shell
pack build <dockerid>/faq-hana-deployer --path gen/db --builder paketobuildpacks/builder:base
```

6. Push the two images to your docker account.

```shell
docker push <dockerid>/faq-srv
docker push <dockerid>/faq-hana-deployer
```

### Configure the Helm chart

1. Open the file `app/chart/values.yaml` and provide the values

   1. **Domain**: your kyma cluster-domain
   2. **Repository**: your docker/repository account
   3. **imagePullSecret.name**: if using a secured docker/repository account provide the secret name, otherwise use **notused**
   4. **srv.bindings.db.fromsecret**: faq-db
   5. **hana_deployer.bindings.hana.fromSecret**: faq-db

2. Open the file `app/chart/charts/web-application` and adjust the value
   1. **port**: 4004

### Deploy the app to Kyma

1. helm upgrade --install cap-faq ./chart --namespace dev

2. Test the application either in the browser or by testing an endpoint using curl. The completion of the helm upgrade should return the service endpoint.

```shell
curl https://faq-cap-srv-dev.<cluster domain>/admin/Faqs
```

### Secure the application

1. Within the directory `app`, run the command to add the XSUAA feature to the project. This will result in an XSUAA instance being created when the helm chart is deployed.

```shell
cds add XSUAA --for production
```

2. Open the file `app/srv/admin-service.cds` and add `@requires : 'authenticated-user'` above the service definition

```
using {sap.demo.faq as my} from '../db/schema';

   @requires : 'authenticated-user'

   service AdminService {
      @odata.draft.enabled`
```

3. Build the application for production

```shell
cds build --production
```

4. Rebuild the service container using paketo

```shell
pack build <dockerid>/faq-srv --path gen/srv --builder paketobuildpacks/builder:base
```

5. Push the images to your docker account.

```shell
docker push <dockerid>/faq-srv
```

6. Deploy the app to Kyma

```shell
helm upgrade --install faq-cap ./chart --namespace dev
```

7. Test the application either in the browser or by testing an endpoint using curl.

```shell
curl https://faq-cap-srv-dev.<cluster domain>/admin/Faqs
```

This should result in the error

```json
{ "statusCode": 401, "code": "401", "message": "Unauthorized" }
```

## Accessing the secured CAP Endpoint

The CAP application will be bound to an XSUAA instance which will handle the authentication. The values: `url`, `clientid`, and `clientsecret` will be needed to create a request to obtain an access token. This can be obtained within the Kyma dashboard by finding the secret `faq-cap-srv-auth` under the menu option `Configuration -> Secrets` and using the option to `Decode` the value.

1. To use `curl` within a shell:

```shell
export URL=$(kubectl get secrets/faq-cap-srv-auth -n dev -o jsonpath="{.data.url}" | base64 -d)
export CLIENTID=$(kubectl get secrets/faq-cap-srv-auth -n dev -o jsonpath="{.data.clientid}" | base64 -d)
export CLIENTSECRET=$(kubectl get secrets/faq-cap-srv-auth -n dev -o jsonpath="{.data.clientsecret}" | base64 -d)
```

2. Run the command, which utilizes [jq](https://stedolan.github.io/jq/) to extract the `access_token` from the response.

```shell
export ACCESSTOKEN=$(curl --location --request POST $URL/oauth/token \
   --header 'Content-Type: application/x-www-form-urlencoded' \
   --data-urlencode 'client_id='$CLIENTID \
   --data-urlencode 'client_secret='$CLIENTSECRET \
   --data-urlencode 'grant_type=client_credentials' \
   --data-urlencode 'response_type=token' | jq -r '.access_token' )
```

3. Pass the access_token when calling the endpoint using curl

```shell
curl https://faq-cap-srv-dev.<cluster domain>/admin/Faqs --header 'Authorization: Bearer '$ACCESSTOKEN
```
