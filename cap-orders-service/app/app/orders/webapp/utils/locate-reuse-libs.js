/*eslint-disable semi, no-console*/
(function (sap) {
    var getKeys = function (libOrComp, libOrCompKeysString) {
        // SAPUI5 delivered namespaces from https://ui5.sap.com/#/api/sap
        var ui5Libs = [
            "sap.apf",
            "sap.base",
            "sap.chart",
            "sap.collaboration",
            "sap.f",
            "sap.fe",
            "sap.fileviewer",
            "sap.gantt",
            "sap.landvisz",
            "sap.m",
            "sap.ndc",
            "sap.ovp",
            "sap.rules",
            "sap.suite",
            "sap.tnt",
            "sap.ui",
            "sap.uiext",
            "sap.ushell",
            "sap.uxap",
            "sap.viz",
            "sap.webanalytics",
            "sap.zen"
        ];
        Object.keys(libOrComp).forEach(function (libOrCompKey) {
            // ignore libs or Components that start with SAPUI5 delivered namespaces
            if (
                !ui5Libs.some(function (substring) {
                    return libOrCompKey === substring || libOrCompKey.startsWith(substring + ".");
                })
            ) {
                if (libOrCompKeysString.length > 0) {
                    libOrCompKeysString = libOrCompKeysString + "," + libOrCompKey;
                } else {
                    libOrCompKeysString = libOrCompKey;
                }
            }
        });
        return libOrCompKeysString;
    };

    var updateManifest = function (manifest) {
        var result = "";
        if (manifest) {
            if (manifest["sap.ui5"] && manifest["sap.ui5"].dependencies) {
                if (manifest["sap.ui5"].dependencies.libs) {
                    result = getKeys(manifest["sap.ui5"].dependencies.libs, result);
                }
                if (manifest["sap.ui5"].dependencies.components) {
                    result = getKeys(manifest["sap.ui5"].dependencies.components, result);
                }
            }
            if (manifest["sap.ui5"] && manifest["sap.ui5"].componentUsages) {
                result = getKeys(manifest["sap.ui5"].componentUsages, result);
            }
        }
        return result;
    };

    var fioriToolsGetManifestLibs = function (manifestPath) {
        var url = manifestPath;
        return new Promise(function (resolve, reject) {
            $.ajax(url)
                .done(function (manifest) {
                    resolve(updateManifest(manifest));
                })
                .fail(function () {
                    reject(new Error("Could not fetch manifest at '" + manifestPath));
                });
        });
    };

    var updateModuleDefinition = function (data) {
        if (data) {
            Object.keys(data).forEach(function (moduleDefinitionKey) {
                var moduleDefinition = data[moduleDefinitionKey];
                if (moduleDefinition && moduleDefinition.dependencies) {
                    moduleDefinition.dependencies.forEach(function (dependency) {
                        if (dependency.url && dependency.url.length > 0 && dependency.type === "UI5LIB") {
                            jQuery.sap.log.info(
                                "Registering Library " + dependency.componentId + " from server " + dependency.url
                            );
                            jQuery.sap.registerModulePath(dependency.componentId, dependency.url);
                        }
                    });
                }
            });
        }
    };

    /**
     * Registers the module paths for dependencies of the given component.
     * @param {string} manifestPath The the path to the app manifest path
     * for which the dependencies should be registered.
     * @returns {Promise} A promise which is resolved when the ajax request for
     * the app-index was successful and the module paths were registered.
     */
    sap.registerComponentDependencyPaths = function (manifestPath) {
        /*eslint-disable semi, consistent-return*/
        return fioriToolsGetManifestLibs(manifestPath).then(function (libs) {
            if (libs && libs.length > 0) {
                var url = "/sap/bc/ui2/app_index/ui5_app_info?id=" + libs;
                var sapClient = jQuery.sap.getUriParameters().get("sap-client");
                if (sapClient && sapClient.length === 3) {
                    url = url + "&sap-client=" + sapClient;
                }
                return $.ajax(url).done(updateModuleDefinition);
            }
        });
    };
})(sap);

/*eslint-disable sap-browser-api-warning, sap-no-dom-access*/
var scripts = document.getElementsByTagName("script");
var currentScript = document.getElementById("locate-reuse-libs");
if (!currentScript) {
    currentScript = document.currentScript;
}
var manifestUri = currentScript.getAttribute("data-sap-ui-manifest-uri");
var componentName = currentScript.getAttribute("data-sap-ui-componentName");
var useMockserver = currentScript.getAttribute("data-sap-ui-use-mockserver");
var bundleResources = function () {
    jQuery.sap.require("jquery.sap.resources");
    var sLocale = sap.ui.getCore().getConfiguration().getLanguage();
    var oBundle = jQuery.sap.resources({
        url: "i18n/i18n.properties",
        locale: sLocale
    });
    document.title = oBundle.getText("appTitle");
};
sap.registerComponentDependencyPaths(manifestUri)
    .catch(function (error) {
        jQuery.sap.log.error(error);
    })
    .finally(function () {
        // setting the app title with internationalization
        sap.ui.getCore().attachInit(bundleResources);

        if (componentName && componentName.length > 0) {
            if (useMockserver && useMockserver === "true") {
                sap.ui.getCore().attachInit(function () {
                    sap.ui.require([componentName.replace(/\./g, "/") + "/localService/mockserver"], function (server) {
                        // set up test service for local testing
                        server.init();
                        // initialize the ushell sandbox component
                        sap.ushell.Container.createRenderer().placeAt("content");
                    });
                });
            } else {
                // Requiring the ComponentSupport module automatically executes the component initialisation for all declaratively defined components
                sap.ui.require(["sap/ui/core/ComponentSupport"]);

                // setting the app title with the i18n text
                sap.ui.getCore().attachInit(bundleResources);
            }
        } else {
            sap.ui.getCore().attachInit(function () {
                // initialize the ushell sandbox component
                sap.ushell.Container.createRenderer().placeAt("content");
            });
        }
    });

sap.registerComponentDependencyPaths(manifestUri);
