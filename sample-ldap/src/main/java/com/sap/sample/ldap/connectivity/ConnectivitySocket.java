package com.sap.sample.ldap.connectivity;

import com.sap.sample.ldap.utils.ProxyUtils;

import java.io.*;
import java.net.*;
import java.nio.ByteBuffer;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;

public class ConnectivitySocket extends Socket {

    private static final Logger LOGGER = Logger.getLogger(ConnectivitySocket.class.getName());
    private static final String connectivityProxyHost = ProxyUtils.getProxyHost();
    private static final int connectivityProxyPort = ProxyUtils.getProxyPort();
    private final Properties connectionInfo;

    public ConnectivitySocket() {
        this.connectionInfo = new Properties();
    }

    @Override
    public void connect(SocketAddress endpoint, int timeout) throws IOException {
        InetSocketAddress connectivityProxyAddress = getConnectivityProxyAddress();
        LOGGER.log(Level.INFO, "Connectivity proxy endpoint is {0}", connectivityProxyAddress);


        super.connect(connectivityProxyAddress, timeout);

        // send handshake
        OutputStream outputStream = getOutputStream();

        byte[] connectionProperties = serializeRequestProperties((InetSocketAddress) endpoint);

        outputStream.write(ByteBuffer.allocate(4).putInt(connectionProperties.length).array());
        outputStream.write(connectionProperties);
        outputStream.flush();

        InputStream inputStream = getInputStream();
        int returnCode = inputStream.read();
        switch (returnCode) {
            case ConnectivitySocketConstants.OK:
                LOGGER.log(Level.INFO, "Connection has been established successfully.");
                return;
            case ConnectivitySocketConstants.OK_INFO:
                readConnectionInfo(inputStream);
                return;
            case ConnectivitySocketConstants.ERROR_DURING_HANDSHAKE:
                throw new HandshakeFailedException("Error during handshake with connectivity proxy. Returned status code: " + returnCode);
            default:
                throw new ConnectException("Unexpected error while connecting to connectivity proxy: " + returnCode);
        }
    }

    private void readConnectionInfo(InputStream inputStream) throws IOException {
        int connectionInfoLen = inputStream.read();
        if (connectionInfoLen > 0) {
            byte[] connectionInfoBytes = new byte[connectionInfoLen];
            int readLen = inputStream.read(connectionInfoBytes);
            if (readLen != connectionInfoLen) {
                throw new IllegalStateException("Connection info cannot be read successfully");
            }
            try {
                connectionInfo.load(new ByteArrayInputStream(connectionInfoBytes));
                LOGGER.log(Level.INFO, "Additional connection info was successfully read {0}", connectionInfo);
            } catch (IllegalArgumentException ex) {
                throw new IllegalStateException("Malformed connection info", ex);
            }
        }
    }

    private byte[] serializeRequestProperties(InetSocketAddress endpointInetAddress) throws IOException {
        try (ByteArrayOutputStream byteArraysStream = new ByteArrayOutputStream()) {
            Properties properties = new Properties();
            properties.put(ConnectivitySocketConstants.PROPERTY_HOSTNAME, endpointInetAddress.getHostName());
            properties.put(ConnectivitySocketConstants.PROPERTY_PORT, Integer.toString(endpointInetAddress.getPort()));
            properties.put(ConnectivitySocketConstants.PROPERTY_CONNECTION_PROTOCOL, ConnectivitySocketConstants.PROTOCOL);
            properties.put(ConnectivitySocketConstants.PROPERTY_REQUEST_CONNECTION_INFO, Boolean.toString(Boolean.TRUE));

            properties.store(byteArraysStream, null);
            return byteArraysStream.toByteArray();
        }
    }

    private InetSocketAddress getConnectivityProxyAddress() {
        try {
            InetSocketAddress inetSocketAddress = new InetSocketAddress(
                    InetAddress.getByName(connectivityProxyHost), connectivityProxyPort
            );
            LOGGER.log(Level.INFO, "Create InetSocketAddress for connectivity proxy {0}", inetSocketAddress);
            return inetSocketAddress;
        } catch (UnknownHostException e) {
            throw new IllegalStateException("Unable to get connectivity proxy address", e);
        }
    }
}
