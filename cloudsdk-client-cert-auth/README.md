# Overview

There could be extension and application use cases deployed on Kyma runtime where the workload is required to connect to an external system. There external system could have been secured with OAuth2, Basic Authentication, Client Certificate Authentication or any other means. 

In all such cases, SAP Destination service can be used to store and retrieve technical information to consume the target external system. SAP Cloud SDK can be used for the boilerplate logic to retrieve the credentials and connect to the external system. The advantage is that the application code is then focused on the business logic and all connectivity details are handled by the SAP Cloud SDK.

In this sample, we will connect to an external system that is secured with Client Certificate Authentication using SAP Cloud SDK. The certificate and all technical information are stored in the SAP Destination service.
The sample application is running on the Kyma runtime.

![flow](./assets/flow.png)

## Setup

### Configuration

1. Create an instance of SAP Destination service. The Service binding will create the credentials for calling the destination service API. It will be used to upload the client certificate as well as by the SAP Cloud SDK to connect to the external system. 

```yaml
apiVersion: servicecatalog.k8s.io/v1beta1
kind: ServiceInstance
metadata:
  name: destination-service-instance
spec:
  clusterServiceClassExternalName: destination
  clusterServicePlanExternalName: lite
---
apiVersion: servicecatalog.k8s.io/v1beta1
kind: ServiceBinding
metadata:
  name: destination-service-binding
spec:
  instanceRef:
    name: destination-service-instance
```

3. Use the credentials to upload the client certificate.
4. Configure the Destination in SAP Business Technology Platform (SAP BTP) Cockpit.

### Application

1. Create a Java application using SAP Cloud SDK.
2. Configure the application to specify the mount path for services' credentials.
3. Implement a sample controller to call the external system.
4. Deploy the application.

### Verify

## Steps
- explain the scenario
- create service instances
- Upload certificates
- create destination configuration
- deploy
- verify