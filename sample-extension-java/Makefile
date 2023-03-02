RELEASE?=0.0.22
APP?=sample-extension-java
DOCKER_ACCOUNT?=gauravsap
CONTAINER_IMAGE?=${DOCKER_ACCOUNT}/${APP}:${RELEASE}
NAMESPACE?=dev

.PHONY: build build-image clean push-image all

all: clean build build-image push-image

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

update-gradle-version:
	./gradlew wrapper --gradle-version $(version)