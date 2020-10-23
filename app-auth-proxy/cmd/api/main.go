package main

import (
	"net/http"
	"net/http/httputil"
	"net/url"
	"sort"
	"strings"

	"github.com/quasoft/memstore"
	log "github.com/sirupsen/logrus"

	"github.com/gorilla/mux"
	"github.com/gorilla/sessions"

	"github.com/SAP-samples/kyma-runtime-extension-samples/app-auth-proxy/internal/auth"

	appconfig "github.com/SAP-samples/kyma-runtime-extension-samples/app-auth-proxy/internal/config"
)

func main() {

	appconfig := appconfig.GetConfig()

	store := setMemStore(appconfig)
	oidcConfig := setOIDCConfig(appconfig)
	sessionName := appconfig.BaseConfig.Cookie.SessionName
	authOIDC := auth.InitOIDC(oidcConfig, store, sessionName)

	router := mux.NewRouter().StrictSlash(true)
	router.HandleFunc("/oauth/callback", authOIDC.HandleCallback)
	router.Handle("/user", authOIDC.AuthHandler(http.HandlerFunc(authOIDC.GetUser))).Methods("GET")

	sort.Slice(appconfig.BaseConfig.Routes, func(i, j int) bool {
		return appconfig.BaseConfig.Routes[i].Priority < appconfig.BaseConfig.Routes[j].Priority
	})

	for i := 0; i < len(appconfig.BaseConfig.Routes); i++ {
		path := appconfig.BaseConfig.Routes[i].Path
		target := appconfig.BaseConfig.Routes[i].Target
		protected := appconfig.BaseConfig.Routes[i].Protected
		stripprefix := appconfig.BaseConfig.Routes[i].Stripprefix

		log.WithFields(log.Fields{
			"path":        path,
			"target":      target,
			"stripprefix": stripprefix,
		}).Debug("Setting router for:")

		//http.StripPrefix(path,
		if protected {
			router.PathPrefix(path).Handler(authOIDC.AuthHandler(serveFromProxy(target, path, stripprefix)))
		} else {
			router.PathPrefix(path).Handler(serveFromProxy(target, path, stripprefix))
		}

	}

	log.Fatal(http.ListenAndServe(":8000", router))
}

func serveFromProxy(target string, path string, stripprefix bool) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		url, _ := url.Parse(target)

		if stripprefix {
			log.WithFields(log.Fields{
				"path":        path,
				"target":      target,
				"stripprefix": stripprefix,
			}).Debug("Striping prefix:")
			r.URL.Path = strings.Replace(r.URL.Path, path, "", 1)
		}

		proxy := httputil.NewSingleHostReverseProxy(url)

		r.URL.Host = url.Host
		r.URL.Scheme = url.Scheme
		r.Header.Add("Referer", url.Host)
		r.Host = url.Host
		r.Header.Set("Host", url.Host)
		//r.Header.Set("X-Forwarded-Host", r.Header.Get("Host"))

		log.Printf("%+v\n", *r.URL)

		proxy.ServeHTTP(w, r)
	})
}

//See https://github.com/gorilla/sessions#store-implementations
func setMemStore(appconfig appconfig.AppConfig) *memstore.MemStore {

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

func setOIDCConfig(appconfig appconfig.AppConfig) *auth.InitConfig {

	oidcConfig := &auth.InitConfig{}
	oidcConfig.ClientID = appconfig.IDPConfig.ClientID
	oidcConfig.ClientSecret = appconfig.IDPConfig.ClientSecret
	oidcConfig.Issuer = appconfig.IDPConfig.Issuer
	oidcConfig.RedirectURL = appconfig.BaseConfig.RedirectURI
	oidcConfig.Token_endpoint_auth_method = appconfig.BaseConfig.TokenEndpointAuthMethod

	return oidcConfig
}
