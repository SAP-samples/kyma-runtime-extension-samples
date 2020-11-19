RELEASE?=0.0.4
APP?=c4c-extension-with-user-context
GOOS?=linux
GOARCH?=amd64
CONTAINER_IMAGE?=gabbi/${APP}:${RELEASE}
CHANGE?="TBD"

clean:
	rm -rf ${APP}

vet:
	GO111MODULE=on go vet .

test:
	GO111MODULE=on go test -v -race ./...

build: clean vet test
	GO111MODULE=on CGO_ENABLED=0 GOARCH=${GOARCH} go build \
		-ldflags "-s -w" \
		-o ${APP}

build-image: build
	docker build -t $(CONTAINER_IMAGE) --label "CHANGE=$(CHANGE)" .

push-image:
	docker push $(CONTAINER_IMAGE)

tidy:
	GO111MODULE=on go mod tidy
