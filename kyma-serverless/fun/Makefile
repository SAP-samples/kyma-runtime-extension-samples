.DEFAULT_GOAL := help

LOCAL_DIR = $(dir $(abspath $(lastword $(MAKEFILE_LIST))))

CHART_SRV=fun-srv
CHART_APP=fun-app
CHART_HDB=fun-db

NAMESPACE=default
KUBECONFIG=~/.kube/kubeconfig--btp-easy--btp.yaml
CLUSTER_DOMAIN= $(shell kubectl get cm -n kube-system shoot-info --kubeconfig $(KUBECONFIG) -ojsonpath='{.data.domain}' )
ISTIO_GATEWAY=kyma-gateway.kyma-system.svc.cluster.local

RSA_KEY= $(shell ls ~/.ssh/id_rsa)
GIT_KEY=git-ssh-secret
GIT_URL=git@github.com:ptesny/k8s-samples.git
GIT_DIR=/k8s-samples/faas/fun/fun-srv/
GIT_BRANCH=main

PORT=8080 ##PORT=5000 ### or PORT=${RANDOM} 


help: ## Display this help.
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z_0-9-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)
		echo $(KUBECONFIG) $(NAMESPACE)
##	echo $(LOCAL_DIR) $(CLUSTER_DOMAIN)

.PHONY: helm-template-srv
helm-template-srv: ## Template backend (srv+db) helm chart
	helm template $(CHART_SRV) helm/$(CHART_SRV) \
	   -f $(LOCAL_DIR)/helm/$(CHART_SRV)/values.yaml \
	   --set clusterDomain=$(CLUSTER_DOMAIN) \
	   --set gateway=$(ISTIO_GATEWAY) \
	   --set services.gitRepository.url=$(GIT_URL) \
	   --set services.gitRepository.baseDir=$(GIT_DIR) \
	   --set services.gitRepository.reference=$(GIT_BRANCH) \
	   --set services.gitRepository.auth.secretName=$(GIT_KEY) \
	   --set namespace=$(NAMESPACE) \
	   --namespace=$(NAMESPACE) 		

	helm template $(CHART_HDB) helm/$(CHART_HDB) \
	   -f $(LOCAL_DIR)/helm/$(CHART_HDB)/values.yaml \
	   --set namespace=$(NAMESPACE) \
	   --namespace=$(NAMESPACE) 		

.PHONY: helm-template-app
helm-template-app: ## Template html5 helm chart
	helm template $(CHART_APP)  helm/$(CHART_APP)  \
	   -f $(LOCAL_DIR)/helm/$(CHART_APP)/values.yaml \
    --set services.app.image.port=$(PORT) \
	   --set services.app.service.port=$(PORT) \
	   --set clusterDomain=$(CLUSTER_DOMAIN) \
	   --set gateway=$(ISTIO_GATEWAY) \
	   --set namespace=$(NAMESPACE) \
	   --namespace=$(NAMESPACE) 		

.PHONY: helm-template
helm-template: ## Template all helm charts
	helm template $(CHART_SRV) helm/$(CHART_SRV) \
	   -f $(LOCAL_DIR)/helm/$(CHART_SRV)/values.yaml \
	   --set clusterDomain=$(CLUSTER_DOMAIN) \
	   --set gateway=$(ISTIO_GATEWAY) \
	   --set services.gitRepository.url=$(GIT_URL) \
	   --set services.gitRepository.baseDir=$(GIT_DIR) \
	   --set services.gitRepository.reference=$(GIT_BRANCH) \
	   --set services.gitRepository.auth.secretName=$(GIT_KEY) \
	   --set namespace=$(NAMESPACE) \
	   --namespace=$(NAMESPACE) 		

	helm template $(CHART_HDB) helm/$(CHART_HDB) \
	   -f $(LOCAL_DIR)/helm/$(CHART_HDB)/values.yaml \
	   --set namespace=$(NAMESPACE) \
	   --namespace=$(NAMESPACE) 		

	helm template $(CHART_APP)  helm/$(CHART_APP)  \
	   -f $(LOCAL_DIR)/helm/$(CHART_APP)/values.yaml \
    --set services.app.image.port=$(PORT) \
	   --set services.app.service.port=$(PORT) \
	   --set clusterDomain=$(CLUSTER_DOMAIN) \
	   --set gateway=$(ISTIO_GATEWAY) \
	   --set namespace=$(NAMESPACE) \
	   --namespace=$(NAMESPACE) 		


