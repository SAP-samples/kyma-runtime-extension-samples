package com.sap.sample.ldap.connectivity;

/**
 * Some constants for the socket communication.
 */
public interface ConnectivitySocketConstants {

	public static final String PROTOCOL = "LDAP";

	/**
	 * OK response from the proxy - connection has been established successfully
	 */
	byte OK = 0;

	/**
	 * OK_INFO response from the proxy - connection has been established successfully
	 * and additional connection info is available for reading
	 */
	byte OK_INFO = 2;

	/**
	 * There was an error during the handshake with the connectivity agent proxy
	 */
	byte ERROR_DURING_HANDSHAKE = 1;

	/**
	 * The name of the property which holds the virtual host
	 */
	String PROPERTY_HOSTNAME = "hostname";

	/**
	 * The name of the property which holds the virtual port
	 */
	String PROPERTY_PORT = "port";

	/**
	 * The name of the property which holds the connection protocol
	 */
	String PROPERTY_CONNECTION_PROTOCOL = "connectionProtocol";

	/**
	 * Requests additional connection info upon successful connection
	 */
	String PROPERTY_REQUEST_CONNECTION_INFO = "requestConnectionInfo";

}
