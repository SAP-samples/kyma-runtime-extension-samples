FROM openjdk:11.0.7-jre-slim
MAINTAINER Gaurav Abbi <gaurav.abbi@sap.com>

WORKDIR /var/app

ADD cloudsdk-client-cert-auth-*.jar /var/app/cloudsdk-client-cert-auth.jar

ENV JAVA_OPTS=""

EXPOSE 8080

CMD java $JAVA_OPTS -jar /var/app/cloudsdk-client-cert-auth.jar