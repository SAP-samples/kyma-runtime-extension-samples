RELEASE?=0.0.1
APP?=sample-extension-scala
DOCKER_ACCOUNT?=gabbi
CONTAINER_IMAGE?=${DOCKER_ACCOUNT}/${APP}:${RELEASE}
NAMESPACE?=dev

clean:
	sbt clean

build: clean
	sbt compile

build-image: clean compile
	sbt 'set version := "$(RELEASE)"' 'set name := "$(APP)"' docker:publishLocal
	docker tag $(APP):$(RELEASE) $(CONTAINER_IMAGE)

push-image:
	docker push $(CONTAINER_IMAGE)

create-service:
	kubectl -n $(NAMESPACE) create deployment $(APP) --image=$(CONTAINER_IMAGE) --dry-run -o yaml > deployment/deployment-ohne-port.yaml
	kubectl patch -f ./deployment/deployment-ohne-port.yaml -p '{"spec": {"template" :{"spec":{"containers":[{"name": "$(APP)", "ports":[{"containerPort": 8080}]}]}}}}' --dry-run  -o yaml > deployment/deployment.yaml
	kubectl expose -f deployment/deployment.yaml --type=ClusterIP --dry-run -o yaml > deployment/service.yaml
	rm deployment/deployment-ohne-port.yaml

expose-service:
	../../../scripts/create-api.sh "./deployment/api.yaml" $(APP) $(NAMESPACE)
