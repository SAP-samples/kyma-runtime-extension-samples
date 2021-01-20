package config

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"reflect"
	"runtime"

	"github.com/vrischmann/envconfig"

	log "github.com/sirupsen/logrus"
)

const CONFIG_JSON = "/config/config.json"

var appConfig Config

// type AppConfig struct {
// 	BaseConfig baseConfig
// }

type Config struct {
	Routes []struct {
		Path             string       `json:"path"`
		Priority         int          `json:"priority"`
		Protected        bool         `json:"protected"`
		RemoveFromPath   string       `json:"remove_from_path"`
		Target           string       `json:"target"`
		HTTPMethodScopes MethodScopes `json:"http_method_scopes,default={*;*}"`
	} `json:"routes"`
	IDPConfig   IDPConfig `json:"idp_config"`
	RedirectURI string    `json:"redirect_uri"`
	Debug       bool      `json:"debug"`
	RedisStore  struct {
		Addr     string `json:"addr"`
		Password string `json:"password"`
		DB       int    `json:"db,default=0"`
	} `json:"redis_store"`
	Cookie struct {
		SessionName   string `json:"session_name"`
		MaxAgeSeconds int    `json:"max_age_seconds"`
		Key           string `json:"key"`
		HttpOnly      bool   `json:"httponly"`
	} `json:"cookie"`
}

type IDPConfig struct {
	ClientID                string `json:"clientid""`
	ClientSecret            string `json:"clientsecret"`
	URL                     string `json:"url"`
	TokenEndpointAuthMethod string `json:"token_endpoint_auth_method,default=client_secret_basic"`
	XSAppName               string `json:"xsappname"`
}

type IDPConfigEnv struct {
	ClientID                string `envconfig:"IDP_clientid"`
	ClientSecret            string `envconfig:"IDP_clientsecret"`
	URL                     string `envconfig:"IDP_url"`
	TokenEndpointAuthMethod string `envconfig:"IDP_token_endpoint_auth_method,default=client_secret_basic"`
	XSAppName               string `envconfig:"IDP_xsappname"`
}

type MethodScopes []struct {
	HTTPMethod string `json:"http_method"`
	Scope      string `json:"scope"`
}

//InitConfig initializes the AppConfig
func initIDPConfigFromEnv() {
	idpConfig := IDPConfigEnv{}

	err := envconfig.Init(&idpConfig)
	if err != nil {
		for _, pair := range os.Environ() {
			log.Println(pair)
		}
		log.Fatal("Please check the configuration parameters....", err.Error())
	}

	appConfig.IDPConfig.URL = idpConfig.URL
	appConfig.IDPConfig.ClientID = idpConfig.ClientID
	appConfig.IDPConfig.ClientSecret = idpConfig.ClientSecret
	appConfig.IDPConfig.TokenEndpointAuthMethod = idpConfig.TokenEndpointAuthMethod
}

func initBaseConfig(file string) {

	config := Config{}

	configFile, err := os.Open(file)
	defer configFile.Close()
	if err != nil {
		log.Fatal("Please check the config.json parameters....", err.Error())
	}
	jsonParser := json.NewDecoder(configFile)
	err = jsonParser.Decode(&config)
	if err != nil {
		log.Fatal("Could not decode config.json ....", err.Error())
	}

	appConfig = config
}

//AppConfig returns the current AppConfig
func GetConfig() *Config {

	if reflect.DeepEqual(appConfig, Config{}) {
		_, b, _, _ := runtime.Caller(0)
		initBaseConfig(filepath.Join(filepath.Dir(b), "../.."+CONFIG_JSON))

		if !appConfig.Debug {
			log.SetLevel(log.WarnLevel)
		} else {
			log.SetLevel(log.DebugLevel)
		}

		log.WithFields(log.Fields{
			"Config": fmt.Sprintf("%+v", appConfig),
		}).Debug("Configuration set to:")

		if len(appConfig.IDPConfig.URL) == 0 {
			log.Debug("setting IDP from env")
			initIDPConfigFromEnv()
		}

	}

	return &appConfig
}
