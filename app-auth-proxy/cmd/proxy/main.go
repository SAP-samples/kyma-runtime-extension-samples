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
	sessionName := appconfig.BaseConfig.Cookie.SessionName

	var authOIDC *auth.OIDCConfig
	if len(appconfig.BaseConfig.RedisStore.Addr) > 0 {
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

func setRedisStore(appconfig *appconfig.AppConfig) *redisstore.RedisStore {

	log.Info("--------USING REDIS STORAGE--------")

	client := redis.NewClient(&redis.Options{
		Addr:     appconfig.BaseConfig.RedisStore.Addr,
		Password: appconfig.BaseConfig.RedisStore.Password,
		DB:       appconfig.BaseConfig.RedisStore.DB,
	})

	store, err := redisstore.NewRedisStore(context.Background(), client)
	if err != nil {
		log.Fatalf("failed to create redis store with address: %s, error: %s ", appconfig.BaseConfig.RedisStore.Addr, err)
	}

	store.Options(sessions.Options{
		Path:     "/",
		MaxAge:   appconfig.BaseConfig.Cookie.MaxAgeSeconds,
		HttpOnly: appconfig.BaseConfig.Cookie.HttpOnly,
	})

	return store
}

//See https://github.com/gorilla/sessions#store-implementations
func setMemStore(appconfig *appconfig.AppConfig) *memstore.MemStore {

	log.Warn("--------USING MEMORY STORAGE - THIS IS NOT RECOMMENDED!--------")
	store := memstore.NewMemStore([]byte(appconfig.BaseConfig.Cookie.Key))

	store.Options = &sessions.Options{
		Path:     "/",
		MaxAge:   appconfig.BaseConfig.Cookie.MaxAgeSeconds,
		HttpOnly: appconfig.BaseConfig.Cookie.HttpOnly,
	}

	return store
}

func setOIDCConfig(appconfig *appconfig.AppConfig) *auth.InitConfig {

	oidcConfig := &auth.InitConfig{}
	oidcConfig.ClientID = appconfig.IDPConfig.ClientID
	oidcConfig.ClientSecret = appconfig.IDPConfig.ClientSecret
	oidcConfig.URL = appconfig.IDPConfig.URL
	oidcConfig.RedirectURL = appconfig.BaseConfig.RedirectURI
	oidcConfig.Token_endpoint_auth_method = appconfig.BaseConfig.TokenEndpointAuthMethod

	return oidcConfig
}
