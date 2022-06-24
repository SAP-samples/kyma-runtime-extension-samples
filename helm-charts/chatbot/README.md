This is a brief description of the chart that has been created for the chatbot.
Testvalue

## PREREQUISITS
For the installation of this chart to be successful, the setup steps of the chatbot in the github repository have to be followed first.
After going through the setup, the required kubernetes objects should be installable via this helm chart.

## INSTALLATION
The chart can be installed with the following command:
```
helm install
```


After this the kubernetes objects should be running in the given cluster.


The installed chart can be uninstalled with the command:
```
helm uninstall
```



## PARAMETERS
| Parameter                   | Description                      | Default value               |
| --------------------------- | -------------------------------- | --------------------------- |
| image.repository            | The docker image                 |                             |
| image.pullPolicy            | The pullPolicy of the image      | Always                      |
| image.tag                   | The image version tag            | latest                      |
| configmap.database          | The name of the database         | DemoDB                      |
| configmap.host              | The database service host        | mssql.dev.svc.cluster.local |
| configmap.port              | The database port                | 1433                        |
| service.port                | The service port                 | 80                          |
| database-mssql.nameOverride | The name overide of the subchart | database-mssql              |



