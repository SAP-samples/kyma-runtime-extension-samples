package config

import (
	"encoding/json"
	"fmt"
	"os"
	"reflect"

	"github.com/vrischmann/envconfig"

	log "github.com/sirupsen/logrus"
)

const CONFIG_JSON = "../../config.json"

var appConfig AppConfig

type AppConfig struct {
	IDPConfig  idpConfig
	BaseConfig baseConfig
}

type baseConfig struct {
	Routes []struct {
		Path        string `json:"path"`
		Priority    int    `json:"priority"`
		Protected   bool   `json:"protected"`
		Stripprefix bool   `json:"stripprefix"`
		Target      string `json:"target"`
	} `json:"routes"`
	TokenEndpointAuthMethod string `json:"token_endpoint_auth_method"`
	RedirectURI             string `json:"redirect_uri"`
	Debug                   bool   `json:"debug"`
	Cookie                  struct {
		SessionName   string `json:"session_name"`
		MaxAgeSeconds int    `json:"max_age_seconds"`
		Key           string `json:"key"`
		HttpOnly      bool   `json:"httponly"`
		Secure        bool   `json:"secure"`
		SameSite      int    `json:"samesite"`
	} `json:"cookie"`
}

type idpConfig struct {
	ClientID                   string `envconfig:"IDP_clientid"`
	ClientSecret               string `envconfig:"IDP_clientsecret"`
	Issuer                     string `envconfig:"IDP_url"`
	Token_endpoint_auth_method string `envconfig:"IDP_token_endpoint_auth_method,default=client_secret_basic"`
}

//InitConfig initializes the AppConfig
func initIDPConfig() {
	idpConfig := idpConfig{}

	err := envconfig.Init(&idpConfig)
	if err != nil {
		for _, pair := range os.Environ() {
			log.Println(pair)
		}
		log.Fatal("Please check the configuration parameters....", err.Error())
	}

	appConfig.IDPConfig = idpConfig
}

func initBaseConfig(file string) {

	baseConfig := baseConfig{}

	configFile, err := os.Open(file)
	defer configFile.Close()
	if err != nil {
		log.Fatal("Please check the config.json parameters....", err.Error())
	}
	jsonParser := json.NewDecoder(configFile)
	err = jsonParser.Decode(&baseConfig)
	if err != nil {
		log.Fatal("Could not decode config.json ....", err.Error())
	}

	appConfig.BaseConfig = baseConfig
}

//AppConfig returns the current AppConfig
func GetConfig() AppConfig {

	if reflect.DeepEqual(appConfig, AppConfig{}) {
		initIDPConfig()
		initBaseConfig(CONFIG_JSON)

		if !appConfig.BaseConfig.Debug {
			log.SetLevel(log.WarnLevel)
		} else {
			log.SetLevel(log.DebugLevel)
		}

		log.WithFields(log.Fields{
			"BaseConfig": fmt.Sprintf("%+v", appConfig.BaseConfig),
			"IDPConfig":  fmt.Sprintf("%+v", appConfig.IDPConfig),
		}).Debug("Configuration set to:")
	}

	log.Println("appconfig.....")
	log.Printf("%+v", appConfig.BaseConfig)

	return appConfig
}
