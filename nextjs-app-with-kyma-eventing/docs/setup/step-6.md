# Step 6 - Deploy the Registrations REST API Server

1. Go to the **nextjs-app-with-kyma-eventing/registrations-rest-api** folder.

   ```shell
   cd nextjs-app-with-kyma-eventing/registrations-rest-api
   ```

2. Build the docker image of the **registrations-rest-api microservice**.

   ```shell
   docker build . -t `<docker-username>`/registrations-rest-api -f Dockerfile
   ```

   > Note: Replace `<docker-username>` with your username

3. Push the docker image of the **registrations-rest-api microservice** to your Container Image Library.

   ```shell
   docker push `<docker-username>`/registrations-rest-api
   ```

   > Note: Replace `<docker-username>` with your username

4. Update the docker image in the ./registrations-rest-api/k8s/deployment.yaml file.

   > Note: Replace `<docker-username>` with your username

5. Update the values of the `HANA_DB_USER`, `HANA_DB_PASSWORD`, `HANA_DB_HOST` & `HANA_DB_PORT` environment variables in the ./registrations-rest-api/k8s/secret.yaml file. 

   The **host** and **port** can be got from the SAP HANA Cloud screen of your subaccount in the BTP cockpit (**Cloud Foundry** > **Spaces** > **dev** > **SAP HANA Cloud** > **tech-conference-db** > **Actions** > **Copy SQL Endpoint**).

6. Go back to the parent folder (i.e. **nextjs-app-with-kyma-eventing** folder).

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

| [:house:](../../README.md) | :arrow_backward: [Setup : Step 5 - Create an instance of SAP HANA Cloud](step-5.md) | :arrow_forward: [Verification : Step 1 - Verify that all the resources of the app are running](../verification/step-1.md) |
| -------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
