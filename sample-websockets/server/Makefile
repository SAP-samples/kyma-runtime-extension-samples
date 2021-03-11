RELEASE?=0.0.1
APP?=sample-kyma-websocket-backend
DOCKER_ACCOUNT?=gabbi
CONTAINER_IMAGE?=${DOCKER_ACCOUNT}/${APP}:${RELEASE}

build-image:
	docker build -t $(CONTAINER_IMAGE) --no-cache --rm .

push-image: build-image
	docker push $(CONTAINER_IMAGE)