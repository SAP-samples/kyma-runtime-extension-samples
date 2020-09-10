This chart installs the example [frontend-ui5-mssql](../frontend-ui5-mssql/README.md). Installing this chart will also install the charts [api-mssql-go](../api-mssql-go/README.md) and [database-mssql](../database-mssql/README.md)   


## Installing the Chart
To install the chart you must set the property `clusterDomain` 
To install the chart with the release name `myapp` in the namespace `default`:
```
helm install  myapp frontend-ui5-mssql -n default --set clusterDomain="********.kyma.shoot.live.k8s-hana.ondemand.com"
```

## Uninstalling the Chart
To uninstall/delete the  `myapp` deployment in the namespace `default`:
```
helm delete  myapp -n default
```

## Update the Dependency
```
helm dependency update frontend-ui5-mssql
```

## Parameters
The following tables lists the available parameters of the chart and their default values as found in the `values.yaml`
| Parameter                 | Description                                                                     | Default value |
| ------------------------- | ------------------------------------------------------------------------------- | ------------- |
| image.repository          | The docker image                                                                |               |
| image.pullPolicy          | The pullPolicy of the image                                                     | Always        |
| image.tag                 | The image version tag                                                           | latest        |
| clusterDomain.database    | The cluster's domain for example ********.kyma.shoot.live.k8s-hana.ondemand.com |               |
| service.port              | The service port                                                                | 80            |
| api-mssql-go.nameOverride | The name overide of the subchart                                                | api-mssql-go  |

<br/>

You can specify your own `values.yaml`

```
helm install myapp frontend-ui5-mssql -n default -f values.yaml
```

You can override values in the cli by specifying the value for example
```
helm install myapp frontend-ui5-mssql -n default --set image.repository=mydockeruser/myimage
```