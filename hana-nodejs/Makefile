RELEASE=0.0.1
APP=hana-nodejs
DOCKER_ACCOUNT=sapsamples
CONTAINER_IMAGE=${DOCKER_ACCOUNT}/${APP}:${RELEASE}

.PHONY: build-image push-image

build-image:
	docker build -f docker/Dockerfile -t $(CONTAINER_IMAGE) --no-cache --rm .

push-image: build-image
	docker push $(CONTAINER_IMAGE)

docker-run:
	docker run -it -p 8080:7075 $(CONTAINER_IMAGE) 