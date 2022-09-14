package com.sap.sample.ldap.connectivity;

import javax.naming.ldap.LdapContext;
import javax.net.SocketFactory;
import java.io.IOException;
import java.net.InetAddress;
import java.net.Socket;
import java.net.UnknownHostException;

/**
 * Socket factory capable of creating sockets to LDAP on premise systems.
 * <br>
 * Class name of this socket factory can be specified as a value of property
 * <code>java.naming.ldap.factory.socket</code>
 * when establishing {@link LdapContext}.
 */
public class LdapOnPremiseSocketFactory extends SocketFactory {

	private static final ConnectivitySocketFactory connectivitySocketFactory = new LdapConnectivitySocketFactoryImpl();

	// Although not used anywhere explicitly, it is used via reflection from the Java JDK
	public static SocketFactory getDefault() {
		return new LdapOnPremiseSocketFactory();
	}

	@Override
	public Socket createSocket(String host, int port) throws IOException, UnknownHostException {
		return connectivitySocketFactory.createConnectivitySocket(host, port);
	}

	@Override
	public Socket createSocket(String host, int port, InetAddress localHost, int localPort) throws IOException, UnknownHostException {
		return connectivitySocketFactory.createConnectivitySocket(host, port);
	}

	@Override
	public Socket createSocket(InetAddress host, int port) throws IOException {
		return connectivitySocketFactory.createConnectivitySocket(host.toString(), port);
	}

	@Override
	public Socket createSocket(InetAddress address, int port, InetAddress localAddress, int localPort) throws IOException {
		return connectivitySocketFactory.createConnectivitySocket(address.toString(), port);
	}
}
