
ARG SAPJVM_IMAGE=sapmachine:21-jre-ubuntu
ARG SAPCC_VERSION=2.17.2

FROM rockylinux:9 AS build
ARG SAPCC_VERSION

WORKDIR /tmp/sccdl

RUN curl -H "Cookie: eula_3_2_agreed=tools.hana.ondemand.com/developer-license-3_2.txt; path=/;" \
  "https://tools.hana.ondemand.com/additional/sapcc-$SAPCC_VERSION-linux-x64.tar.gz" \
  --output - | \
  tar -xzvf - 


FROM $SAPJVM_IMAGE AS final
ARG SAPCC_VERSION

LABEL version="0.2"
LABEL org.opencontainers.image.authors="remi.astier@sap.com"
LABEL org.opencontainers.image.licenses="Cloud Connector: SAP DEVELOPER LICENSE AGREEMENT. See LICENSE-SAP.txt\nSAP Machine openJDK: GNU GPL LICENSE. See LICENSE-GNU.txt"

RUN apt-get update && \
  apt-get install -y --no-install-recommends lsof && \
  rm -rf /var/lib/apt/lists/*

RUN groupadd -g 5000 sccgroup && \
    useradd -m -u 5000 -g 5000 sccadmin && \
    mkdir -p /opt/sap/scc && \
    chown -R sccadmin:sccgroup /opt/sap
    

COPY --chown=sccadmin:sccgroup --from=build /tmp/sccdl /opt/sap/scc
USER sccadmin
WORKDIR /opt/sap/scc

# expose connector server
EXPOSE 8443

# finally run sapcc as PID 1
ENTRYPOINT [ "./go.sh" ]
