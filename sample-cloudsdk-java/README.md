# Overview

This blog describes steps and configurations to build and deploy microservice based extensions on SAP Cloud Platform, Kyma runtime using SAP Cloud SKD for Java. 

The microservice makes API calls to a S/4 System to do various read/write operations based on the extension logic. The microservice itself can be triggered via an event or an API call. In this example, we will trigger it via an API call by exposing it through Microgateway in Kyma runtime (API rules).

To set up, api-access, please refer to `api access` section in [this blog](https://blogs.sap.com/2020/09/30/use-sap-cloud-platform-kyma-runtime-to-extend-sap-marketing-cloud/).

![config](assets/s4hana-api-config.png)

Post setup, we should be able to build a microservice that will call the S/4 System using `SAP Cloud SDK for Java`.

![runtime](assets/s4hana-api-runtime.png)

## Steps

* Generate the maven project.

    ```shell script
    mvn archetype:generate "-DarchetypeGroupId=com.sap.cloud.sdk.archetypes" "-DarchetypeArtifactId=scp-cf-spring" "-DarchetypeVersion=RELEASE"
    ```

* Refer to [this documentation](https://sap.github.io/cloud-sdk/docs/java/features/odata/generate-typed-odata-v2-and-v4-client-for-java/) to perform code generation for the OData APIs.
e.g. In this sample, I am generating the code for [SAP Marketing Cloud Campaign OData APIs](https://help.sap.com/viewer/0f9408e4921e4ba3bb4a7a1f75f837a7/1911.500/en-US/f2ae5a181b274befbb07183d2c4ac61a.html) using the [metadata file](application/edmx/campaigns.xml).

* Implement the code to make API calls using the generated services.

    ```java
    @RestController
    @RequestMapping("/campaigns")
    public class CampaignController {
        private final DefaultErpHttpDestination destination;
        private final DefaultCampaignsService campaignsService;
    
        @Autowired
        public CampaignController(ApplicationConfig applicationConfig) {
            this.destination = DestinationAccessor
                    .getDestination(applicationConfig.getTenantName())
                    .asHttp()
                    .decorate(DefaultErpHttpDestination::new);
            this.campaignsService = new DefaultCampaignsService()
                    .withServicePath(applicationConfig.getServicePath());
        }
    
        @RequestMapping(method = RequestMethod.GET)
        public List<Campaign> getCampaigns() {
    
            return this.campaignsService
                    .getAllCampaign()
                    .top(2)
                    .select(
                            Campaign.CAMPAIGN_ID,
                            Campaign.NODE_ID,
                            Campaign.CATEGORY_NAME
                    )
                    .executeRequest(this.destination);
        }
    }
    ```
* Build the image

    ```shell script
    DOCKER_ACCOUNT={your-docker-repo} make push-image
    ```

* Service Instance and credentials for access
    
    Following the [blog](https://blogs.sap.com/2020/09/30/use-sap-cloud-platform-kyma-runtime-to-extend-sap-marketing-cloud/), you should be able to create a Service instance of plan type `api-access` for your S/4 System.
    * Create the credentials if not already created.
    ![service-instance-cred](assets/service-instance-cred.png)
    * These credentials will be injected as environment variables to the microservcie when we will do the service binding.

* Deploy the application on the Kyma runtime
    
    Since cloudsdk relies on environment variable of the form `destinations:[{array of destinations}]`, we use a kubernetes deployment trick of referencing pre-defined variables such as `User`, `Password` and `url` to create such a variable. 
    
    These predefined will be injected automatically when we do a `Service Binding` with this deployment.  
    
    ```yaml
    env:
      - name: destinations
        value: '[{name: "$(APPLICATION_TENANT_NAME)", url: "$(URL)", username: "$(User)", password: "$(Password)"}]'
    ```
    You can refer to the full [deployment definition](k8s/deployment.yaml).

    ```shell script
    kubectl -n {Namespace To Deploy} apply -f k8s/deployment.yaml
    ```

* Bind the deployment with the service instance. You can either reuse the existing credentials or create a new one. 
    ![bind](assets/bind-instance.png)

* Verify the deployment is running fine by checking the logs.

    ```shell script
    kubectl -n {Namespace To Deploy} logs -l app=sample-cloudsdk-java -c sample-cloudsdk-java
    ```

* Expose the application via api-rule.

    ```shell script
    kubectl -n {Namespace To Deploy} apply -f k8s/api-rule.yaml
    ```
## Test

Call the API to get top 2 campaigns at <https://sample-cloudsdk-java.{cluster-domain}/campaigns>
