RELEASE?=0.0.1
APP?=update-bot
DOCKER_ACCOUNT?=gauravsap
CONTAINER_IMAGE?=${DOCKER_ACCOUNT}/${APP}:${RELEASE}

build-image:
	 docker build -t $(CONTAINER_IMAGE) -f docker/Dockerfile .

push-image:
	docker push $(CONTAINER_IMAGE)