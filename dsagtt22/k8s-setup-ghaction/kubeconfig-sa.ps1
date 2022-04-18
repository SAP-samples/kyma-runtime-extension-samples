$API_SERVER_URL = kubectl config view -o=jsonpath='{.clusters[].cluster.server}'

$SECRET_NAME = kubectl get sa -n $ns dsag-tt-2022-service-account -o jsonpath='{.secrets[0].name}'

$CA = kubectl get secret/$SECRET_NAME -n $ns -o jsonpath='{.data.ca\.crt}'

$TOKEN = kubectl get secret/$SECRET_NAME -n $ns -o jsonpath='{.data.token}'
$DEC_TOKEN = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($TOKEN))

Add-Content -Path ./kubeconfig.yaml @"
apiVersion: v1
kind: Config
clusters:
- name: default-cluster
  cluster:
    certificate-authority-data: $CA
    server: $API_SERVER_URL
users:
- name: default-user
  user:
    token: $DEC_TOKEN
contexts:
- name: default-context
  context:
    cluster: default-cluster
    namespace: $ns
    user: default-user
current-context: default-context
"@

Write-Host "Finished"