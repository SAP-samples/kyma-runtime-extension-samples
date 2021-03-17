(function(window) {
  window["env"] = window["env"] || {};

  // Environment variables
  window["env"]["httpBinUrl"] = "${HTTP_BIN_URL}";
  window["env"]["oidcUrl"] = "${OIDC_URL}";
  window["env"]["oidcClientId"] = "${OIDC_CLIENT_ID}";
  window["env"]["c4cExtensionUrl"] = "${C4C_EXT_URL}";
})(this);