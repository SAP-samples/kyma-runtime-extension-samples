package config

import (
	"encoding/json"
	"os"
	"path/filepath"
	"reflect"

	"runtime"

	"github.com/vrischmann/envconfig"
	k8runtime "k8s.io/apimachinery/pkg/runtime"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/clientcmd"
	"sigs.k8s.io/controller-runtime/pkg/client"

	log "github.com/sirupsen/logrus"

	apigatewayv1alpha1 "github.com/kyma-incubator/api-gateway/api/v1alpha1"
)

const CONFIG_JSON = "/config/config.json"

var appConfig AppConfig
var kubeConfig Kubeconfig

//InitConfig initializes the AppConfig
func initEnvConfig() {
	log.Info("initilizing configuration....")

	err := envconfig.Init(&kubeConfig)
	if err != nil {
		for _, pair := range os.Environ() {
			log.Infoln(pair)
		}
		log.Warn("Please check the configuration parameters....", err.Error())
	}
}

func initConfig(file string) {

	configFile, err := os.Open(file)
	defer configFile.Close()
	if err != nil {
		log.Fatal("Please check the config.json parameters....", err.Error())
	}
	jsonParser := json.NewDecoder(configFile)
	err = jsonParser.Decode(&appConfig)
	if err != nil {
		log.Fatal("Could not decode config.json ....", err.Error())
	}

}

//AppConfig returns the current AppConfig
func GetConfig() *AppConfig {
	if reflect.DeepEqual(appConfig, AppConfig{}) {

		appConfig = AppConfig{}

		_, b, _, _ := runtime.Caller(0)
		initConfig(filepath.Join(filepath.Dir(b), "../.."+CONFIG_JSON))

		if !appConfig.Debug {
			log.SetLevel(log.WarnLevel)
		} else {
			log.SetLevel(log.DebugLevel)
		}

		initEnvConfig()
		setK8Config()

	}

	return &appConfig
}

func setK8Config() {

	var err error
	appConfig.K8Config.ClusterConfig, err = rest.InClusterConfig()
	if err != nil {
		log.Infof("No incluster config found, will try loading kubeconfig, %s", err.Error())
		// use the current context in kubeconfig
		log.Infof("trying to load kubeconfig from %s", kubeConfig.Path)
		appConfig.K8Config.ClusterConfig, err = clientcmd.BuildConfigFromFlags("", kubeConfig.Path)
		if err != nil {
			log.Fatal(err)
		}
	}

	appConfig.K8Config.Clientset, err = kubernetes.NewForConfig(appConfig.K8Config.ClusterConfig)
	if err != nil {
		log.Fatal(err)
	}

	s := k8runtime.NewScheme()
	err = apigatewayv1alpha1.AddToScheme(s)
	if err != nil {
		log.Error(err)
	}

	appConfig.K8Config.APIRuleClientset, err = client.New(appConfig.K8Config.ClusterConfig, client.Options{Scheme: s})
	if err != nil {
		log.Error(err)
	}

}
