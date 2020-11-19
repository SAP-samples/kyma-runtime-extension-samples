export const environment = {
  production: true,
  httpBinUrl: window["env"]["httpBinUrl"] || "default",
  oidcUrl: window["env"]["oidcUrl"] || "default",
  c4cExtensionUrl: window["env"]["c4cExtensionUrl"] || "default",
};
