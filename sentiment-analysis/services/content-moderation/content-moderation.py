from flask import Flask, request
from profanity_check import predict, predict_prob
import json

app = Flask(__name__) # Flask instance named app

@app.route("/", methods=['POST'])
def contentmoderation():
    if (request.data):
        request_data = json.loads(request.data)
        if ("text" in request_data):
            inappropriate = predict([request_data["text"]])
            probability = predict_prob([request_data['text']])
            result = {
                "inappropriate": int(inappropriate[0]),
                "probability": float(probability[0])
            }
            return result
        else:
            return {"message": "text value not provided"}, 400
    else:
        return {"message": "No data provided"}, 400        
