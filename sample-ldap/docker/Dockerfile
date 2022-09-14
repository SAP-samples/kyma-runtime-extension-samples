FROM openjdk:18-slim-bullseye
MAINTAINER Gaurav Abbi <gaurav.abbi@sap.com>

WORKDIR /var/app

ADD sample-ldap-*.jar /var/app/sample-ldap.jar

ENV JAVA_OPTS=""

EXPOSE 8080

CMD java $JAVA_OPTS -jar /var/app/sample-ldap.jar