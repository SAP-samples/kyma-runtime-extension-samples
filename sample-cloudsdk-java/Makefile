RELEASE?=0.0.1
APP?=sample-cloudsdk-java
DOCKER_ACCOUNT?=gabbi
CONTAINER_IMAGE?=${DOCKER_ACCOUNT}/${APP}:${RELEASE}

.PHONY: build build-image clean push-image all

all: clean build build-docker tag

clean:
	mvn clean
build:
	mvn clean install

build-image: clean build
	cp application/target/$(APP)-application.jar docker
	docker build -t $(CONTAINER_IMAGE) --no-cache --rm docker
	rm docker/$(APP)-*.jar

push-image: build-image
	docker push $(CONTAINER_IMAGE)