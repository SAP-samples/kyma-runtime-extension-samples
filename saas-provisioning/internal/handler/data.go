package handler

import (
	appconfig "github.com/SAP-samples/kyma-runtime-extension-samples/saas-provisioning/internal/config"
)

// type config struct {
// 	*appconfig.AppConfig
// }
type Config struct {
	Tenant      string
	RequestInfo *RequestInfo
	AppConfig   *appconfig.AppConfig
}

type RequestInfo struct {
	SubscriptionAppID      string            `json:"subscriptionAppId"`
	SubscriptionAppName    string            `json:"subscriptionAppName"`
	SubscribedTenantID     string            `json:"subscribedTenantId"`
	SubscribedSubAccountID string            `json:"subscribedSubaccountId"`
	SubscribedSubdomain    string            `json:"subscribedSubdomain"`
	GlobalAccountGUID      string            `json:"globalAccountGUID"`
	SubscribedLicenseType  string            `json:"subscribedLicenseType"`
	UserID                 string            `json:"userId"`
	AdditionalInformation  clientinformation `json:"additionalInformation"`
}

type clientinformation struct {
	ClientID     string `json:"clientid"`
	ClientSecret string `json:"clientsecret"`
	TokenURL     string `json:"tokenurl"`
}

// type config struct {
// 	App              appconfig.Config
// 	ClusterConfig    *rest.Config
// 	Clientset        *kubernetes.Clientset
// 	APIRuleClientset client.Client
// }

// type HTTPMethodScope struct {
// 	HTTPMethod string `json:"http_method"`
// 	Scope      string `json:"scope"`
// }

// type Route struct {
// 	Path             string            `json:"path"`
// 	Priority         int               `json:"priority"`
// 	Protected        bool              `json:"protected"`
// 	RemoveFromPath   string            `json:"remove_from_path"`
// 	Target           string            `json:"target"`
// 	HTTPMethodScopes []HTTPMethodScope `json:"http_method_scopes,omitempty"`
// }

// type AppAuthProxyConfig struct {
// 	Routes      []Route `json:"routes"`
// 	RedirectURI string  `json:"redirect_uri"`
// 	IdpConfig   struct {
// 		URL          string `json:"url"`
// 		Clientsecret string `json:"clientsecret"`
// 		Clientid     string `json:"clientid"`
// 	} `json:"idp_config"`
// 	Debug      bool `json:"debug"`
// 	RedisStore struct {
// 		Addr     string `json:"addr"`
// 		Password string `json:"password"`
// 		Db       int    `json:"db"`
// 	} `json:"redis_store"`
// 	Cookie struct {
// 		SessionName   string `json:"session_name"`
// 		MaxAgeSeconds int    `json:"max_age_seconds"`
// 		Key           string `json:"key"`
// 		Httponly      bool   `json:"httponly"`
// 	} `json:"cookie"`
// }
