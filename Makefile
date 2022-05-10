JAVA_DIRS = sample-extension-java sample-event-trigger-java cloudsdk-client-cert-auth

build-java-projects: $(JAVA_DIRS)

$(JAVA_DIRS):
	@echo "Building Java projects..."
	$(MAKE) -C $@ build

.PHONY: $(JAVA_DIRS) build-java-projects