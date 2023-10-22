import pandas as pd
import pymssql  
import os 
from flask import Flask
from flask import request
import sys
import requests
from datetime import datetime


app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def parse_request():

	#create connection 
	
	conn = pymssql.connect(server=os.environ["DB_HOST"], user=os.environ["DB_USER"], password=os.environ["DB_PW"], database=os.environ["DB_NAME"])  
	cursor = conn.cursor()  
	cursor.execute("SELECT TOP 1 * FROM RawData ORDER BY closed DESC")  
	results = cursor.fetchall()
	rawData = pd.DataFrame(results)	

	rawData.columns = ['closed', 'floor11', 'floor12', 'floor21', 'floor22', 'floor31', 'floor32', 'floor41', 'floor42']

	print(rawData, file=sys.stderr)

	closed = datetime.now().strftime("%m/%d/%Y, %H:%M:%S")
	closed_for_slack_triggering = datetime.now().strftime("%m/%d/%Y")
	floor1_left=0
	floor2_left=0
	floor3_left=0
	floor4_left=0
	trigger_slack_messenger = False
	slack_eventing_url = os.environ["SLACK_EVENTING_URL"]

	if (rawData["floor11"].values[0] < 1001 or (rawData["floor12"].values[0] < 1001) or (((rawData["floor11"].values[0]+rawData["floor12"].values[0])/2) < 1004)):
		floor1_left = 0 
		trigger_slack_messenger = True
	elif((rawData["floor11"].values[0] < 1007) or (rawData["floor12"].values[0] < 1007) or (rawData["floor11"].values[0]+rawData["floor12"].values[0])/2 < 1010):
		floor1_left = 1
		trigger_slack_messenger = True
	elif(((rawData["floor11"].values[0]+rawData["floor12"].values[0])/2) > 1012):
		floor1_left = 3
	else:
		floor1_left = 2


	if (rawData["floor21"].values[0] < 970 or (rawData["floor22"].values[0] < 970) or (((rawData["floor21"].values[0]+rawData["floor22"].values[0])/2) < 990)):
		floor2_left = 0 
		trigger_slack_messenger = True
	elif ((rawData["floor21"].values[0] < 1010) or (rawData["floor22"].values[0] < 1010) or ((rawData["floor21"].values[0]+rawData["floor22"].values[0])/2 < 1010)):
		floor2_left = 1
		trigger_slack_messenger = True
	elif (((rawData["floor21"].values[0]+rawData["floor22"].values[0])/2) > 1014):
		floor2_left = 3
	else:
		floor2_left = 2

	if (rawData["floor31"].values[0] < 1004 or (rawData["floor32"].values[0] < 1004) or (((rawData["floor31"].values[0]+rawData["floor32"].values[0])/2) < 1008)):
		floor3_left = 0 
		trigger_slack_messenger = True
	elif ((rawData["floor31"].values[0] < 1015) or (rawData["floor32"].values[0] < 1015) or ((rawData["floor31"].values[0]+rawData["floor32"].values[0])/2 < 1016)):
		floor3_left = 1
		trigger_slack_messenger = True
	elif (((rawData["floor31"].values[0]+rawData["floor32"].values[0])/2) > 1018):
		floor3_left = 3
	else:
		floor3_left = 2


	if (rawData["floor41"].values[0] < 980 or (rawData["floor42"].values[0] < 980) or (((rawData["floor41"].values[0]+rawData["floor42"].values[0])/2) < 985)):
		floor4_left = 0 
		trigger_slack_messenger = True
	elif ((rawData["floor41"].values[0] < 1007) or (rawData["floor42"].values[0] < 1007) or ((rawData["floor41"].values[0]+rawData["floor42"].values[0])/2 < 1007)):
		floor4_left = 1
		trigger_slack_messenger = True
	elif (((rawData["floor41"].values[0]+rawData["floor42"].values[0])/2) > 1014):
		floor4_left = 3
	else:
		floor4_left = 2

	# saving states for the slack messenger
	states = [floor1_left, floor2_left, floor3_left, floor4_left]

	floor1_left=str(floor1_left)
	floor2_left=str(floor2_left)
	floor3_left=str(floor3_left)
	floor4_left=str(floor4_left)


	# only trigger once per day
	cursor.execute("SELECT * FROM ComputationDataF WHERE closed LIKE '%" + closed_for_slack_triggering + "%' AND (floor1 in ('0','1') OR floor2 in ('0','1') OR floor3 in ('0','1') OR floor4 in ('0','1'));")
	results = cursor.fetchall()
	rows_count = int(cursor.rowcount)
	if rows_count > 0:
		trigger_slack_messenger = False

	# writing the computed data to the given database
	cursor.execute("INSERT INTO ComputationDataF (closed, floor1, floor2, floor3, floor4) VALUES ('"+closed+"', '"+floor1_left+"', '"+floor2_left+"', '"+floor3_left+"', '"+floor4_left+"');")
	conn.commit()
	cursor.close()
	conn.close()


	# this triggers the slack messenger
	if (trigger_slack_messenger and slack_eventing_url is not None):
		bottles_range = [0, "less than 5", "5-10", "more than 10"]
		bottles = [0, 0, 0, 0]

		for i in range(0,4):
			bottles[i] = bottles_range[states[i]]

		jsonmessage = {"source": "kyma", "specversion": "1.0", "eventtypeversion": "v1", "data": {"alarm_floors": states, "bottles_floors": bottles}, "datacontenttype": "application/json", "id": "2",	"type": "sap.kyma.custom.lionelfridgy.alert.triggered.v1"}
		headers = {'content-type': 'application/cloudevents+json', 'Accept-Charset': 'UTF-8'}
		reply_messenger = requests.post(slack_eventing_url, json = jsonmessage, headers = headers)
		print(reply_messenger.text, file=sys.stderr) 
		print(reply_messenger.status_code, file=sys.stderr) 

	return "Success", 200



if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)
    


