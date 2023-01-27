const express = require('express');
const     sql = require('mssql');
const     got = require('got');
const     app = express();

module.exports = { main: async function (event, context) {
        const database_config = {
            database: process.env.DB_NAME,
            server: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PW,
            trustServerCertificate: true
        };
        const pool = await sql.connect(database_config);
        const db_request = new sql.Request();

        try {
            const result = await db_request.query('SELECT TOP 1 * FROM ComputationDataF ORDER BY closed DESC');
            db_data = result.recordsets[0][0];
            let bottles_left = ['0', '<5', '<10', '>10'];
            let highlight_color = ['Error', 'Warning', 'None', 'Success'];
            let fridge_status = {};
            let fridge = [];
            // reverse order to get floor 4 (highest floor in fridge) at top row in table
            for(let i = 4; i > 0; i--) {
                fridge.push({
                    "Floor": (i).toString(),
                    "Bottles": bottles_left[db_data['floor' + (i).toString()]],
                    "HighlightColor": highlight_color[db_data['floor' + (i).toString()]]
                });
            }
            let last_timestamp = new Date(db_data['closed']);
            fridge_status = {
                "fridge": fridge,
                "timestamp": last_timestamp.toLocaleString("de-DE", {timeZone: 'Europe/Berlin'})
            }
            return fridge_status;
        } catch(err) {
            console.log("An Error has occurred during requesting the database content");
            console.error(err);
            return "An Error has occurred during requesting the database content";
        }
    }
}