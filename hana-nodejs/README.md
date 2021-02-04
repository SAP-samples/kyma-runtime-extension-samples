## Set SAP HANA Cloud instance

Create a SAP HANA Cloud instance as describe in the first tutorial and complete the other two.

- [hana-clients-choose-hana-instance](https://developers.sap.com/tutorials/hana-clients-choose-hana-instance.html)
- [hana-clients-install](https://developers.sap.com/tutorials/hana-clients-install.html)
- [hana-clients-hdbsql](https://developers.sap.com/tutorials/hana-clients-hdbsql.html)

## Run the app locally

1. Clone the project.

2. Inside the app directory, run:

```Shell/Bash
npm install
```

### Set parameters for app

```Shell/Bash
export HDB_HOST=**********.hana.trial-us10.hanacloud.ondemand.com
export HDB_PORT=443
```

### Start the app

```Shell/Bash
node server.js
```

App will be availabe at [http://localhost:3000](http://localhost:3000)

## Build the Docker image

Build and push the image to your Docker repository:

```Shell/Bash
docker build -t {docker id}/hanadb-nodejs -f docker/Dockerfile .
docker push {docker id}/hanadb-nodejs
```

To run the image locally

```Shell/Bash
docker run -e HDB_HOST=\*\*\*\*\*.hana.trial-us10.hanacloud.ondemand.com -e HDB_PORT=443 -e NODE_ENV=production -p 3000:3000 -d {docker id}/hanadb-nodejs
```

### Deploy the application

1. Create a new `dev` Namespace:

```shell script
kubectl create namespace dev
```

2. Adjust the values of the configmap to match your HANA Cloud instance and apply the Resources:

```shell script
kubectl -n dev apply -f ./k8s/deployment.yaml
kubectl -n dev apply -f ./k8s/apirule.yaml
kubectl -n dev apply -f ./k8s/configmap.yaml
```

1. Use the APIRule to open the application:

https://hanadb-nodejs.{cluster-domain}
