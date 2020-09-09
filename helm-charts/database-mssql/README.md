

[Helm](https://helm.sh/docs/)

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