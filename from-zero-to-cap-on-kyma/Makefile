DOCKER_ACCOUNT?=provide-as-env-var
NAMESPACE?=provide-as-env-var
CLUSTER_DOMAIN?=provide-as-env-var

APP_VERSION=0.0.2

HANA_DEPLOYER=bookshop-hana-deployer
HANA_DEPLOYER_IMAGE_REPO=${DOCKER_ACCOUNT}/${HANA_DEPLOYER}
HANA_DEPLOYER_IMAGE=${HANA_DEPLOYER_IMAGE_REPO}:${APP_VERSION}

CAP_SRV=bookshop-srv
CAP_SRV_IMAGE_REPO=${DOCKER_ACCOUNT}/${CAP_SRV}
CAP_SRV_IMAGE=${CAP_SRV_IMAGE_REPO}:${APP_VERSION}

init:
	cds init bookshop --add samples,nodejs

run-local:
	cds watch bookshop

add-hana:
	cd bookshop && cds add hana --for production && cd -

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

create-helm-chart:
	cd bookshop && cds add helm && cd -

deploy-dry-run:
	helm template cap-bookshop ./bookshop/chart --namespace ${NAMESPACE} \
    		--set hana-deployer.image.tag=${APP_VERSION} \
    		--set hana-deployer.image.repository=${HANA_DEPLOYER_IMAGE_REPO} \
    		--set srv.image.tag=${APP_VERSION} \
    		--set srv.image.repository=${CAP_SRV_IMAGE_REPO} \
    		--set global.domain=${CLUSTER_DOMAIN}

deploy:
	helm upgrade --install cap-bookshop ./bookshop/chart --namespace ${NAMESPACE} \
    		--set hana-deployer.image.tag=${APP_VERSION} \
    		--set hana-deployer.image.repository=${HANA_DEPLOYER_IMAGE_REPO} \
    		--set srv.image.tag=${APP_VERSION} \
    		--set srv.image.repository=${CAP_SRV_IMAGE_REPO} \
    		--set global.domain=${CLUSTER_DOMAIN}

check-pods:
	kubectl get po --namespace ${NAMESPACE}

undeploy:
	helm del cap-bookshop --namespace ${NAMESPACE}