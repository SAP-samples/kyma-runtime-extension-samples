package com.sap.sample.ldap.connectivity;

import java.io.IOException;
import java.net.Socket;

/**
 * Socket factory capable of creating Sockets to on premise systems.
 */
public interface ConnectivitySocketFactory {

	public Socket createConnectivitySocket(String virtualHost, int virtualPort) throws IOException;
}
