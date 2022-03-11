DOCKER_ACCOUNT?=gabbi
APP?=approuter
VERSION?=0.0.1
IMG=${DOCKER_ACCOUNT}/${APP}:${VERSION}
CHANGE?="TBD"

build-image:
	docker build -t $(IMG) --label "CHANGE=$(CHANGE)" .

push-image:
	docker push $(IMG)