package config

import (
	"log"
	"os"

	"github.com/vrischmann/envconfig"
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
