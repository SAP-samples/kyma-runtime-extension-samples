package config

import (
	"github.com/vrischmann/envconfig"
)

var GlobalConfig AppConfig

type AppConfig struct {
	Destination Destination
}

type Destination struct {
	OauthTokenUrl     string
	OauthClientId     string
	OauthClientSecret string
	Url               string
	Name              string
}

func Init() {
	err := envconfig.Init(&GlobalConfig)
	if err != nil {
		panic(err)
	}
}
