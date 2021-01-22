This chart installs the example [GeoServer](../geoserver/README.md)


## Installing the Chart
To install the chart with the release name `mygeoserver` in the namespace `geo2`:
```
helm install mygeoserver1 . -n geo2
```

You could then open a web browser at the url https://`mygeoserver1-geo2`.your-cluster-url


## Uninstalling the Chart
To uninstall/delete the  `mygeoserver1` deployment in the namespace `geo2`:
```
helm delete mygeoserver1 -n geo2
```

## Parameters
The following tables lists the available parameters of the chart and their default values as found in the `values.yaml`
| Parameter               | Description                         | geo value |
| ----------------------- | ----------------------------------- | ------------- |
| persistence.storage     | Storage amount requested by the pvc | 100Mi         |

<br/>

You can specify your own `values.yaml`
