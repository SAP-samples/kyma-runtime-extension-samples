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
func initK8sEnvConfig() {
	log.Info("initilizing K8 Env configuration....")

	err := envconfig.Init(&kubeConfig)
	if err != nil {
		for _, pair := range os.Environ() {
			log.Infoln(pair)
		}
		log.Fatal("Please check the configuration parameters....", err.Error())
	}
}

func initIDPEnvConifg() {
	log.Info("initilizing IDP configuration....")

	idpConfig := IDPConfig{}

	err := envconfig.Init(&idpConfig)
	if err != nil {
		for _, pair := range os.Environ() {
			log.Infoln(pair)
		}
		log.Fatal("Please check the IDP configuration parameters....", err.Error())
	}

	appConfig.AppAuthProxy.IDPConfig = idpConfig
}

func initConfig(file string) {

	log.Info("initilizing configuration....")

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

		initIDPEnvConifg()
		setK8Config()

	}

	return &appConfig
}

func setK8Config() {

	var err error
	appConfig.K8Config.ClusterConfig, err = rest.InClusterConfig()
	if err != nil {
		log.Infof("No incluster config found, will try loading kubeconfig from environment, %s", err.Error())
		initK8sEnvConfig()
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
		log.Fatal(err)
	}

	appConfig.K8Config.APIRuleClientset, err = client.New(appConfig.K8Config.ClusterConfig, client.Options{Scheme: s})
	if err != nil {
		log.Fatal(err)
	}

}
