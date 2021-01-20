package auth

import (
	"encoding/gob"
	"encoding/json"
	"io/ioutil"
	"strings"

	"net/http"
	"time"

	log "github.com/sirupsen/logrus"

	oidc "github.com/coreos/go-oidc"
	"github.com/gorilla/sessions"

	"golang.org/x/net/context"
	"golang.org/x/oauth2"

	mathrand "math/rand"

	appconfig "github.com/SAP-samples/kyma-runtime-extension-samples/app-auth-proxy/internal/config"
)

type InitConfig struct {
	ClientID                   string
	ClientSecret               string
	URL                        string
	RedirectURL                string
	Token_endpoint_auth_method string
	CookieKey                  string
	XSAppName                  string
}

type OIDCConfig struct {
	url         string
	provider    *oidc.Provider
	verifier    *oidc.IDTokenVerifier
	config      oauth2.Config
	store       sessions.Store
	state       string
	sessionName string
	xsappname   string
}

type oidcResp struct {
	OAuth2Token   *oauth2.Token
	IDTokenClaims *json.RawMessage
}

type groups struct {
	Group []struct {
		Value   string `json:"value"`
		Display string `json:"display"`
		Type    string `json:"type"`
	} `json:"groups"`
}

func InitOIDC(appConfig *InitConfig, store sessions.Store, sessionName string) *OIDCConfig {

	oidcConfig := &OIDCConfig{}
	ctx := context.Background()
	var err error

	oidcConfig.url = appConfig.URL

	oidcConfig.provider, err = oidc.NewProvider(ctx, appConfig.URL)
	if err != nil {
		log.Infof("Issuer/Provider URL did not match trying: %s/oauth/token", appConfig.URL)
		oidcConfig.provider, err = oidc.NewProvider(ctx, appConfig.URL+"/oauth/token")
		if err != nil {
			log.Fatal(err)
		}
	}

	oidcConfig.sessionName = sessionName
	oidcConfig.xsappname = appConfig.XSAppName

	oidcConfig.verifier = oidcConfig.provider.Verifier(&oidc.Config{
		ClientID: appConfig.ClientID,
	})

	oidcConfig.config = oauth2.Config{
		ClientID:     appConfig.ClientID,
		ClientSecret: appConfig.ClientSecret,
		Endpoint:     oidcConfig.provider.Endpoint(),
		RedirectURL:  appConfig.RedirectURL,
		Scopes:       []string{oidc.ScopeOpenID},
	}

	if appConfig.Token_endpoint_auth_method == "client_secret_post" {
		oidcConfig.config.Endpoint.AuthStyle = oauth2.AuthStyleInParams
	}

	oidcConfig.store = store

	gob.Register(&oidcResp{})
	gob.Register(&groups{})

	return oidcConfig

}

func (oc *OIDCConfig) AuthN_Handler(next http.Handler) http.Handler {

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		session, err := oc.store.Get(r, oc.sessionName)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		sessionInfo := getSessionInfo(session)
		isAuthenticated := false

		if sessionInfo == nil {
			log.Infof("no session exists or was found for request path: %s", r.URL.Path)
			session.Values["reqPath"] = r.URL.Path
			err = session.Save(r, w)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
		} else {
			now := time.Now()
			diff := sessionInfo.OAuth2Token.Expiry.Sub(now)

			log.WithFields(log.Fields{
				"user":                  getEmail(sessionInfo.IDTokenClaims),
				"expires at":            sessionInfo.OAuth2Token.Expiry,
				"expiration in seconds": diff.Seconds(),
				"request path":          r.URL.Path,
			}).Info("Session exists:")

			if diff.Seconds() < 5 {
				log.Info("Session Expired - will refresh")
				isAuthenticated = false
			} else {
				isAuthenticated = true
			}
		}

		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		if isAuthenticated {
			ctx := context.WithValue(r.Context(), "token", sessionInfo.OAuth2Token.AccessToken)
			next.ServeHTTP(w, r.WithContext(ctx))
		} else {
			oc.state = genState()
			//http.StatusTemporaryRedirect
			http.Redirect(w, r, oc.config.AuthCodeURL(oc.state), http.StatusFound)
		}
	})
}

func (oc *OIDCConfig) HandleCallback(w http.ResponseWriter, r *http.Request) {

	log.WithFields(log.Fields{
		"state": oc.state,
		"code":  r.URL.Query().Get("code"),
	}).Info("HandleCallback:")

	ctx := context.WithValue(r.Context(), "state", oc.state)

	if r.URL.Query().Get("state") != oc.state {
		http.Error(w, "state did not match", http.StatusBadRequest)
		return
	}

	oauth2Token, err := oc.config.Exchange(ctx, r.URL.Query().Get("code"))
	if err != nil {
		http.Error(w, "Failed to exchange token: "+err.Error(), http.StatusInternalServerError)
		return
	}

	rawIDToken, ok := oauth2Token.Extra("id_token").(string)
	if !ok {
		http.Error(w, "No id_token field in oauth2 token.", http.StatusInternalServerError)
		return
	}
	idToken, err := oc.verifier.Verify(ctx, rawIDToken)
	if err != nil {
		http.Error(w, "Failed to verify ID Token: "+err.Error(), http.StatusInternalServerError)
		return
	}

	resp := oidcResp{oauth2Token, new(json.RawMessage)}
	session, _ := oc.store.Get(r, oc.sessionName)
	session.Values["OIDCResp"] = resp

	if err := idToken.Claims(&resp.IDTokenClaims); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	userid := getUserId(resp.IDTokenClaims)
	oc.setUserGroups(userid, oauth2Token.AccessToken, session)

	err = session.Save(r, w)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	http.Redirect(w, r, session.Values["reqPath"].(string), http.StatusSeeOther)

}

