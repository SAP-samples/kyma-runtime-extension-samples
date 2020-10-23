package main

import (
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"

	"github.com/SAP-samples/kyma-runtime-extension-samples/api-mssql-go/package/api"
	"github.com/gorilla/mux"

	"github.com/SAP-samples/kyma-runtime-extension-samples/api-mssql-go-auth/internal/auth"

	appconfig "github.com/SAP-samples/kyma-runtime-extension-samples/api-mssql-go-auth/internal/config"
)

func main() {

	oidcConfig := getOIDCConfig()
	authOIDC := auth.InitOIDC(oidcConfig)
	apiServer := api.InitAPIServer()

	router := mux.NewRouter().StrictSlash(true)
	router.HandleFunc("/oauth/callback", authOIDC.HandleCallback)

	router.Handle("/user", authOIDC.AuthHandler(http.HandlerFunc(authOIDC.GetUser))).Methods("GET")
	router.Handle("/orders", authOIDC.AuthHandler(http.HandlerFunc(apiServer.GetOrders))).Methods("GET")
	router.Handle("/orders/{id}", authOIDC.AuthHandler(http.HandlerFunc(apiServer.GetOrder))).Methods("GET")
	router.Handle("/orders/{id}", authOIDC.AuthHandler(http.HandlerFunc(apiServer.DeleteOrder))).Methods("DELETE")
	router.Handle("/orders/{id}", authOIDC.AuthHandler(http.HandlerFunc(apiServer.EditOrder))).Methods("PUT")
	router.Handle("/orders", authOIDC.AuthHandler(http.HandlerFunc(apiServer.AddOrder))).Methods("POST")

	router.HandleFunc("/orderCodeEvent", apiServer.ConsumeOrderCode).Methods("POST")

	router.PathPrefix("/").HandlerFunc(serveReverseProxy)

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
	oidcConfig.IsClientRedirect = appconfig.IsClientRedirect

	return oidcConfig
}

// Reverse Proxy to handle the servering of static content
func serveReverseProxy(res http.ResponseWriter, req *http.Request) {

	appconfig := appconfig.GetConfig()
	log.Printf("proxying static ui resources from %s \n", appconfig.ReverseProxyTarget)
	//"http://localhost:3000/"
	target := appconfig.ReverseProxyTarget
	url, _ := url.Parse(target)

	// create the reverse proxy
	proxy := httputil.NewSingleHostReverseProxy(url)

	req.URL.Host = url.Host
	req.URL.Scheme = url.Scheme
	req.Header.Add("Referer", url.Host)
	req.Host = url.Host
	req.Header.Set("Host", url.Host)

	proxy.ServeHTTP(res, req)
}
