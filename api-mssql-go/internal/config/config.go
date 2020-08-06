package config

import (
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
func InitConfig() {
	appConfig = Config{}

	err := envconfig.Process("myapp", &appConfig)
	if err != nil {
		log.Fatal("database connection parameters not defined....", err.Error())
	}
}

//AppConfig returns the current AppConfig
func GetConfig() Config {
	return appConfig
}
