package api

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httputil"
	"path"
	"strings"

	"errors"

	appconfig "github.com/SAP-samples/kyma-runtime-extension-samples/saas-provisioning/internal/config"
	"github.com/SAP-samples/kyma-runtime-extension-samples/saas-provisioning/internal/handler"

	"reflect"

	"github.com/dgrijalva/jwt-go"

	log "github.com/sirupsen/logrus"
)

func Provision(w http.ResponseWriter, r *http.Request) {
	log.Println("---- provision ----")
	dumpReq(r)

	handler, err := getInfoVerifyScope(r)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	handler.Tenant = getTenantFromPath(r)
	handler.AppConfig = appconfig.GetConfig()

	err = handler.ProvisionTenent()
	if err != nil {
		log.Error(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	tenantURL := handler.AppConfig.AppName + "-" + handler.Tenant + "." + handler.AppConfig.Domain

	w.Write([]byte("https://" + tenantURL))
}

func Deprovision(w http.ResponseWriter, r *http.Request) {
	log.Infoln("---- deprovision ----")
	dumpReq(r)

	handler, err := getInfoVerifyScope(r)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	handler.Tenant = getTenantFromPath(r)
	handler.AppConfig = appconfig.GetConfig()

	err = handler.DeprovisionTenent()
	if err != nil {
		log.Error(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func getInfoVerifyScope(r *http.Request) (handler.Config, error) {

	handlerCfg := handler.Config{}

	var err error
	handlerCfg.RequestInfo, err = getAdditionalInformation(r)
	if err != nil {
		log.Error(err)
		return handlerCfg, err
	}

	appConfig := appconfig.GetConfig()
	scopeToCheck := appConfig.AppAuthProxy.IDPConfig.XSAppName + ".Callback"

	if checkScope(r.Header.Get("authorization"), scopeToCheck) == false {
		err := errors.New("Not Authorized!")
		log.Error(err)
		return handlerCfg, err
	}

	return handlerCfg, nil
}

func dumpReq(req *http.Request) {
	// Save a copy of this request for debugging.
	requestDump, err := httputil.DumpRequest(req, true)
	if err != nil {
		log.Println(err)
	}
	log.Println(string(requestDump))
}

//token has already been verified by the api gateway, lets verify the scope
func checkScope(tokenString string, scopeToCheck string) bool {

	log.Infof("Will check for scope %s", scopeToCheck)

	tok, err := stripBearerPrefixFromTokenString(tokenString)
	if err != nil {
		log.Error(err)
		return false
	}

	token, _, err := new(jwt.Parser).ParseUnverified(tok, jwt.MapClaims{})
	if err != nil {
		log.Error(err)
		return false
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok {
		s := reflect.ValueOf(claims["scope"])
		for i := 0; i < s.Len(); i++ {
			if fmt.Sprintf("%v", s.Index(i)) == scopeToCheck {
				log.Infoln("Valid scope found...")
				return true
			}
		}

	} else {
		log.Error(err)
		return false
	}

	log.Infoln("Valid scope not found...")
	return false
}

func stripBearerPrefixFromTokenString(tok string) (string, error) {
	// Should be a bearer token
	if len(tok) > 6 && strings.ToUpper(tok[0:7]) == "BEARER " {
		return tok[7:], nil
	}
	return tok, nil
}

func getAdditionalInformation(r *http.Request) (*handler.RequestInfo, error) {

	info := handler.RequestInfo{}

	err := json.NewDecoder(r.Body).Decode(&info)
	if err != nil {
		log.Error("No additionalInformation data found in body")
		return &info, err
	}

	return &info, nil
}

func getTenantFromPath(r *http.Request) string {
	return path.Base(r.URL.Path)
}
