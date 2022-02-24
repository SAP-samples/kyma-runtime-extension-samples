# Troubleshooting steps

## Check your browser logs for more details regarding possible errors

If you don’t receive an email, go to **Chrome Dev Tools** (**View** > **Developer** > **Developer Tools** > **Console**) to see the client-side logs.

   ![Console](../assets/troubleshooting/1.png)

If you don’t see a success message, then:

Either, the API Rule may not have been setup correctly.

Or, some of the environment variables haven’t been set correctly.

## Check your API Rule

To check if your API Rule has been setup correctly, verify that it looks as shown in the screenshot below.

   ![API Rule](../assets/troubleshooting/2.png)

## Check the Send Grid environment variables of the event-consumer function

To verify your environment variables, go to **Workloads** > **Functions** > **event-consumer**.

Then, verify that the values of the **SENDGRID_API_KEY** & **SENDGRID_SENDER_EMAIL** environment variables are correct.

   ![Verify environment variables](../assets/troubleshooting/3.png)

## Check the logs of your different pods

1. Within the **conference-registration** namespace, go to **Workloads** > **Pods** to see the list of all running pods.

   ![Verify pods](../assets/verification-step-1/2.png)

2. To see the logs of the serverless function, go to the function in the Kyma console and view the Logs in the expandable window at the bottom of the page.

   ![View logs of the serverless function](../assets/troubleshooting/4.png)

3. Optionally, use the following kubectl command to get the list of pods running in the **conference-registration** namespace.

   ```shell
   kubectl get pods -n conference-registration
   ```

4. Then, to see the logs of any of the pods, use the following syntax:

   ```shell
   kubectl logs <pod-name> -n <namespace>
   ```

   **Example:**

   ```shell
   kubectl logs event-consumer-td98x-59dcbcff48-l294g -n conference-registration
   ```

## Navigation

| [:house:](../../README.md) | :arrow_backward: [Verification : Step 5 - Launch the app and Register to attend the Tech Conference via the app](step-5.md) |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
