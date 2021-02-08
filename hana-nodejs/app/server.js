var express = require('express');
var hana = require('@sap/hana-client');
var app = express();

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
  }

var config = {
    serverNode: process.env.HDB_HOST + ":" + process.env.HDB_PORT,
    UID: process.env.HDB_USER,
    PWD: process.env.HDB_PASSWORD
};

app.get('/', function (req, res) {
  
  var connection = hana.createConnection();

  connection.connect(config, function(err) {
      if (err) {
            console.error(err);
            throw err;
      }
      var sql = 'select * from HOTEL.CUSTOMER;';
      var rows = connection.exec(sql, function(err, rows) {
          if (err) {
              console.error(err);
              throw err;
          }
          console.log(rows);
          res.send(rows);
          connection.disconnect(function(err) {
              if (err) {
                    console.error(err);
                    throw err;
              }   
          });
      });
  });
})

const port = process.env.PORT || 3000;
var server = app.listen(port, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
   console.log("Using db config: ", config);
})
