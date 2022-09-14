package com.sap.sample.ldap.utils;

import com.sap.sample.ldap.connectivity.LdapOnPremiseSocketFactory;

import static com.sap.sample.ldap.utils.EnvironmentUtils.getEnvironmentVariable;

public class LdapUtils {
    public static final String INITIAL_CONTEXT_FACTORY = "com.sun.jndi.ldap.LdapCtxFactory";
    public static final String LDAP_ON_PREM_SOCKET_FACTORY = LdapOnPremiseSocketFactory.class.getName();

    public static String[] ATTR_IDS = {"uid", "objectClass"};

    public static String getSearchContext() {
        return getEnvironmentVariable("SEARCH_CONTEXT")
                .orElseThrow(() -> new IllegalArgumentException("No search context specified"));
    }

    public static String getSecurityAuthentication() {
        return getEnvironmentVariable("SECURITY_AUTHENTICATION")
                .orElseThrow(() -> new IllegalArgumentException("No Security authentication specified"));
    }

    public static String getSecurityPrincipal() {
        return getEnvironmentVariable("SECURITY_PRINCIPAL")
                .orElseThrow(() -> new IllegalArgumentException("No security principal specified"));
    }

    public static String getSecurityCredential() {
        return getEnvironmentVariable("SECURITY_CREDENTIALS")
                .orElseThrow(() -> new IllegalArgumentException("No security credentials specified"));
    }

    public static String getLDAPUrl() {
        return getEnvironmentVariable("LDAP_URL")
                .orElseThrow(() -> new IllegalArgumentException("No LDAP URL specified"));
    }
}
