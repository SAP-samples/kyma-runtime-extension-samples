package main

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"

	"github.com/SAP-samples/kyma-runtime-extension-samples/api-mssql-go-auth/internal/auth"
	"github.com/SAP-samples/kyma-runtime-extension-samples/api-mssql-go-auth/internal/saas"

	appconfig "github.com/SAP-samples/kyma-runtime-extension-samples/saas-provisioning/internal/config"
)

func main() {

	oidcConfig := getOIDCConfig()
	authOIDC := auth.InitOIDC(oidcConfig)

	router := mux.NewRouter().StrictSlash(true)
	router.HandleFunc("/oauth/callback", authOIDC.HandleCallback)

	router.Handle("/user", authOIDC.AuthHandler(http.HandlerFunc(authOIDC.GetUser))).Methods("GET")

	router.HandleFunc("/callback/v1.0/tenants/{tenant}", saas.SubProvision).Methods("PUT")
	router.HandleFunc("/callback/v1.0/tenants/{tenant}", saas.SubDeprovision).Methods("DELETE")

	log.Fatal(http.ListenAndServe(":8000", router))
}

func getOIDCConfig() *auth.InitConfig {

	appconfig := appconfig.GetConfig()

	oidcConfig := &auth.InitConfig{}
	oidcConfig.ClientID = appconfig.ClientID
	oidcConfig.ClientSecret = appconfig.ClientSecret
	oidcConfig.CookieKey = appconfig.CookieKey
	oidcConfig.Issuer = appconfig.Issuer
	oidcConfig.RedirectURL = appconfig.RedirectURL
	oidcConfig.Token_endpoint_auth_method = appconfig.Token_endpoint_auth_method

	return oidcConfig
}
