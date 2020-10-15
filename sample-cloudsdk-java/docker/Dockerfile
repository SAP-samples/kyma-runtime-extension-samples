FROM openjdk:11.0.7-jre-slim
MAINTAINER Gaurav Abbi <gaurav.abbi@sap.com>

WORKDIR /var/app

ADD sample-cloudsdk-java-*.jar /var/app/sample-cloudsdk-java.jar

ENV JAVA_OPTS=""

EXPOSE 8080

CMD java $JAVA_OPTS -jar /var/app/sample-cloudsdk-java.jar