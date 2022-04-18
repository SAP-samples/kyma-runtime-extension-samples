#Build SAP Cloud Connector image
FROM bitnami/java:11-debian-10

ENV TOOLS_URL=tools.hana.ondemand.com
ENV OS_VERSION=linux-x64
ENV CLOUD_CONNECTOR_VERSION=2.14.1

WORKDIR /usr/sapcc

RUN mkdir -p /home/sapcc \
    && curl --fail --silent --location --cookie eula_3_1_agreed="$TOOLS_URL/developer-license-3_1.txt" \
    --url "https://$TOOLS_URL/additional/sapcc-$CLOUD_CONNECTOR_VERSION-$OS_VERSION.tar.gz" \
    | tar -xzf - -C /home/sapcc

RUN apt update && \
    apt install lsof && \
    apt install nano 

EXPOSE 8443/tcp