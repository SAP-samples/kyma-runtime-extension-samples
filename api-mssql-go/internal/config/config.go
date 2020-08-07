package config

import (
	"fmt"
	"log"

	"github.com/kelseyhightower/envconfig"
)

var appConfig Config

//Config struct to hold the app config
type Config struct {
	Server   string
	Port     string
	User     string
	Password string
	Database string
}

//InitConfig initializes the AppConfig
func initConfig() {
	fmt.Println("initilizing configuration....")
	appConfig = Config{}

	err := envconfig.Process("myapp", &appConfig)
	if err != nil {
		log.Fatal("Please check the database connection parameters....", err.Error())
	}
}

//AppConfig returns the current AppConfig
func GetConfig() Config {
	if appConfig == (Config{}) {
		initConfig()
	}
	return appConfig
}
