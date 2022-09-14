package com.sap.sample.ldap.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class AppConfig {
    @Value("${via.proxy}")
    private boolean viaProxy;

    public boolean isViaProxy() {
        return viaProxy;
    }

    public void setViaProxy(boolean viaProxy) {
        this.viaProxy = viaProxy;
    }
}
