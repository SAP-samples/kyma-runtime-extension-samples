DOCKER_ACCOUNT?=gabbi
APP?=kyma-identity-propagation-spa
VERSION?=0.0.2
IMG=${DOCKER_ACCOUNT}/${APP}:${VERSION}

build-image:
	docker build -t $(IMG) .

push-image:
	docker push $(IMG)