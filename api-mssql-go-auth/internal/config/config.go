package config

import (
	"log"
	"os"

	"github.com/vrischmann/envconfig"
)

var appConfig Config

//Config struct to hold the app config
type Config struct {
	Server             string `envconfig:"MYAPP_host"`
	Port               string `envconfig:"MYAPP_port,default=1433"`
	Username           string `envconfig:"MYAPP_username"`
	Password           string `envconfig:"MYAPP_password"`
	Database           string `envconfig:"MYAPP_database"`
	ReverseProxyTarget string `envconfig:"MYAPP_reverse_proxy_target,default=http://localhost:3000/"`

	ClientID                   string `envconfig:"IDP_clientid"`
	ClientSecret               string `envconfig:"IDP_clientsecret"`
	Issuer                     string `envconfig:"IDP_url"`
	RedirectURL                string `envconfig:"IDP_redirect_uri"`
	Token_endpoint_auth_method string `envconfig:"IDP_token_endpoint_auth_method,default=client_secret_basic"`
	CookieKey                  string `envconfig:"IDP_CookieKey,default=thisisnotsecure"`
	IsClientRedirect           bool   `envconfig:"IDP_is_client_redirect,default=true"`
}

//InitConfig initializes the AppConfig
func initConfig() {
	log.Println("initilizing configuration....")
	appConfig = Config{}

	err := envconfig.Init(&appConfig)
	if err != nil {
		for _, pair := range os.Environ() {
			log.Println(pair)
		}
		log.Fatal("Please check the configuration parameters....", err.Error())
	}
}

//AppConfig returns the current AppConfig
func GetConfig() Config {
	if appConfig == (Config{}) {
		initConfig()
	}
	return appConfig
}
