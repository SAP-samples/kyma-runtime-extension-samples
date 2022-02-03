FROM openjdk:17-alpine
MAINTAINER Gaurav Abbi <gaurav.abbi@sap.com>

WORKDIR /var/app

ADD sample-extension-java-*.jar /var/app/sample-extension-java.jar

ENV JAVA_OPTS=""

EXPOSE 8080

CMD java $JAVA_OPTS -jar /var/app/sample-extension-java.jar