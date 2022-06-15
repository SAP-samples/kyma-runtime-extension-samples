DOCKER_ACCOUNT?=gabbi
APP?=kyma-identity-propagation-spa
VERSION?=0.0.5
IMG=${DOCKER_ACCOUNT}/${APP}:${VERSION}
CHANGE?="TBD"

build-image:
	docker build -t $(IMG) --label "CHANGE=$(CHANGE)" .

push-image:
	docker push $(IMG)