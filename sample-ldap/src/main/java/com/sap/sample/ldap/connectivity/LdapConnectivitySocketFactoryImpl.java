package com.sap.sample.ldap.connectivity;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.util.logging.Level;
import java.util.logging.Logger;

public class LdapConnectivitySocketFactoryImpl implements ConnectivitySocketFactory {

    private static final Logger LOGGER = Logger.getLogger(LdapConnectivitySocketFactoryImpl.class.getName());


    @Override
    public Socket createConnectivitySocket(String virtualHost, int virtualPort) throws IOException {


        Socket result = new ConnectivitySocket();

        try {
            result.connect(new InetSocketAddress(virtualHost, virtualPort));

            LOGGER.log(Level.INFO, "Successfully established connection for virtual host: {0} ", virtualHost);


            return result;
        } catch (IOException e) {
            String errorMessage = "Could not connect ConectivitySocket";
            LOGGER.log(Level.SEVERE, errorMessage, e);
            try {
                result.close();
            } catch (IOException ioe) {
                LOGGER.log(Level.SEVERE, "Could not close socket", ioe);
            }
            throw new IOException(errorMessage, e);
        }
    }
}