.PHONY: helm-deploy-srv
helm-deploy-srv: ## deploy srv helm chart
	helm upgrade -n $(NAMESPACE) -i $(CHART_SRV) helm/$(CHART_SRV) \
	   --set clusterDomain=$(CLUSTER_DOMAIN) \
	   --set gateway=$(ISTIO_GATEWAY) \
	   --set services.gitRepository.url=$(GIT_URL) \
	   --set services.gitRepository.baseDir=$(GIT_DIR) \
	   --set services.gitRepository.reference=$(GIT_BRANCH) \
	   --set services.gitRepository.auth.secretName=$(GIT_KEY) \
	   --set namespace=$(NAMESPACE) \
	   --install --kubeconfig $(KUBECONFIG)

	helm upgrade -n $(NAMESPACE) -i $(CHART_HDB) helm/$(CHART_HDB) \
	   --set namespace=$(NAMESPACE) \
	   --install --kubeconfig $(KUBECONFIG)

.PHONY: helm-deploy-app
helm-deploy-app: ## deploy fronted html5 helm chart
	helm upgrade -n $(NAMESPACE) -i $(CHART_APP) helm/$(CHART_APP) \
    --set services.app.image.port=$(PORT) \
	   --set services.app.service.port=$(PORT) \
	   --set clusterDomain=$(CLUSTER_DOMAIN) \
	   --set gateway=$(ISTIO_GATEWAY) \
	   --set namespace=$(NAMESPACE) \
	   --install --kubeconfig $(KUBECONFIG)

.PHONY: helm-deploy
helm-deploy: ## deploy helm chart
	helm upgrade -n $(NAMESPACE) -i $(CHART_HDB) helm/$(CHART_HDB) \
	   --set namespace=$(NAMESPACE) \
	   --install --kubeconfig $(KUBECONFIG)

	helm upgrade -n $(NAMESPACE) -i $(CHART_SRV) helm/$(CHART_SRV) \
	   --set clusterDomain=$(CLUSTER_DOMAIN) \
	   --set gateway=$(ISTIO_GATEWAY) \
	   --set services.gitRepository.url=$(GIT_URL) \
	   --set services.gitRepository.baseDir=$(GIT_DIR) \
	   --set services.gitRepository.reference=$(GIT_BRANCH) \
	   --set services.gitRepository.auth.secretName=$(GIT_KEY) \
	   --set namespace=$(NAMESPACE) \
	   --install --kubeconfig $(KUBECONFIG)

	helm upgrade -n $(NAMESPACE) -i $(CHART_APP) helm/$(CHART_APP) \
	   --set services.app.image.port=$(PORT) \
	   --set services.app.service.port=$(PORT) \
	   --set clusterDomain=$(CLUSTER_DOMAIN) \
	   --set gateway=$(ISTIO_GATEWAY) \
	   --set namespace=$(NAMESPACE) \
	   --install --kubeconfig $(KUBECONFIG)


.PHONY: helm-undeploy
helm-undeploy: ## undeploy helm chart
	helm uninstall -n $(NAMESPACE) $(CHART_APP) --kubeconfig $(KUBECONFIG)
	helm uninstall -n $(NAMESPACE) $(CHART_SRV) --kubeconfig $(KUBECONFIG)
	helm uninstall -n $(NAMESPACE) $(CHART_HDB) --kubeconfig $(KUBECONFIG)


.PHONY: get-cluster-id
get-cluster-id: ## get cluster id for hanacloud instance mapping
	kubectl get cm sap-btp-operator-config -n kyma-system --kubeconfig $(KUBECONFIG) -o jsonpath='{.data.CLUSTER_ID}'

.PHONY: create-git-secret
create-git-secret: ## create git secret
	kubectl -n $(NAMESPACE) create secret generic $(GIT_KEY) --from-file=key=$(RSA_KEY) --kubeconfig $(KUBECONFIG)

.PHONY: delete-git-secret
delete-git-secret: ## delete git secret
	kubectl -n $(NAMESPACE) delete secret $(GIT_KEY) --kubeconfig $(KUBECONFIG)

