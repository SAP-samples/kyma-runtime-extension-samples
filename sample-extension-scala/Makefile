RELEASE?=0.0.1
APP?=sample-extension-scala
DOCKER_ACCOUNT?=gabbi
CONTAINER_IMAGE?=${DOCKER_ACCOUNT}/${APP}:${RELEASE}

clean:
	sbt clean

build: clean
	sbt compile

build-image: clean build
	sbt 'set version := "$(RELEASE)"' 'set name := "$(APP)"' docker:publishLocal
	docker tag $(APP):$(RELEASE) $(CONTAINER_IMAGE)

push-image:
	docker push $(CONTAINER_IMAGE)
