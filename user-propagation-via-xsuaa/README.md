# Overview

![Flow](assets/identity-propagation-via-xsuaa.svg)

## Steps

* Create Destination Service instance
* Deploy c4c-extension
* Create xsuaa instance
* Deploy auth proxy
* Deploy httpbin.

    ```shell script
    kubectl -n identity-propagation-via-xsuaa apply -f https://raw.githubusercontent.com/istio/istio/master/samples/httpbin/httpbin.yaml
    ```

## To DO

* [ ] Put the modified angular app in this directory
* [ ] Update the proxy so that `/api` is not required in the path