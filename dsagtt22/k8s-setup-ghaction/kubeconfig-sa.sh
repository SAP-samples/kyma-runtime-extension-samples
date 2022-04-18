API_SERVER_URL=$(kubectl config view -o=jsonpath='{.clusters[].cluster.server}')

SECRET_NAME=$(kubectl get sa -n $ns dsag-tt-2022-service-account -ojsonpath='{.secrets[0].name}')

CA=$(kubectl get secret/${SECRET_NAME} -n $ns -o jsonpath='{.data.ca\.crt}')
TOKEN=$(kubectl get secret/${SECRET_NAME} -n $ns -o jsonpath='{.data.token}' | base64 --decode)

echo "apiVersion: v1
kind: Config
clusters:
  - name: default-cluster
    cluster:
      certificate-authority-data: ${CA}
      server: ${API_SERVER_URL}
users:
  - name: default-user
    user:
      token: ${TOKEN}
contexts:
  - name: default-context
    context:
      cluster: default-cluster
      namespace: $ns
      user: default-user
current-context: default-context" > templates/kubeconfig.yaml