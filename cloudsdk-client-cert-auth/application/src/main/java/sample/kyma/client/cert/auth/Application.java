package sample.kyma.client.cert.auth;

import com.sap.cloud.sdk.cloudplatform.ScpCfCloudPlatform;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.ServletComponentScan;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.ComponentScan;

import java.nio.file.Paths;

@SpringBootApplication
@ComponentScan({"com.sap.cloud.sdk", "sample.kyma.client.cert.auth"})
@ServletComponentScan({"com.sap.cloud.sdk", "sample.kyma.client.cert.auth"})
public class Application extends SpringBootServletInitializer {
    @Override
    protected SpringApplicationBuilder configure(final SpringApplicationBuilder application) {
        return application.sources(Application.class);
    }

    public static void main(final String[] args) {
        ScpCfCloudPlatform
                .getInstanceOrThrow()
                .setServiceBindingsRootLocation(Paths.get("/etc/secrets/sapcp"));
        SpringApplication.run(Application.class, args);
    }
}
