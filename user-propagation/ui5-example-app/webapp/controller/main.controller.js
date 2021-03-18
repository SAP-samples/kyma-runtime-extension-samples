sap.ui.define(
  ["com/sample/userprop/controller/BaseController"],
  function (Controller) {
    "use strict";

    return Controller.extend("com.sample.userprop.controller.main", {
      getHttpOptions() {
        return {
          headers: new HttpHeaders({
            "Content-Type": "application/json",
          }),
        };
      },

      createTask: async function () {
        const data = this.getView().byId("subjectInput").getValue();
        console.log(`Create task with subject ${data}`);
        const task = { subject: data };
        const result = await this.sendRequest("/tasks", {
          body: JSON.stringify(task),
          method: "POST",
        });
        this.getView().byId("taskResult").setText(JSON.stringify(result));
      },

      sendRequest: async function (path, opts = {}) {
        const headers = Object.assign({}, opts.headers || {}, {
          "Content-type": "application/json; charset=UTF-8",
          authorization: "bearer " + this.getIdToken(),
        });

        console.log(headers);

        const response = await fetch(
          this.getAPIURL() + path,
          Object.assign({ method: "POST", credentials: "same-origin" }, opts, {
            headers,
          })
        );

        const data = await response.json();

        if (data.error) {
          console.log(data.error);
          throw new Error(`${response.status} Message: ${data.message}`);
        }

        return data;
      },

      getAPIURL: function () {
        var oModel = this.getModel("config");
        return oModel.getProperty("/apiUrl");
      },

      getIdToken: function () {
        var oModel = this.getModel("user");
        return oModel.getProperty("/id_token");
      },
    });
  }
);
