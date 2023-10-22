sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("webapp.lionelfridgy.webapp.controller.Main", {
            onInit: function () {
                var URL = "" // insert your url of your mssql-api here
                var xmlHttp = new XMLHttpRequest();
                xmlHttp.open("GET", "/fridgestatus", false); // false for synchronous request
                xmlHttp.send(null);
                
                let jsonResponse = JSON.parse(xmlHttp.responseText);
                var attModel = new sap.ui.model.json.JSONModel()
                attModel.setData(jsonResponse['fridge']);
                this.getView().setModel(attModel);
                
                this.getView().byId("timestampText").setText("Last change: " + jsonResponse['timestamp']);
            }
        });
    });
