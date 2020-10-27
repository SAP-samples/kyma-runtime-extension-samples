package main

import (
	"net/http"

	"github.com/quasoft/memstore"
	log "github.com/sirupsen/logrus"

	"github.com/gorilla/mux"
	"github.com/gorilla/sessions"

	"github.com/SAP-samples/kyma-runtime-extension-samples/app-auth-proxy/internal/auth"
	"github.com/SAP-samples/kyma-runtime-extension-samples/app-auth-proxy/internal/proxy"

	appconfig "github.com/SAP-samples/kyma-runtime-extension-samples/app-auth-proxy/internal/config"
)

func main() {

	appconfig := appconfig.GetConfig()

	store := setMemStore(appconfig)
	oidcConfig := setOIDCConfig(appconfig)
	sessionName := appconfig.BaseConfig.Cookie.SessionName
	authOIDC := auth.InitOIDC(oidcConfig, store, sessionName)

	router := mux.NewRouter().StrictSlash(true)
	proxy.SetRoutes(router, appconfig, authOIDC)

	log.Fatal(http.ListenAndServe(":8000", router))
}

//See https://github.com/gorilla/sessions#store-implementations
func setMemStore(appconfig *appconfig.AppConfig) *memstore.MemStore {

	log.Warn("--------USING MEMORY STORAGE - THIS IS NOT RECOMMENDED!--------")
	store := memstore.NewMemStore([]byte(appconfig.BaseConfig.Cookie.Key))

	store.Options = &sessions.Options{
		Path:     "/",
		MaxAge:   appconfig.BaseConfig.Cookie.MaxAgeSeconds,
		HttpOnly: appconfig.BaseConfig.Cookie.HttpOnly,
		Secure:   appconfig.BaseConfig.Cookie.Secure,
		SameSite: 0,
	}

	return store
}

func setOIDCConfig(appconfig *appconfig.AppConfig) *auth.InitConfig {

	oidcConfig := &auth.InitConfig{}
	oidcConfig.ClientID = appconfig.IDPConfig.ClientID
	oidcConfig.ClientSecret = appconfig.IDPConfig.ClientSecret
	oidcConfig.Issuer = appconfig.IDPConfig.Issuer
	oidcConfig.RedirectURL = appconfig.BaseConfig.RedirectURI
	oidcConfig.Token_endpoint_auth_method = appconfig.BaseConfig.TokenEndpointAuthMethod

	return oidcConfig
}
