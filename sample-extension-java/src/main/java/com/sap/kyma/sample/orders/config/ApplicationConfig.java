package com.sap.kyma.sample.orders.config;

import org.apache.logging.log4j.util.Strings;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class ApplicationConfig {

    @Value("${application.cluster.domain}")
    private String clusterDomain;
    @Value("${application.subdomain}")
    private String subdomain;
    @Value("${application.is.secure}")
    private boolean isSecure;

    public void setClusterDomain(String clusterDomain) {
        this.clusterDomain = clusterDomain;
    }

    public void setSubdomain(String subdomain) {
        this.subdomain = subdomain;
    }

    public void setSecure(boolean secure) {
        isSecure = secure;
    }

    public String getAppURL() {
        return (isSecure ? "https://" : "http://") +
                (Strings.isEmpty(this.subdomain) ? "" : this.subdomain + ".") +
                this.clusterDomain;
    }
}
