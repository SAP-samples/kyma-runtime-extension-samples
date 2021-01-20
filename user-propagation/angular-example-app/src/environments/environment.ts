// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  httpBinUrl: "https://httpbin.ed72781.kyma-stage.shoot.live.k8s-hana.ondemand.com",
  oidcUrl: "https://gaurav-10.authentication.sap.hana.ondemand.com/.well-known/openid-configuration",
  c4cExtensionUrl: "http://localhost:3000/https://c4c-extension-with-user-context.ed72781.kyma-stage.shoot.live.k8s-hana.ondemand.com",
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
