package main

import (
	"context"
	"net/http"

	"github.com/go-redis/redis/v8"
	"github.com/rbcervilla/redisstore/v8"

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
	oidcConfig := setOIDCConfig(appconfig)
	sessionName := appconfig.Cookie.SessionName

	var authOIDC *auth.OIDCConfig
	if len(appconfig.RedisStore.Addr) > 0 {
		store := setRedisStore(appconfig)
		authOIDC = auth.InitOIDC(oidcConfig, store, sessionName)
	} else {
		store := setMemStore(appconfig)
		authOIDC = auth.InitOIDC(oidcConfig, store, sessionName)
	}

	router := mux.NewRouter().StrictSlash(true)
	proxy.SetRoutes(router, appconfig, authOIDC)

	log.Fatal(http.ListenAndServe(":8000", router))
}

func setRedisStore(appconfig *appconfig.Config) *redisstore.RedisStore {

	log.Info("--------USING REDIS STORAGE--------")

	client := redis.NewClient(&redis.Options{
		Addr:     appconfig.RedisStore.Addr,
		Password: appconfig.RedisStore.Password,
		DB:       appconfig.RedisStore.DB,
	})

	store, err := redisstore.NewRedisStore(context.Background(), client)
	if err != nil {
		log.Fatalf("failed to create redis store with address: %s, error: %s ", appconfig.RedisStore.Addr, err)
	}

	store.Options(sessions.Options{
		Path:     "/",
		MaxAge:   appconfig.Cookie.MaxAgeSeconds,
		HttpOnly: appconfig.Cookie.HttpOnly,
	})

	return store
}

//See https://github.com/gorilla/sessions#store-implementations
func setMemStore(appconfig *appconfig.Config) *memstore.MemStore {

	log.Warn("--------USING MEMORY STORAGE - THIS IS NOT RECOMMENDED!--------")
	store := memstore.NewMemStore([]byte(appconfig.Cookie.Key))

	store.Options = &sessions.Options{
		Path:     "/",
		MaxAge:   appconfig.Cookie.MaxAgeSeconds,
		HttpOnly: appconfig.Cookie.HttpOnly,
	}

	return store
}

func setOIDCConfig(appconfig *appconfig.Config) *auth.InitConfig {

	oidcConfig := &auth.InitConfig{}
	oidcConfig.ClientID = appconfig.IDPConfig.ClientID
	oidcConfig.ClientSecret = appconfig.IDPConfig.ClientSecret
	oidcConfig.URL = appconfig.IDPConfig.URL
	oidcConfig.RedirectURL = appconfig.RedirectURI
	oidcConfig.Token_endpoint_auth_method = appconfig.IDPConfig.TokenEndpointAuthMethod
	oidcConfig.XSAppName = appconfig.IDPConfig.XSAppName

	return oidcConfig
}
