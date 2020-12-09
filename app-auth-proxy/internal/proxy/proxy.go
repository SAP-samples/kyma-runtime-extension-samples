package proxy

import (
	"net/http"
	"net/http/httputil"
	"net/url"
	"sort"
	"strings"

	log "github.com/sirupsen/logrus"

	"github.com/SAP-samples/kyma-runtime-extension-samples/app-auth-proxy/internal/auth"
	appconfig "github.com/SAP-samples/kyma-runtime-extension-samples/app-auth-proxy/internal/config"
	"github.com/gorilla/mux"
)

func SetRoutes(router *mux.Router, appconfig *appconfig.AppConfig, authOIDC *auth.OIDCConfig) {
	router.HandleFunc("/oauth/callback", authOIDC.HandleCallback)
	router.Handle("/user", authOIDC.AuthHandler(http.HandlerFunc(authOIDC.GetUser))).Methods("GET")

	sort.Slice(appconfig.BaseConfig.Routes, func(i, j int) bool {
		return appconfig.BaseConfig.Routes[i].Priority < appconfig.BaseConfig.Routes[j].Priority
	})

	for i := 0; i < len(appconfig.BaseConfig.Routes); i++ {
		path := appconfig.BaseConfig.Routes[i].Path
		target := appconfig.BaseConfig.Routes[i].Target
		protected := appconfig.BaseConfig.Routes[i].Protected
		removeFromPath := appconfig.BaseConfig.Routes[i].RemoveFromPath

		log.WithFields(log.Fields{
			"path":           path,
			"target":         target,
			"removeFromPath": removeFromPath,
		}).Debug("Setting router for:")

		if protected {
			router.PathPrefix(path).Handler(authOIDC.AuthHandler(serveFromProxy(target, path, removeFromPath)))
		} else {
			router.PathPrefix(path).Handler(serveFromProxy(target, path, removeFromPath))
		}

	}
}

func serveFromProxy(target string, path string, removeFromPath string) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		url, _ := url.Parse(target)

		if len(removeFromPath) > 0 {
			log.WithFields(log.Fields{
				"path":           path,
				"target":         target,
				"removeFromPath": removeFromPath,
			}).Debug("Removing from path:")
			r.URL.Path = strings.Replace(r.URL.Path, removeFromPath, "", 1)
		}

		proxy := httputil.NewSingleHostReverseProxy(url)

		r.URL.Host = url.Host
		r.URL.Scheme = url.Scheme
		r.Header.Add("Referer", url.Host)
		r.Host = url.Host
		r.Header.Set("Host", url.Host)

		token := r.Context().Value("token")

		if token != nil {
			r.Header.Set("Authorization", "Bearer "+token.(string))
		}
		//r.Header.Set("X-Forwarded-Host", r.Header.Get("Host"))

		log.Printf("%+v\n", *r.URL)

		proxy.ServeHTTP(w, r)
	})
}
