#define DOOR_SENSOR 13

int floor_sensors[8] = {A0, A1, A2, A3, A4, A5, A6, A7};

bool previous_door_status;
bool door_status;

void setup() {
  Serial.begin(9600);
  pinMode(DOOR_SENSOR, INPUT_PULLUP);

  for(int i = 0; i < 8; i++) {
    pinMode(floor_sensors[i], INPUT);
  }

  door_status = digitalRead(DOOR_SENSOR);
  previous_door_status = door_status;
}

void loop() {
  door_status = digitalRead(DOOR_SENSOR);

  if(door_status == 0 && previous_door_status == 1) {
    // door was closed
    delay(2000);
    String message = "{ \"floors\": [";

    for (int i = 0; i < 4; i++) {
      message += "{";
      message += "\"number\": " + String(i) + ",";
      message += "\"sensor_input\": [";
      message += String(readSensor(floor_sensors[i*2])) + ",";
      message += String(readSensor(floor_sensors[i*2+1]));
      message += "]";
      message += "}";
      if(i != 3) {
        message += ",";
      }
    }

    message += "]}";

    Serial.println(message);
  }

  previous_door_status = door_status;
  delay(200);
}

int readSensor(int pin) {
  int values[5];
  for(int i = 0; i < 5; i++) {
    values[i] = analogRead(pin);
    delay(100);
  }

  //sort values
  qsort(values, 5, sizeof(values[0]), sort_desc);

  return values[2];
}

int sort_desc(int a, int b)
{
  return b - a;
}