//methodScope [{HTTPMethod:* Scope:*}]
func (oc *OIDCConfig) AuthZ_Handler(methodScopes appconfig.MethodScopes, next http.Handler) http.Handler {

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		httpMethod := r.Method
		isAuthorized := false

		//check if methodScopes have been defined
		if len(methodScopes) == 0 {
			log.Debugf("Authorized request - no restrictions are defined")
			isAuthorized = true
		}

		//check the scopes assigned to the httpMethod
		var scopesForMethod []string
		var scopeWAppName string
		for _, value := range methodScopes {
			if value.HTTPMethod == "*" && value.Scope == "*" {
				log.Debugf("Authorized request - no restrictions are defined")
				isAuthorized = true
				break
			}
			if httpMethod == strings.ToUpper(value.HTTPMethod) && value.Scope == "*" {
				log.Debugf("Authorized request - no restrictions are defined for httpMethod %s", httpMethod)
				isAuthorized = true
				break
			}
			if httpMethod == strings.ToUpper(value.HTTPMethod) || value.HTTPMethod == "*" {
				scopeWAppName = strings.Replace(value.Scope, "$XSAPPNAME", oc.xsappname, 1)
				log.Debugf("HTTPMethod: %s requires scope: %+v", r.Method, scopeWAppName)
				scopesForMethod = append(scopesForMethod, scopeWAppName)
			}
		}

		if !isAuthorized {
			//get the user session
			session, err := oc.store.Get(r, oc.sessionName)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			//get the user groups which contains the scopes
			sessionGroups := getSessionGroups(session)

			//iterate the user groups, remove the app name and compare to the scopesForMethod
		doneSearching:
			for _, value := range sessionGroups.Group {
				for _, methodScope := range scopesForMethod {
					if methodScope == value.Display {
						log.Debugf("Authorized request - Found match on: %s", value.Display)
						isAuthorized = true
						break doneSearching
					}
				}
			}
		}

		if isAuthorized {
			next.ServeHTTP(w, r)
		} else {
			log.Debugf("No matching scopes for user - Unauthorized user")
			http.Error(w, "Unauthorized.", http.StatusUnauthorized)
		}
	})

}

func (oc *OIDCConfig) setUserGroups(userID string, token string, session *sessions.Session) {
	userURL := oc.url + "/Users/" + userID

	req, err := http.NewRequest("GET", userURL, nil)
	if err != nil {
		log.Warnf("No groups were determined for user %s", userID)
		return
	}

	req.Header.Set("Authorization", "Bearer "+token)
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Warnf("No groups were determined for user %s", userID)
		return
	}

	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)

	groups := &groups{}
	json.Unmarshal(body, &groups)

	session.Values["Groups"] = groups

	log.Debugf("Groups for user id: %s: %s", userID, groups)
}

func (oc *OIDCConfig) GetUserGroups(w http.ResponseWriter, r *http.Request) {

	session, err := oc.store.Get(r, oc.sessionName)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	sessionGroupInfo := getSessionGroups(session)

	if sessionGroupInfo == nil {
		w.Write([]byte("Could not find any groups for user"))
		return
	}

	js, _ := json.Marshal(sessionGroupInfo.Group)
	w.Header().Set("Content-Type", "application/json")
	w.Write(js)
}

func (oc *OIDCConfig) GetUser(w http.ResponseWriter, r *http.Request) {
	session, err := oc.store.Get(r, oc.sessionName)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	sessionInfo := getSessionInfo(session)

	if sessionInfo == nil {
		w.Write([]byte("Could not find any session information"))
		return
	}

	js, _ := json.Marshal(sessionInfo.IDTokenClaims)
	w.Header().Set("Content-Type", "application/json")
	w.Write(js)
}

func getEmail(claimsData *json.RawMessage) string {
	var mail struct {
		Email string `json:"email"`
		Mail  string `json:"mail"`
	}

	err := json.Unmarshal(*claimsData, &mail)

	if err != nil {
		return "no email/mail found"
	}

	if mail.Email != "" {
		return mail.Email
	} else {
		return mail.Mail
	}
}

func getUserId(claimsData *json.RawMessage) string {
	var user struct {
		ID string `json:"user_id"`
	}

	err := json.Unmarshal(*claimsData, &user)

	if err != nil {
		return "no user found"
	}

	return user.ID
}

func getSessionGroups(s *sessions.Session) *groups {
	val := s.Values["Groups"]
	var sessionInfo = &groups{}
	sessionInfo, ok := val.(*groups)
	if !ok {
		return nil
	}
	return sessionInfo
}

func getSessionInfo(s *sessions.Session) *oidcResp {
	val := s.Values["OIDCResp"]
	var sessionInfo = &oidcResp{}
	sessionInfo, ok := val.(*oidcResp)
	if !ok {
		return nil
	}
	return sessionInfo
}

func genState() string {
	// Generate random state
	var letterRunes = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")

	b := make([]rune, 40)
	for i := range b {
		b[i] = letterRunes[mathrand.Intn(len(letterRunes))]
	}
	return string(b)
}
