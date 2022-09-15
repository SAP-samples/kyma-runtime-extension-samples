This is a brief description of the chart that has been created for the chatbot.

## PREREQUISITS
For the installation of this chart to be successful, the setup steps of the chatbot in the github repository have to be followed first.
After going through the setup, the required kubernetes objects should be installable via the overall-chatbot helm chart.

## NOTES ABOUT THE GIVEN CHARTS
For the production of the chatbot, there were 2 charts (update-bot, bot-observer) set up. These two charts were solely created for CICD purposes and should not be used for the manual installation of the chatbot. The helm-chart to be used for this purpose is the overall-chatbot chart. 

## INSTALLATION
The overall-chatbot chart can be installed by doing the following steps:
1. Download the helm-chart
2. Change the values in the values.yaml file to your individual values
3. Install the helm-chart by running the following card from within the directory (within the overall-chatbot folder) 
```
helm install overall-chatbot . -n <your-namespace>
```
where ```<your-namespace>``` should be substituted to the name of your namespace in which the chatbot is supposed to be running.

After this the kubernetes objects should be running in the given cluster.


The installed chart can be uninstalled with the command:
```
helm uninstall overall-chatbot -n <your-namespace>
```
Where ```<your-namespace>``` should be substituted to the name of your namespace in which the chatbot is supposed to be running.



## PARAMETERS
| Parameter                                     | Description                                                         | Default value               |
| --------------------------------------------- | ------------------------------------------------------------------- | --------------------------- |
| bot.secret.caicredentialsurl                  | The url for the cai call                                            |  `https://sapcai-community.authentication.eu10.hana.ondemand.com/oauth/token`    |
| bot.secret.caicredentialsid                   | The id for the cai call                                             | xxxxxxxxx                   |
| bot.secret.caicredentialssecret               | The secret for the cai call                                         | xxxxxxxxx                   |
| bot.secret.boturl                             | The url where the bot can be reached                                | `https://api.cai.tools.sap/train/v2/users/xxxxxxxxxxx/bots/xxxxxxxxxx/versions/xxxxxxxxxxxxxx/qna/topic/knowledge_sources/xxxxxxxxxxxxxxxxxxxxx/answers`        |
| bot.secret.caixtoken                          | The token for the cai call                                          | xxxxxxxxx                   |
| bot.secret.stackurl                           | The url for the stackoverflow call                                  | `https://sap.stackenterprise.co/api/2.2`                        |
| bot.secret.stacktag                           | The tag for the stackoverflow call                                  | kyma-runtime                |
| bot.secret.stackkey                           | The key for the stackoverflow call                                  | xxxxxxxxx                   |
| bot.secret.dbname                             | The name of the mssql database                                      | BotKnowledgeDB              |
| bot.secret.dbhost                             | The name of the host of the mssql database                          | mssql.chatbot.svc.cluster.local |
| bot.secret.dbusername                         | The username for the mssql database login                           | sa                          |
| bot.secret.dbpassword                         | The password for the mssql database login                           | mfrCPTK3                    |
| bot.updatebot.cronjob.update.image            | The name of the image used for the cronjob                          | gabbi/bot-update            |
| bot.updatebot.cronjob.update.tag              | The tag of the image used for the cronjob                           | latest                      |
| bot.updatebot.cronjob.updateall.image         | The name of the image used for the cronjob that runs once a day     | gabbi/bot-update            |
| bot.updatebot.cronjob.updateall.tag           | The tag of the image used for the cronjob that runs once a day      | latest                      |
| bot.botobservertool.apirule.gateway           | The gateway for the apirule for the bot-observer-tool               | kyma-gateway.kyma-system.svc.cluster.local           |
| bot.botobservertool.apirule.port              | The port for the apirule for the bot-observer-tool                  | 3000                        |
| bot.botobservertool.deployment.image          | The name of the image used for the bot-observer-tool                | lasseurban/bot-observer-tool|
| bot.botobservertool.deployment.tag            | The tag of the image used for the bot-observer-tool                 | latest                      |
| bot.botobservertool.deployment.containerport  | The port of the bot-observer-tool container speaking to the service | 3000                        |
| bot.botobservertool.service.port              | The port of the service over which traffic runs                     | 3000                        |
| bot.botobservertool.service.targetport        | The goal port of the service                                        | 3000                        |
| apimssqlfunction.deployment.env.database      | The name of the mssql database                                      | BotKnowledgeDB              |
| apimssqlfunction.deployment.env.host          | The name of the host of the mssql database                          | mssql.chatbot.svc.cluster.local|
| apimssqlfunction.deployment.env.username      | The username for the mssql database login                           | sa                          |
| apimssqlfunction.deployment.env.password      | The password for the mssql database login                           | mfrCPTK3                    |
| apimssqlfunction.deployment.reference         | The name of the branch in the repository where the function lies    | main                        |
| apimssqlfunction.deployment.basedir           | The path of the repository where the function lies                  | chatbot-conversational_AI/knowledge-database/api-mssql-function/function              |
| apimssqlfunction.apirule.gateway              | The gateway for the apirule for the api function for the database   | kyma-gateway.kyma-system.svc.cluster.local              |
| databasemssql.deployment.image                | The name of the image for the mssql database                        | lasseurban/bot-db           |
| databasemssql.deployment.tag                  | The tag of the image for the mssql database                         | latest                      |
| databasemssql.deployment.containerport        | The port of the mssql database-container that talks to the service  | 1433                        |
| databasemssql.service.port                    | The port of the database service over which the traffic runs        | 1433                        |
| databasemssql.service.targetport              | The goal port of the database service                               | 1433                        |
| databasemssql.secret.username                 | The username for the mssql database login (base64 encoded)          | c2E=                        |
| databasemssql.secret.password                 | The password for the mssql database login (base64 encoded)          | bWZyQ1BUSzM=                |
| alertnotification.email                       | The email to which alerts in case of an error are sent (base64 encoded)   | dGVzdHZhbHVlCg==            |
| alertnotification.clusterdomain               | The domain of the cluster for which the alert notification is set (base64 encoded)| dGVzdHZhbHVlCg==            |
| alertnotification.url                         | The url of the region (base64 encoded) | dGVzdHZhbHVlCg==            |
| alertnotification.slack.webhook               | The url of the webhook for the slack service (base64 encoded)       |dGVzdHZhbHVlCg==            |
| alertnotification.alertnotifsrv | The url of the service over which alerts can be sent (base64 encoded) | aHR0cDovL2FsZXJ0LW5vdGlmLmthcmwta3ltYS5zdmMuY2x1c3Rlci5sb2NhbAo= | 
| regsecret.dockerconfigjson                    | The credentials for the docker registry                             | xxxxxxxxx                   |
