RELEASE=0.0.1
APP=dotnet6minimalapi
DOCKER_ACCOUNT=sapsamples
CONTAINER_IMAGE=${DOCKER_ACCOUNT}/${APP}:${RELEASE}

.PHONY: build-image push-image

build-image:
	docker build -t $(CONTAINER_IMAGE) --no-cache --rm .

build-and-push-image: build-image
	docker push $(CONTAINER_IMAGE)

push-image:
	docker push $(CONTAINER_IMAGE)

docker-run:
	docker run -p 5046:80 $(CONTAINER_IMAGE)