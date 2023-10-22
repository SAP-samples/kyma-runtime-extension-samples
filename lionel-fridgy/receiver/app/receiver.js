const express = require('express');
const sql = require('mssql');
const axios = require('axios');
const xssEscape = require('xss-escape');

const PORT = process.env.PORT || 3000;
const NUMBER_OF_FLOORS = process.env.NR_OF_FLOORS;
const SENSORS_PER_FLOOR = process.env.SENSORS_PER_FLOOR;
const EVENT_URL = "http://computation-unit-service.lionel-fridgy.svc.cluster.local";

const database_config = {
    database: process.env.DB_NAME,
    server: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    options: {
        trustServerCertificate: true // self-signed certs
      }
};

const app = express();
app.use(express.json());

app.post('/', async (req, res) => {
    var fridge_state = xssEscape(req.body);
    const [is_valid, message] = validate_fridge_state_json(fridge_state);
    
    if(!is_valid) {
        res.status(400);
        res.send(message);
    }
    else {
        writeSQL(fridge_state);
        console.log(fridge_state);
        let response = await axios.post(EVENT_URL, {});
        res.status(200);
        res.send("Success");
    }
});

app.listen(PORT, () => {
    console.log(`Receiver is listening on port ${PORT}.`);
});

async function writeSQL(fridge_object) {
    // create SQL query
    let query_string = "insert into RawData (";
    let values_string = "values (";
    for(let floor = 0; floor < NUMBER_OF_FLOORS; floor++) {
        for(let sensor = 0; sensor < SENSORS_PER_FLOOR; sensor++) {
            query_string += "floor" + (floor+1) + (sensor+1);

            sql.input("floor" + floor + "sensor" + sensor, sql.Int, fridge_object.fridge.floors[floor].sensor_input[sensor]);
            values_string += "'" + "@floor" + floor + "sensor" + sensor + "'";

            if(sensor < SENSORS_PER_FLOOR-1) {
                query_string += ", ";
                values_string += ", ";
            }
        }

        if(floor < NUMBER_OF_FLOORS-1) {
            query_string += ", ";
            values_string += ", ";
        }
    }
    query_string += ") ";
    values_string += ");";

    let query = query_string + values_string;

    // execute query
    try {
        sql.connect(database_config, err => {
            if (err) {
                console.log(err);
            }
            let request = new sql.Request();
            request.query(query, (err, result) => {
                if (err) {
                    console.log(`During the attempty to write to sql (query: ${query}) the following error occured:`);
                    console.log(err.code);
                    console.log(err.message);
                }
            });
        })
    }
    catch (err) {
        console.log(err);
    }
}

function validate_fridge_state_json(json_object) {
    const first_level_keys = ['timestamp', 'fridge'];
    
    for (let i = 0; i < first_level_keys.length; i++) {
        if(!json_object.hasOwnProperty(first_level_keys[i])) {
            let message = `JSON Object is not valid! The key "${first_level_keys[i]}" is missing.`;
            console.log(message);
            return [false, message];
        }
    }
    
    
    if(!json_object['fridge'].hasOwnProperty('floors')) {
        let message = `JSON Object is not valid! There is no key "floors" in "fridge".`;
        console.log(message);
        return [false, message];
    }
    if(json_object['fridge']['floors'].length != NUMBER_OF_FLOORS) {
        let message = `JSON Object is not valid! Number of floors (${json_object['fridge']['floors'].length}) is different than expected (${NUMBER_OF_FLOORS}).`;
        console.log(message);
        return [false, message];
    }
    for (let i = 0; i < NUMBER_OF_FLOORS; i++) {
        if(!json_object['fridge']['floors'][i].hasOwnProperty('sensor_input')) {
            let message = `JSON Object is not valid! Floor at index ${i} has no key "sensor_input".`;
            console.log(message);
            return [false, message];
        }
        if(json_object['fridge']['floors'][i]['sensor_input'].length != SENSORS_PER_FLOOR) {
            let message = `JSON Object is not valid! Number of sensors (${json_object['fridge']['floors'][i]['sensor_input'].length}) at floor at index ${i} is different than expected (${SENSORS_PER_FLOOR}).`;
            console.log(message);
            return [false, message];
        }
    }

    return [true, ''];
}
