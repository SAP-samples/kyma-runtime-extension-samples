RELEASE=0.0.1
APP=sample-event-trigger-java
DOCKER_ACCOUNT?=TBD
CONTAINER_IMAGE=${DOCKER_ACCOUNT}/${APP}:${RELEASE}
NAMESPACE?=dev

.PHONY: build build-docker clean tag push

all: clean build build-docker tag

clean:
	./gradlew clean
build:
	./gradlew -Pversion=$(RELEASE) -Pname=$(APP) clean build

build-image: clean build
	cp build/libs/$(APP)-$(RELEASE).jar docker
	docker build -t $(CONTAINER_IMAGE) --no-cache --rm docker
	rm docker/$(APP)-*.jar

push-image: build-image
	docker push $(CONTAINER_IMAGE)