package handler

import (
	appconfig "github.com/SAP-samples/kyma-runtime-extension-samples/saas-provisioning/internal/config"
)

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
