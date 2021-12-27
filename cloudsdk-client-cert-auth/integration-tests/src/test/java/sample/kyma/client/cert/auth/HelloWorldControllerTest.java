//package sample.kyma.client.cert.auth;
//
//import java.nio.charset.StandardCharsets;
//import java.io.InputStream;
//import org.apache.commons.io.IOUtils;
//// import org.apache.http.HttpHeaders;
//import org.junit.BeforeClass;
//// import org.junit.ClassRule;
//import org.junit.Test;
//import org.junit.runner.RunWith;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
//import org.springframework.boot.test.context.SpringBootTest;
//// import org.springframework.test.context.TestPropertySource;
//import org.springframework.test.context.TestPropertySource;
//import org.springframework.test.context.junit4.SpringRunner;
//import org.springframework.test.web.servlet.MockMvc;
//import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
//
//import com.sap.cloud.sdk.cloudplatform.thread.ThreadContextExecutor;
//import com.sap.cloud.sdk.testutil.MockUtil;
//// import com.sap.cloud.security.config.Service;
//// import com.sap.cloud.security.test.SecurityTestRule;
//// import com.sap.cloud.security.token.TokenClaims;
//
//import static java.lang.Thread.currentThread;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
//
//@RunWith(SpringRunner.class)
//@SpringBootTest
//@AutoConfigureMockMvc
//@TestPropertySource(properties = {"xsuaa.uaadomain=localhost", "xsuaa.xsappname=xsapp!t0815", "xsuaa.clientid=sb-clientId!t0815"})
//public class HelloWorldControllerTest
//{
//    private static final MockUtil mockUtil = new MockUtil();
//
//    @Autowired
//    private MockMvc mvc;
//
//    /*
//    @ClassRule
//    public static final SecurityTestRule rule = SecurityTestRule.getInstance(Service.XSUAA);
//    private static String jwt;
//    */
//
//    @BeforeClass
//    public static void beforeClass()
//    {
//        mockUtil.mockDefaults();
//        /*
//        jwt = rule.getPreconfiguredJwtGenerator()
//                .withLocalScopes("Display")
//                //.withClaimValue(TokenClaims.XSUAA.ORIGIN, "sap-default") // optional
//                //.withClaimValue(TokenClaims.USER_NAME, "John") // optional
//                .createToken().getTokenValue();
//        jwt = "Bearer " + jwt;
//        */
//    }
//
//    @Test
//    public void test() throws Exception
//    {
//        final InputStream inputStream = currentThread().getContextClassLoader().getResourceAsStream("expected.json");
//
//        new ThreadContextExecutor().execute(() -> {
//            mvc.perform(MockMvcRequestBuilders.get("/hello")
//                    //.header(HttpHeaders.AUTHORIZATION, jwt)
//                    )
//                    .andExpect(status().isOk())
//                    .andExpect(content().json(
//                            IOUtils.toString(inputStream, StandardCharsets.UTF_8)));
//        });
//    }
//}
