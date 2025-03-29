#!/usr/bin/env node
'use strict'

const config = require("@varkes/configuration")
const mock = require("@varkes/odata-mock")
const server = require("@varkes/api-server")
const cockpit = require("@varkes/cockpit")
const app = require('express')()

var runAsync = async () => {
    var port
    if (process.argv.length > 2 && parseInt(process.argv[2])) {
        port = process.argv[2]
    }

    try {
        let configuration = await config.resolveFile("./varkes_config.json", __dirname)
        app.use(await mock.init(configuration))
        app.use(await server.init(configuration))
        app.use(await cockpit.init(configuration))
        if (port)
            app.listen(port, function () {
                console.info("Started application on port %d", port)
            })
        return app
    } catch (error) {
        console.error("Problem while starting application: %s", error)
    }
}

module.exports = runAsync()