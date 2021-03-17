sap.ui.define(
  [
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "com/sample/userprop/model/models",
    "sap/ui/model/json/JSONModel",
    "thirdparty/oidc-client/dist/oidc-client",
  ],
  function (UIComponent, Device, models, JSONModel) {
    "use strict";

    return UIComponent.extend("com.sample.userprop.Component", {
      metadata: {
        manifest: "json",
      },

      /**
       * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
       * @public
       * @override
       */
      init: function () {
        // call the base component's init function
        UIComponent.prototype.init.apply(this, arguments);

        // enable routing
        this.getRouter().initialize();

        // set the device model
        this.setModel(models.createDeviceModel(), "device");

        //config
        this.initConfigMdl();

        //auth
        this.authHandler();
      },

      initConfigMdl: function () {
        var oModel = new JSONModel({});
        var configUrl = jQuery.sap.getModulePath(
          "com.sample.userprop",
          "/config.json"
        );
        oModel.loadData(configUrl, "", false);
        this.setModel(oModel, "config");
      },

      authHandler: function () {
        var oModel = this.getModel("config");
        var settings = oModel.getProperty("/");
        console.log(settings);

        this.mgr = new Oidc.UserManager(settings);

        if (window.location.href.indexOf("#") >= 0) {
          this.processSigninResponse();
        } else {
          this.signin();
        }
      },

      signin: function () {
        this.mgr
          .signinRedirect({ state: "some state data" })
          .then(function () {
            console.log("signin done");
          })
          .catch(function (err) {
            console.log(err);
          });
      },

      processSigninResponse: function () {
        var userMdl = new JSONModel();

        var me = this;
        this.mgr
          .signinRedirectCallback()
          .then(function (response) {
            var signinResponse = response;
            userMdl.setData(signinResponse.profile);
            console.log(userMdl);
            me.setModel(userMdl, "user");
          })
          .catch(function (err) {
            console.log(err);
            me.signin();
          });
      },
    });
  }
);
