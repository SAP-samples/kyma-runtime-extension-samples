RELEASE?=0.0.4
APP?=sample-ldap
DOCKER_ACCOUNT?=gabbi
CONTAINER_IMAGE?=${DOCKER_ACCOUNT}/${APP}:${RELEASE}
CHANGE?="TBD"

.PHONY: build build-image clean push-image all

all: clean build build-image push-image

clean:
	./gradlew clean
build:
	./gradlew -Pversion=$(RELEASE) -Pname=$(APP) clean build

build-image: clean build
	cp build/libs/$(APP)-$(RELEASE).jar docker
	docker build -t $(CONTAINER_IMAGE) --label "CHANGE=$(CHANGE)" --no-cache --rm docker
	rm docker/$(APP)-*.jar

push-image:
	docker push $(CONTAINER_IMAGE)