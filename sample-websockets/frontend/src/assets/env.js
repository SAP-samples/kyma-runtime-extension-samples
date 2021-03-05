(function (window) {
  window["env"] = window["env"] || {};

  // Environment variables
  window["env"]["issuer"] = "https://issuer/";
  window["env"]["clientId"] = "provide-client-id";
  window["env"]["backendApiUrl"] = "https://backend.api.url"
  window["env"]["backendWsUrl"] = "wss://backend.websocket.url";
})(this);