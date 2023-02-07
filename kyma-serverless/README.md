# Power of serverless with SAP BTP, Kyma runtime.


## Description
This repository is dedicated to a recent series of SAP Community blog posts under a single theme of *Power of serverless with SAP BTP, Kyma runtime*, namely:  .  


  * [Base image override. | SAP Blogs](https://blogs.sap.com/2023/01/29/power-of-serverless-with-sap-btp-kyma-runtime.-base-image-override./)
  * [Secrets mounted as volumes. | SAP Blogs](https://blogs.sap.com/2023/02/06/power-of-serverless-with-sap-btp-kyma-runtime.-secrets-mounted-as-volumes./).
  * [Kyma functions with GitRepository source with SSH authentication. | SAP Blogs](https://blogs.sap.com/2021/12/08/kyma-functions-with-gitrepository-source-with-ssh-authentication./)


## Requirements and disclaimers

Please look up first the global [project](https://github.com/SAP-samples/kyma-runtime-extension-samples) pre-requisistes [here](https://github.com/SAP-samples/kyma-runtime-extension-samples/tree/main/prerequisites)


<table style="border-collapse: collapse; width: 100%;" border="1">
<tbody>
<tr>
<td style="width: 100%;">

Disclaimer:
<ul>
  <li>Images/data contained herein is from personal testbeds including my own SAP BTP Free Tier account. Any resemblance to real data is purely coincidental.</li>
  <li>Access to some online resources referenced in this repository may be subject to a contractual relationship with SAP and a S-user login may be required.</li>
</ul>
</td>
</tr>
</tbody>
</table>

## Download and Installation
It is recommended to use a SAP BTP Free Tier account as both SAP BTP. Kyma runtime and SAP HANA Cloud are available there as free tier services.  

  * In order to avoid incurring any unwanted charges, please always read the "small print" when provisioning services on your SAP BTP Free Tier account.  
  * You can follow the consumption of both free and paid services via [SAP for me](https://me.sap.com) portal.

As aforementioned, both Kyma and Gardener are available as open source projects. Please additionally consider the below if you wanted to follow this path.  


<table style="border-collapse: collapse; width: 100%;" border="1">
<tbody>
<tr>
<td style="width: 100%;"

  <strong>OS Kyma on Gardener</strong>:
  <ul>
    <li><a href="https://gardener.cloud/docs/gardener/#setting-up-your-own-gardener-landscape-in-the-cloud">bring your own gardener cluster</a> with:
  <ul>
    <li>the <a href="https://github.com/kyma-project/kyma/releases">latest release of open source kyma project</a> and</li>
    <li>the latest release of <a href="https://github.com/kyma-incubator/sap-btp-service-operator">SAP BTP service operator</a> from the kyma incubator <a href="https://github.com/kyma-incubator">project</a>.</li>
  </ul>
  </li>
    <li>have admin access to any SAP BTP sub-account where you have the BTP Service Manager entitlement with the <em>service-operator-access</em> service plan.</li>
  </ul>
</td>
</tr>
</tbody>
</table>



