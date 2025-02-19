#!/usr/bin/env node
'use strict'

const config = require('@varkes/configuration')
const openapi = require('@varkes/openapi-mock')
const odata = require('@varkes/odata-mock')
const server = require('@varkes/api-server')
const cockpit = require("@varkes/cockpit")
const app = require('express')()
const orders = require('./orders.json');

var runAsync = async () => {
  var port
  if (process.argv.length > 2 && parseInt(process.argv[2])) {
    port = process.argv[2]
  }

  try {
    customizeMock(app)
    let configuration = await config.resolveFile("./varkes_config.json", __dirname)
    app.use(await cockpit.init(configuration))
    app.use(await server.init(configuration))
    app.use(await odata.init(configuration))
    app.use(await openapi.init(configuration))
    
    
    if (port)
      app.listen(port, function () {
        console.info("Started application on port %d", port)
      });
    return app
  } catch (error) {
    console.error("Problem while starting application: %s", error)
  }
}

function customizeMock(app) {
  app.get('/rest/v2/:baseSiteId/orders/:code', function (req, res, next) {
    // Customize the response body
    res.body = orders[req.params.code] || { orderId: req.params.code, totalPriceWithTax: { value: 100 }
    };

    // Let the Mock middleware apply usual chain
    next();
  });
  app.get('/rest/v2/:baseSiteId/users/:userId/orders', function (req, res, next) {
    // Customize the response body
    res.body = orders.all;
    // Let the Mock middleware apply usual chain
    next();
  });

  return app
}
module.exports = runAsync()
