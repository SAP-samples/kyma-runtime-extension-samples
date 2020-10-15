# Overview

## Steps

* Generate the maven project.

    ```shell script
    mvn archetype:generate "-DarchetypeGroupId=com.sap.cloud.sdk.archetypes" "-DarchetypeArtifactId=scp-cf-spring" "-DarchetypeVersion=RELEASE"
    ```

* Refer to [this documentation](https://sap.github.io/cloud-sdk/docs/java/features/odata/generate-typed-odata-v2-and-v4-client-for-java/) to do code generation for the OData APIs.
e.g. In this sample, I am generating the code for [SAP Marketing Cloud Campaign OData APIs](https://help.sap.com/viewer/0f9408e4921e4ba3bb4a7a1f75f837a7/1911.500/en-US/f2ae5a181b274befbb07183d2c4ac61a.html).
