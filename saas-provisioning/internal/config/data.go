package config

import (
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"
	"sigs.k8s.io/controller-runtime/pkg/client"
)

type Kubeconfig struct {
	Path string `envconfig:"KUBECONFIG"`
}

//Config struct to hold the app config
type AppConfig struct {
	K8Config                  K8Config
	Domain                    string `json:"domain"`
	AppName                   string `json:"appname"`
	Namespace                 string `json:"namespace"`
	Image                     string `json:"image"`
	AppAuthProxyImage         string `json:"appauthproxy_image"`
	AppAuthProxySvcTargetPort int32  `json:"appauthproxy_svc_target_port"`
	AppAuthProxy              AppAuthProxy
	Debug                     bool `json:"debug"`
}

type AppAuthProxy struct {
	Routes      []Route   `json:"routes"`
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

type K8Config struct {
	ClusterConfig    *rest.Config
	Clientset        *kubernetes.Clientset
	APIRuleClientset client.Client
}

type IDPConfig struct {
	ClientID                string `envconfig:"IDP_clientid"`
	ClientSecret            string `envconfig:"IDP_clientsecret"`
	URL                     string `envconfig:"IDP_url"`
	IdentityZone            string `envconfig:"IDP_identityzone"`
	TokenEndpointAuthMethod string `envconfig:"IDP_token_endpoint_auth_method,default=client_secret_basic"`
	XSAppName               string `envconfig:"IDP_xsappname"`
}

type MethodScopes struct {
	HTTPMethod string `json:"http_method"`
	Scope      string `json:"scope"`
}

type Route struct {
	Path             string         `json:"path"`
	Priority         int            `json:"priority"`
	Protected        bool           `json:"protected"`
	RemoveFromPath   string         `json:"remove_from_path"`
	Target           string         `json:"target"`
	K8Config         k8config       `json:"k8config,omitempty"`
	HTTPMethodScopes []MethodScopes `json:"http_method_scopes,omitempty"`
}

type k8config struct {
	Image         string        `json:"image"`
	SvcTargetPort int32         `json:"svc_target_port"`
	VolumeMounts  []VolumeMount `json:"volumeMounts"`
	Volumes       []Volume      `json:"volumes"`
}

type VolumeMount struct {
	MountPath string `json:"mountPath"`
	Name      string `json:"name"`
	SubPath   string `json:"subPath"`
}

type Volume struct {
	Name      string `json:"name"`
	ConfigMap struct {
		Name     string `json:"name"`
		FilePath string `json:"filePath"`
		FileKey  string `json:"fileKey"`
	} `json:"configMap"`
}
