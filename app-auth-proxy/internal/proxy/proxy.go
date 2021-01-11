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

func SetRoutes(router *mux.Router, appconfig *appconfig.Config, authOIDC *auth.OIDCConfig) {
	router.HandleFunc("/oauth/callback", authOIDC.HandleCallback)
	router.Handle("/auth/user", authOIDC.AuthN_Handler(http.HandlerFunc(authOIDC.GetUser))).Methods("GET")
	router.Handle("/auth/groups", authOIDC.AuthN_Handler(http.HandlerFunc(authOIDC.GetUserGroups))).Methods("GET")

	sort.Slice(appconfig.Routes, func(i, j int) bool {
		return appconfig.Routes[i].Priority < appconfig.Routes[j].Priority
	})

	for i := 0; i < len(appconfig.Routes); i++ {
		path := appconfig.Routes[i].Path
		target := appconfig.Routes[i].Target
		protected := appconfig.Routes[i].Protected
		removeFromPath := appconfig.Routes[i].RemoveFromPath

		log.WithFields(log.Fields{
			"path":           path,
			"target":         target,
			"removeFromPath": removeFromPath,
		}).Debug("Setting router for:")

		group := appconfig.Routes[i].HTTPMethodScopes

		if protected {
			router.PathPrefix(path).Handler(authOIDC.AuthN_Handler(authOIDC.AuthZ_Handler(group, serveFromProxy(target, path, removeFromPath))))
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
			log.Debugf("Forwarding auth token: %s", token)
			r.Header.Set("Authorization", "Bearer "+token.(string))
		}
		//r.Header.Set("X-Forwarded-Host", r.Header.Get("Host"))

		log.Debugf("Proxying path: %+v\n", *r.URL)

		proxy.ServeHTTP(w, r)
	})
}
