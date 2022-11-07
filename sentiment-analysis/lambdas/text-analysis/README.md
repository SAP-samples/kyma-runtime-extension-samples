# text-analysis

This function provides an indication of the sentiment of the proviced text.  

Post the content as json `text`:
```
{"text": "I hate this product. It is rubbish.  Throw it in the garbage." }
```

Returns 
```
{
    "polarity": -0.8,
    "subjectivity": 0.9
}
```

`polarity`: float between -1 and 1 indicating the degree of **negative** or **positive** sentiment.

`subjectivity`: float between 0 and 1 indicating the degree of **subjectivity** of the text.

See [TextBlob](https://textblob.readthedocs.io/en/dev/quickstart.html#sentiment-analysis) sentiment analysis engine - for more details.

It uses the `python39` function runtime .  

[handler.py](handler.py) - Javscript source code for the function

[requirements.txt](package.json) - Dependencies for the function

[k8s/function.yaml](k8s/function.yaml) - `Function` configuration for the function
