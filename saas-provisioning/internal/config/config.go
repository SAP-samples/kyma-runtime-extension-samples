package config

import (
	"os"

	"github.com/vrischmann/envconfig"

	log "github.com/sirupsen/logrus"
)

var appConfig Config

//Config struct to hold the app config
type Config struct {
	AppURL string `envconfig:"AppURL,default=http://localhost:8000"`
}

//InitConfig initializes the AppConfig
func initConfig() {
	log.Println("initilizing configuration....")
	appConfig = Config{}

	err := envconfig.Init(&appConfig)
	if err != nil {
		for _, pair := range os.Environ() {
			log.Infoln(pair)
		}
		log.Error("Please check the configuration parameters....", err.Error())
	}
}

//AppConfig returns the current AppConfig
func GetConfig() Config {
	if appConfig == (Config{}) {
		initConfig()
	}
	return appConfig
}
