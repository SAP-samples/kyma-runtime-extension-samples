RELEASE?=0.0.1
APP?=sample-extension-micronaut
DOCKER_ACCOUNT?=gabbi
CONTAINER_IMAGE?=${DOCKER_ACCOUNT}/${APP}:${RELEASE}

.PHONY: build build-image clean push-image all

all: clean build build-docker tag

clean:
	./gradlew clean
build:
	./gradlew -Pversion=$(RELEASE) -Pname=$(APP) clean build

build-image: build
	./gradlew dockerBuildNative

push-image: build-image
	docker push $(CONTAINER_IMAGE)