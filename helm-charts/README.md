This folder contains various helm chart examples that correspond to the examples found in this repository.  These can be used to deploy and manage Kubernetes resources.  Each chart contains a values.yaml which contains the configuration parameters of the chart.

For more information see [helm](https://helm.sh/)

List of examples


Example usages

## helm template

# Locally render template
helm template mydbinstall ./database-mssql

# Locally render template cli overrides
helm template --set image.repository=mydockeruser/mssql mydbinstall ./database-mssql

# Locally render template with overrides in myvalues.yaml
helm template -f myvalues.yaml mydbinstall ./database-mssql



## helm install
helm install mydbinstall ./database-mssql -n helmtest

## helm uninstall
helm uninstall mydbinstall ./database-mssql -n helmtest