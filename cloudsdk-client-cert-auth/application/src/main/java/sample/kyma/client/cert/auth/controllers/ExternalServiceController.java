package sample.kyma.client.cert.auth.controllers;

import com.sap.cloud.sdk.cloudplatform.connectivity.DestinationAccessor;
import com.sap.cloud.sdk.cloudplatform.connectivity.HttpClientAccessor;
import com.sap.cloud.sdk.cloudplatform.connectivity.HttpDestination;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import sample.kyma.client.cert.auth.config.AppConfig;
import sample.kyma.client.cert.auth.models.HelloWorldResponse;

import java.io.IOException;

@Controller
@RequestMapping("/external")
public class ExternalServiceController {
    private final HttpClient httpClient;
    private final String externalServiceUrl;

    @Autowired
    public ExternalServiceController(AppConfig appConfig) {
        HttpDestination httpDestination = DestinationAccessor
                .getDestination(appConfig.getDestinationName())
                .asHttp();
        this.httpClient = HttpClientAccessor.getHttpClient(httpDestination);
        this.externalServiceUrl = appConfig.getExternalServiceUrl();
    }

    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<HelloWorldResponse> call() {
        HttpGet httpGet = new HttpGet(externalServiceUrl);
        try {
            HttpResponse response = httpClient.execute(httpGet);
            System.out.println(response.getStatusLine().getStatusCode());
            System.out.println(response);
            return ResponseEntity.ok(new HelloWorldResponse(
                    "response from " + httpGet.getURI() + ":" + response));
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.ok(new HelloWorldResponse("error: " + e.getMessage()));
        }
    }
}
