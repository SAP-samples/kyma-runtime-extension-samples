#!/usr/bin/env python3
import serial
import requests
import json
import time

device = '/dev/ttyACM0'
BAUD = 9600
URL = '' # insert receiver url here

if __name__ == '__main__':
	ser = serial.Serial(device, BAUD, timeout=1)
	ser.reset_input_buffer()

	while True:
		time.sleep(0.1)
		if ser.in_waiting > 0:
			line = ser.readline().decode('utf-8').rstrip()
			try:
				json_input = json.loads(line)
			except:
				print("Error of json parsing")
				continue
			message = {"fridge": json_input, "timestamp": time.time()}
			print(message)
			try:
				r = requests.post(URL, json=message)
				if r.status_code != 200:
					print("Could not send message")
				else:
					print(r.content)
			except:
				print("Failed to send message")
