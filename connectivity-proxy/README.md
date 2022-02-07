## SAP Connectivity Proxy

### Enable the Connectivity Service Entitlment

- Within your global account…
- Choose Entitlements -> Entity Assignments
- Search for Connectivity Service
- Choose connectivity_proxy
- Choose Save

### Provision the Service in the Kyma Runtime

- Within your desired namespace
- Choose Service Management -> Catalog
- Search for Connectivity
- Choose the tile
- Choose Add
- Choose Create

### Starting the localmock application

- Run the command
  ```
  npm install
  ```
- Start the application
  ```
  npm start
  ```

### SAP Cloud Connector Configuration

- In the SAP Cloud Connector, establish a connection to the localmock app

  - Open the Cloud Connector: https://localhost:8443/
  - Choose the appropiate Subaccount or add an additional one by...
    - Choose Add Subaccount
    - Choose your Region
    - Provide your Subaccount ID
    - Provide your Subaccount User and Password
    - Choose Save
    - Verify that the subaccount is connected. Under the Actions column use the Connect this sub account option
  - Choose **Cloud To On-Premise**
  - Under **ACCESS CONTROL** choose the **plus** button to add a system
    - Choose the Back-end Type **Non-SAP System**, choose Next
    - Choose the Protocol **HTTP**, choose Next
    - Enter the Internal Host **localhost**
    - Enter the Internal Port **3000**, choose Next
    - Enter the Virtual Host **localhost**
    - Enter the Virtual Port **3000**, choose Next
    - Choose the Principle Type **None**, choose Next
    - Choose Next
    - Choose Next
    - Choose the option to **Check Internal Host**, choose Finish
  - Under **Resources Of localmock:3000** choose the **plus** button to add a resource
    - Enter the URL Path **/**
    - Choose the Access Policy **Path And All Sub-Paths**
    - Choose Save

### Deploy The Sample

    - Deploy the sample function/apirule
    - Open the function and choose Configuration
    - Choose Create Service Binding
