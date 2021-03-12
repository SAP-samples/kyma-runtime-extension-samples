RELEASE?=0.0.4
APP?=sample-kyma-websocket-server
DOCKER_ACCOUNT?=gabbi
CONTAINER_IMAGE?=${DOCKER_ACCOUNT}/${APP}:${RELEASE}

build-image:
	docker build -t $(CONTAINER_IMAGE) --no-cache --rm .

push-image:
	docker push $(CONTAINER_IMAGE)