from textblob import TextBlob
#from profanity_check import predict, predict_prob
import json

# Return a tuple of form (polarity, subjectivity ) where polarity is a float within the \n# range [-1.0, 1.0] and subjectivity is a float within the range [0.0, 1.0] 
# where 0.0 is very objective and 1.0 is very subjective

def main(event, context):

    # print(event['data']['text'])
    print('**** Request body: ') 
    print(event['extensions']['request'].json)
    print('**** Event Data')
    print (event['data'])
    print('**** Event text')
    print (event['data']['text'])
    print('**** Request: ') 
    print(event['extensions']['request'])
    if(event['extensions']['request'].method == "POST"):
        if (event['extensions']['request'].json):
            request_data = event['extensions']['request'].json
            if ("text" in request_data):
                testimonial = TextBlob(request_data["text"])
                return testimonial.sentiment._asdict()
            else:
                return {"message": "text value not provided"}
        else:
            return {"message": "No data provided"}
    else:
        return {"message": "Method not allowed. Must be 'POST'"}