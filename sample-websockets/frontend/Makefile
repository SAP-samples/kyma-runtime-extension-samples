DOCKER_ACCOUNT?=gabbi
APP?=sample-kyma-websocket-frontend
VERSION?=0.0.3
IMG=${DOCKER_ACCOUNT}/${APP}:${VERSION}
CHANGE?="TBD"

build-image:
	docker build -t $(IMG) --label "CHANGE=$(CHANGE)" .

push-image:
	docker push $(IMG)