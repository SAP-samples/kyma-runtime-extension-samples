package com.sap.sample.ldap.services;

import com.sap.sample.ldap.config.AppConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.naming.Context;
import javax.naming.NamingEnumeration;
import javax.naming.NamingException;
import javax.naming.directory.DirContext;
import javax.naming.directory.InitialDirContext;
import javax.naming.directory.SearchControls;
import javax.naming.directory.SearchResult;
import java.util.Properties;

import static com.sap.sample.ldap.utils.LdapUtils.*;

@Component
public class LdapService {
    private final DirContext context;

    @Autowired
    public LdapService(AppConfig appConfig) throws NamingException {
        context = getContext(appConfig.isViaProxy());
    }

    public String SearchUser(String userName) throws NamingException {
        String filter = "(&(objectClass=account)(uid=" + userName + "))";

        SearchControls searchControls = new SearchControls();
        searchControls.setReturningAttributes(ATTR_IDS);
        searchControls.setSearchScope(SearchControls.SUBTREE_SCOPE);

        NamingEnumeration<SearchResult> searchResults = context.search(getSearchContext(), filter, searchControls);
        if (searchResults.hasMore()) {
            SearchResult result = searchResults.next();
            return result.toString();
        }
        return "";
    }

    private static DirContext getContext(boolean viaProxy) throws NamingException {
        Properties properties = new Properties();
        properties.put(Context.INITIAL_CONTEXT_FACTORY, INITIAL_CONTEXT_FACTORY);
        if (viaProxy) {
            properties.put("java.naming.ldap.factory.socket", LDAP_ON_PREM_SOCKET_FACTORY);
        }
        properties.put(Context.PROVIDER_URL, getLDAPUrl());
        properties.put(Context.SECURITY_AUTHENTICATION, getSecurityAuthentication());
        properties.put(Context.SECURITY_PRINCIPAL, getSecurityPrincipal());
        properties.put(Context.SECURITY_CREDENTIALS, getSecurityCredential());
        return new InitialDirContext(properties);
    }
}
