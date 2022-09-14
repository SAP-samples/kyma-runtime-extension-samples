package com.sap.sample.ldap.utils;

public class ProxyUtils {
    private static final int DEFAULT_LDAP_PROXY_PORT = 20001;
    public static final String DEFAULT_PROXY_HOST = "connectivity-proxy.kyma-system.svc.cluster.local";

    public static String getProxyHost() {
        return EnvironmentUtils.getEnvironmentVariable("PROXY_HOST")
                .orElse(DEFAULT_PROXY_HOST);
    }

    public static int getProxyPort() {
        return EnvironmentUtils.getEnvironmentVariable("PROXY_PORT")
                .map(Integer::parseInt)
                .orElse(DEFAULT_LDAP_PROXY_PORT);
    }
}
