DOCKER_ACCOUNT?=provide-as-env-var
NAMESPACE?=provide-as-env-var
CLUSTER_DOMAIN?=provide-as-env-var

APP_VERSION=0.0.12

HANA_DEPLOYER=bookshop-hana-deployer
HANA_DEPLOYER_IMAGE_REPO=${DOCKER_ACCOUNT}/${HANA_DEPLOYER}
HANA_DEPLOYER_IMAGE=${HANA_DEPLOYER_IMAGE_REPO}:${APP_VERSION}

CAP_SRV=bookshop-srv
CAP_SRV_IMAGE_REPO=${DOCKER_ACCOUNT}/${CAP_SRV}
CAP_SRV_IMAGE=${CAP_SRV_IMAGE_REPO}:${APP_VERSION}

init:
	cds init bookshop --add tiny-sample,nodejs

run-local:
	cds watch bookshop

add-hana:
	cd bookshop && cds add hana --for production && cd -

add-required-libs:
	cd bookshop && npm i passport && npm i @sap/xssec && cd -

build-hana-deployer:
	cds build -in bookshop --production
	DOCKER_DEFAULT_PLATFORM=linux/amd64 pack build ${HANA_DEPLOYER} --tag ${HANA_DEPLOYER_IMAGE} \
         --path bookshop/gen/db \
         --buildpack gcr.io/paketo-buildpacks/nodejs \
         --builder paketobuildpacks/builder:base \
         --env BP_NODE_RUN_SCRIPTS=""

push-hana-deployer:
	docker push ${HANA_DEPLOYER_IMAGE}

build-cap-srv:
	cds build -in bookshop --production
	DOCKER_DEFAULT_PLATFORM=linux/amd64 pack build ${CAP_SRV} --tag ${CAP_SRV_IMAGE}\
		--path bookshop/gen/srv \
		--buildpack gcr.io/paketo-buildpacks/nodejs \
		--builder paketobuildpacks/builder:base \
		--env BP_NODE_RUN_SCRIPTS=""

push-cap-srv:
	docker push ${CAP_SRV_IMAGE}

prepare-kyma-for-deployment:
	kubectl create namespace ${NAMESPACE}
	kubectl label namespace ${NAMESPACE} istio-injection=enabled

create-helm-chart:
	cd bookshop && cds add helm && cd -

deploy-dry-run:
	helm template cap-bookshop ./bookshop/chart --namespace ${NAMESPACE} \
    		--set hana-deployer.image.tag=${APP_VERSION} \
    		--set hana-deployer.image.repository=${HANA_DEPLOYER_IMAGE_REPO} \
    		--set srv.image.tag=${APP_VERSION} \
    		--set srv.image.repository=${CAP_SRV_IMAGE_REPO} \
    		--set global.domain=${CLUSTER_DOMAIN} \
    		--values bookshop/chart/values.yaml \
    		--values ./values-cds.yaml

deploy:
	helm upgrade --install cap-bookshop ./bookshop/chart --namespace ${NAMESPACE} \
    		--set hana-deployer.image.tag=${APP_VERSION} \
    		--set hana-deployer.image.repository=${HANA_DEPLOYER_IMAGE_REPO} \
    		--set srv.image.tag=${APP_VERSION} \
    		--set srv.image.repository=${CAP_SRV_IMAGE_REPO} \
    		--set global.domain=${CLUSTER_DOMAIN} \
    		--values bookshop/chart/values.yaml \
    		--values ./values-cds.yaml

check-pods:
	kubectl get po --namespace ${NAMESPACE}

check-hana-deployer-logs:
	kubectl -n ${NAMESPACE} logs -l app.kubernetes.io/name=hana-deployer

check-cap-srv-logs:
	kubectl -n ${NAMESPACE} logs -l app.kubernetes.io/name=srv

open-deployed-app:
	open https://cap-bookshop-srv-${NAMESPACE}.${CLUSTER_DOMAIN}

undeploy:
	helm del cap-bookshop --namespace ${NAMESPACE}
	rm -rf bookshop