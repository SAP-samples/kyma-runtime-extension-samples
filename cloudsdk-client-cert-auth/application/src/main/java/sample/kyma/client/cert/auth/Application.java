package sample.kyma.client.cert.auth;

import com.sap.cloud.sdk.cloudplatform.ScpCfCloudPlatform;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.ServletComponentScan;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.ComponentScan;

import java.nio.file.Paths;
import java.util.Optional;

@SpringBootApplication
@ComponentScan({"com.sap.cloud.sdk", "sample.kyma.client.cert.auth"})
@ServletComponentScan({"com.sap.cloud.sdk", "sample.kyma.client.cert.auth"})
public class Application extends SpringBootServletInitializer {
    @Override
    protected SpringApplicationBuilder configure(final SpringApplicationBuilder application) {
        return application.sources(Application.class);
    }

    public static void main(final String[] args) {
        String serviceBindingsRootLocation = Optional.ofNullable(
                        System.getenv("SERVICE_BINDINGS_ROOT_LOCATION"))
                .orElse("/etc/secrets/sapcp");

        ScpCfCloudPlatform
                .getInstanceOrThrow()
                .setServiceBindingsRootLocation(Paths.get(serviceBindingsRootLocation));
        SpringApplication.run(Application.class, args);
    }
}
