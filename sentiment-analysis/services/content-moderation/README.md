# Content Moderation Service

## Overview

A python based microservice to analyze text content for appropriateness.  It uses python library [alt-profanity-check](https://pypi.org/project/alt-profanity-check/) which is based on this [machine learning model](https://victorzhou.com/blog/better-profanity-detection-with-scikit-learn/)

## Usage
Post the content as json `text`:
```
{"text": "I hate this product. It is rubbish.  Throw it in the garbage." }
```

Returns:

```
  {
    "inappropriate": 1, 
    "probability": 0.981441261984967
  }
```  

`inappropriate`: 1 if true, 0 if false

`probability`: float - higher value is more inappropriate

## Build
Build the image, then push to Dockerhub:

`docker build --platform amd64 --pull --rm -f "Dockerfile" -t <dockerhub-id>/content-moderation:latest`

`docker push <dockerhub-id>/content-moderation:latest`

## Deploy
The [k8s](k8s) directory contains the yaml file with the `Deployment` and `Service` configuration. Apply the configuration as follows:


* Set up environment variables

  * OSX

    ```shell script
    export NS={your-namespace}
    ```

  * Windows PowerShell

    ```powershell
    $NS={your-namespace}
    ```


`kubectl apply -n $NS -f k8s/content-moderation.yaml`

## Verify

The API is available within the namespace in the Kyma cluster via the URL 

http://content-moderation

Send a POST request with the payload described above in **Usage**

## Resources

[alt-profanity-check](https://pypi.org/project/alt-profanity-check/)

[Background Blog Post](https://victorzhou.com/blog/better-profanity-detection-with-scikit-learn/)

[TextBlob](https://textblob.readthedocs.io/en/dev/quickstart.html#sentiment-analysis) sentiment analysis engine

## Project setup information

[VS Code Python Tutorial](https://code.visualstudio.com/docs/python/python-tutorial)

[Python Quickstart with Flask](https://code.visualstudio.com/docs/containers/quickstart-python)