package gabbi;

import javax.naming.Context;
import javax.naming.NamingEnumeration;
import javax.naming.NamingException;
import javax.naming.directory.*;
import java.util.Properties;

public class Sample {
    public static void main(String[] args) throws NamingException {
        DirContext context = getContext();
        String filter = "(&(objectClass=account)(uid=adam))";
        String[] attrIDs = { "uid", "objectClass" };
        SearchControls searchControls = new SearchControls();
        searchControls.setReturningAttributes(attrIDs);
        searchControls.setSearchScope(SearchControls.SUBTREE_SCOPE);
        NamingEnumeration<SearchResult> searchResults = context.search("ou=users,ou=system", filter, searchControls);
        if (searchResults.hasMore()){
            SearchResult result = searchResults.next();
            System.out.println(result.getAttributes());
        }
    }

    private static DirContext getContext() throws NamingException {
        Properties properties = new Properties();
        properties.put(Context.INITIAL_CONTEXT_FACTORY,"com.sun.jndi.ldap.LdapCtxFactory");
        properties.put(Context.PROVIDER_URL,"ldap://localhost:10389");
        properties.put(Context.SECURITY_AUTHENTICATION,"simple");
        properties.put(Context.SECURITY_PRINCIPAL,"uid=admin,ou=system");
        properties.put(Context.SECURITY_CREDENTIALS, "secret");
        return new InitialDirContext(properties);
    }
}
