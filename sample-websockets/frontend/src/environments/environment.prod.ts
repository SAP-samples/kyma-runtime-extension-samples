export const environment = {
  production: true,
  issuer: window["env"]["issuer"] || "https://issuer.url",
  clientId: window["env"]["clientId"] || "provide-clientId",
  backendApiUrl: window["env"]["backendApiUrl"] || "https://backend.url",
  backendWsUrl: window["env"]["backendWsUrl"] || "wss://backend.url",
};
