# Step 6 - Deploy the Registrations REST API Server

1. Go to the **nextjs-app-with-kyma-eventing/registrations-rest-api** folder.

   ```shell
   cd registrations-rest-api
   ```
   
2. Download the PEM file and place it within the `/registrations-rest-api` folder. The certificate (DigiCertGlobalRootCA.crt.pem) can be downloaded in 'pem-format' from [digicert](https://www.digicert.com/kb/digicert-root-certificates.htm). [Here](https://cacerts.digicert.com/DigiCertGlobalRootCA.crt.pem) is the direct link to download the file.
   > Note: After downloading the file, rename it to DigiCertGlobalRootCA.pem
   
   Please see [SAP Help](https://help.sap.com/docs/HANA_SERVICE_CF/cc53ad464a57404b8d453bbadbc81ceb/5bd9bcec690346a8b36df9161b1343c2.html?locale=en-US).
   The certificate is signed by 'DigiCert Global Root CA' with a certificate thumbprint (SHA1): A8:98:5D:3A:65:E5:E5:C4:B2:D7:D6:6D:40:C6:DD:2F:B1:9C:54:36

3. Build the docker image of the **registrations-rest-api microservice**.

   ```shell
   docker build . -t <docker-username>/registrations-rest-api -f Dockerfile
   ```

   > Note: Replace `<docker-username>` with your username

4. Push the docker image of the **registrations-rest-api microservice** to your Container Image Library.

   ```shell
   docker push <docker-username>/registrations-rest-api
   ```

   > Note: Replace `<docker-username>` with your username

5. Update the docker image in the ./registrations-rest-api/k8s/deployment.yaml file.

   > Note: Replace `<docker-username>` with your username

6. Update the values of the `HANA_DB_USER`, `HANA_DB_PASSWORD`, `HANA_DB_HOST` & `HANA_DB_PORT` environment variables in the ./registrations-rest-api/k8s/secret.yaml file.

   The **host** and **port** can be got from the SAP HANA Cloud screen of your subaccount in the BTP cockpit (**Cloud Foundry** > **Spaces** > **dev** > **SAP HANA Cloud** > **tech-conference-db** > **Actions** > **Copy SQL Endpoint**).

7. Go back to the parent folder (i.e. **nextjs-app-with-kyma-eventing** folder).

   ```shell
   cd ..
   ```

7. Create/update Kubernetes resources of the **registrations-rest-api microservice**.

   ```shell
   kubectl apply -f ./registrations-rest-api/k8s/secret.yaml
   kubectl apply -f ./registrations-rest-api/k8s/deployment.yaml
   kubectl apply -f ./registrations-rest-api/k8s/service.yaml
   ```

8. Verify that the secret, deployment and service were created by going to the specific screens in the Kyma console.

## Navigation

| [:house:](../../README.md) | :arrow_backward: [Setup : Step 5 - Create an instance of SAP HANA Cloud](step-5.md) | :arrow_forward: [Setup : Step 7 - Connect your web app running on Kyma Runtime to a domain via Cloudflare](step-7.md) |
| -------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
