package saas

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httputil"
	"path"
	"strings"

	appconfig "github.com/SAP-samples/kyma-runtime-extension-samples/saas-provisioning/internal/config"

	"reflect"

	"github.com/dgrijalva/jwt-go"

	log "github.com/sirupsen/logrus"
)

func Provision(w http.ResponseWriter, r *http.Request) {
	log.Println("---- provision ----")
	dumpReq(r)

	info, err := getAdditionalInformation(r)
	if err != nil {
		log.Error("No additionalInformation data found in body")
		w.WriteHeader(http.StatusForbidden)
	}

	scopeToCheck := info.SubscriptionAppID + ".Callback"

	if checkScope(r.Header.Get("authorization"), scopeToCheck) == false {
		w.WriteHeader(http.StatusForbidden)
		return
	}

	c := appconfig.GetConfig()
	tenant := path.Base(r.URL.Path)

	w.Write([]byte(c.AppURL + "/" + tenant))
}

func Deprovision(w http.ResponseWriter, r *http.Request) {
	log.Infoln("---- deprovision ----")
	dumpReq(r)

	w.WriteHeader(http.StatusOK)
}

func dumpReq(req *http.Request) {
	// Save a copy of this request for debugging.
	requestDump, err := httputil.DumpRequest(req, true)
	if err != nil {
		log.Println(err)
	}
	log.Println(string(requestDump))
}

func getAdditionalInformation(r *http.Request) (additionalInformation, error) {

	var info additionalInformation

	err := json.NewDecoder(r.Body).Decode(&info)
	if err != nil {
		return info, err
	}

	return info, nil
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
