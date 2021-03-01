(function (window) {
  window["env"] = window["env"] || {};

  // Environment variables
  window["env"]["issuer"] = "${ISSUER}";
  window["env"]["clientId"] = "${CLIENT_ID}";
  window["env"]["backendApiUrl"] = "${BACKEND_API_URL}";
  window["env"]["backendWsUrl"] = "${BACKEND_WS_URL}";
})(this);