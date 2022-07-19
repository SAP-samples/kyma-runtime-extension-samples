# Trigger Function on time-based schedule

## Overview

This sample demonstrates how to trigger Kyma Function on your custom schedule.
It is based on the [hello-timer](https://github.com/SAP-samples/cloud-function-nodejs-samples/tree/master/examples/hello-timer) SAP Faas Runtime example and can serve the purpose of showing how a similar use case can be migrated from deprecated SAP Faas Runtime into the Kyma runtime.


## Steps

### Inspect the Function files

Go to the `time-based-trigger/hello-timer` folder and inspect the code (`handler.js`), dependencies (`package.json`) and the Function configuration file, which manifests the features of the Function (`config.yaml`).
As you see, the timer is not configurable in the manifest. The time-based triggering can be realised using the Cron Job feature that is built in Kubernetes. 


### Deploy the Function using Kyma CLI

> **NOTE:** If you prefer to deploy the scenario using kubectl CLI, use the attached `hello-timer-resources.yaml` with the `kubectl apply` command and skip to the testing part.

Run the following command to deploy the Function:

```shell
$ kyma apply function
```

To verify if the Function was built run:

```shell
$ kubectl get functions   
NAME              CONFIGURED   BUILT   RUNNING   RUNTIME    VERSION   AGE
hello-timer       True         True    True      nodejs14   1         41s
```

At this point the Function is iddle. Now you can deploy the Cron Job that triggers it, based on a desired schedule.

### Create Cron Job 

#### Collect the trigger configuration:

Export the Function name and Namespace as environment variables.

```shell
export TRIGGER_FN_NAME={FUNCTION NAME}
export TRIGGER_FN_NAMESPACE={FUNCTION NAMESPACE}
```
For example:

```shell
export TRIGGER_FN_NAME=hello-timer
export TRIGGER_FN_NAMESPACE=default
```

Export the Function UID:
```shell
export TRIGGER_FN_UID=$(kubectl get function -n ${TRIGGER_FN_NAMESPACE} ${TRIGGER_FN_NAME} -o=jsonpath={".metadata.uid"})
```

All this data allows you to define the Function as the Cron Job's owner. If the Function is deleted from the cluster the Cron Jobs are deleted as well.

Export the schedule of the trigger in [cron format](https://en.wikipedia.org/wiki/Cron).
```shell
export TRIGGER_SCHEDULE={TRIGGER SCHEDULE}
```
For example `*/5 * * * *` to schedule execution every 5 minutes.

#### Create Cron Job

Run the following kubectl command to create Cron Job:

```shell
cat <<EOF | kubectl create -f -
apiVersion: batch/v1
kind: CronJob
metadata:
  generateName: trigger-${TRIGGER_FN_NAME}-
  namespace: ${TRIGGER_FN_NAMESPACE}
  ownerReferences:
    - apiVersion: serverless.kyma-project.io/v1alpha1
      kind: Function
      name: ${TRIGGER_FN_NAME}
      uid: ${TRIGGER_FN_UID}
spec:
  schedule: "${TRIGGER_SCHEDULE}"
  concurrencyPolicy: "Forbid"
  failedJobsHistoryLimit: 1
  successfulJobsHistoryLimit: 0
  jobTemplate:
    spec:
      template:
        spec:
          containers:
            - name: cron-trigger
              image: eu.gcr.io/kyma-project/external/curlimages/curl:7.70.0
              imagePullPolicy: IfNotPresent
              command:
                - sh
                - -c
                - |
                  curl ${TRIGGER_FN_NAME}.${TRIGGER_FN_NAMESPACE};
                  x=\$?; curl -fsI -X POST http://localhost:15020/quitquitquit && exit \$x
          restartPolicy: Never
EOF

```

### Test the setup

Inspect the Function logs. This can be done by a command similar to:

```shell
➜  ~ k logs hello-timer-mthpc-d6c879fb9-76cz8 function -f
run at 2022-07-13T10:05:06.959Z
run at 2022-07-13T10:10:09.077Z
run at 2022-07-13T10:15:05.686Z
```

### Considerations

 - This approach is not recommended if you need high accuracy in execution times. Kubernetes starts Cron Job (deploys a container), and there is a few seconds delay before your Function gets executed. 
 - You can consider running your logic in the Cron Job container, instead of having Cron Job calling your Function using its internal address.
 - This approach is not suitable for very short intervals (every 30 seconds or shorter). It takes time to deploy the Cron Job's container and clean it up once it's done. With short execution intervals (for example, every 10 seconds) there might be a resource problem (cluttering the cluster). 
