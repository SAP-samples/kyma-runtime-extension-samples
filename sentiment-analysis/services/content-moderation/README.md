# Content Moderation Service

A python based microservice to analyze text content for appropriateness.  It uses python library [alt-profanity-check](https://pypi.org/project/alt-profanity-check/) which based on this [machine learning model](https://victorzhou.com/blog/better-profanity-detection-with-scikit-learn/)

## Usage
Post the content as json `text`:
```
{"text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." }
```

Returns:

```
  {
    "inappropriate": 1, 
    "probability": 0.8899214457938968
  }
```  

`inappropriate`: 1 if true, 0 if false

`probability`: float - higher value is more inappropriate

## Build
Build the image, then push to Dockerhub:

`docker build --platform amd64 --pull --rm -f "Dockerfile" -t <dockerhub-id>/content-moderation:latest`

`docker push <dockerhub-id>/content-moderation:latest`

## Deployment
The [k8s](k8s) directory contains the yaml file with the `Deployment` and `Service` configuration. Apply the configuration as follows:

`kubectl apply -n <your namespace> -f k8s/content-moderation.yaml`

## Resources

[alt-profanity-check](https://pypi.org/project/alt-profanity-check/)

[Background Blog Post](https://victorzhou.com/blog/better-profanity-detection-with-scikit-learn/)

[TextBlob](https://textblob.readthedocs.io/en/dev/quickstart.html#sentiment-analysis) sentiment analysis engine

## Project setup information

[VS Code Python Tutorial](https://code.visualstudio.com/docs/python/python-tutorial)

[Python Quickstart with Flask](https://code.visualstudio.com/docs/containers/quickstart-python)