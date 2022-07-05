This is a brief description of the chart that has been created for the chatbot.

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
| Parameter                                     | Description                      | Default value               |
| --------------------------------------------- | -------------------------------- | --------------------------- |
| bot.secret.caicredentialsurl                  | The docker image                 |                             |
| bot.secret.caicredentialsid                   | The pullPolicy of the image      | Always                      |
| bot.secret.caicredentialssecret               | The image version tag            | latest                      |
| bot.secret.boturl                             | The name of the database         | DemoDB                      |
| bot.secret.caixtoken                          | The database service host        | mssql.dev.svc.cluster.local |
| bot.secret.stackurl                           | The database port                | 1433                        |
| bot.secret.stacktag                           | The service port                 | 80                          |
| bot.secret.stackkey                           | The name overide of the subchart | database-mssql              |
| bot.secret.dbname                             | The name overide of the subchart | database-mssql              |
| bot.secret.dbhost                             | The name overide of the subchart | database-mssql              |
| bot.secret.dbusername                         | The name overide of the subchart | database-mssql              |
| bot.secret.dbpassword                         | The name overide of the subchart | database-mssql              |
| bot.updatebot.cronjob.update.image            | The name overide of the subchart | database-mssql              |
| bot.updatebot.cronjob.update.tag              | The name overide of the subchart | database-mssql              |
| bot.updatebot.cronjob.updateall.image         | The name overide of the subchart | database-mssql              |
| bot.updatebot.cronjob.updateall.tag           | The name overide of the subchart | database-mssql              |
| bot.botobservertool.apirule.gateway           | The name overide of the subchart | database-mssql              |
| bot.botobservertool.apirule.port              | The name overide of the subchart | database-mssql              |
| bot.botobservertool.deployment.image          | The name overide of the subchart | database-mssql              |
| bot.botobservertool.deployment.tag            | The name overide of the subchart | database-mssql              |
| bot.botobservertool.deployment.containerport  | The name overide of the subchart | database-mssql              |
| bot.botobservertool.service.port              | The name overide of the subchart | database-mssql              |
| bot.botobservertool.service.targetport        | The name overide of the subchart | database-mssql              |
