package auth

import (
	"encoding/gob"
	"encoding/json"
	"log"
	"net/http"
	"time"

	oidc "github.com/coreos/go-oidc"
	"github.com/gorilla/sessions"

	"golang.org/x/net/context"
	"golang.org/x/oauth2"

	appconfig "github.com/SAP-samples/kyma-runtime-extension-samples/api-mssql-go-auth/internal/config"

	mathrand "math/rand"

	"github.com/quasoft/memstore"
)

const sessionName string = "sample-session"

type oidcConfig struct {
	provider *oidc.Provider
	verifier *oidc.IDTokenVerifier
	config   oauth2.Config
	store    *memstore.MemStore
	state    string
}

type oidcResp struct {
	OAuth2Token   *oauth2.Token
	IDTokenClaims *json.RawMessage
}

func InitOIDC() *oidcConfig {

	oidcConfig := &oidcConfig{}
	appconfig := appconfig.GetConfig()

	ctx := context.Background()
	var err error
	oidcConfig.provider, err = oidc.NewProvider(ctx, appconfig.Issuer)
	if err != nil {
		log.Printf("Issuer did not match trying: %s/oauth/token", appconfig.Issuer)
		oidcConfig.provider, err = oidc.NewProvider(ctx, appconfig.Issuer+"/oauth/token")
		if err != nil {
			log.Fatal(err)
		}
	}

	oidcConfig.verifier = oidcConfig.provider.Verifier(&oidc.Config{
		ClientID: appconfig.ClientID,
	})

	oidcConfig.config = oauth2.Config{
		ClientID:     appconfig.ClientID,
		ClientSecret: appconfig.ClientSecret,
		Endpoint:     oidcConfig.provider.Endpoint(),
		RedirectURL:  appconfig.RedirectURL,
		Scopes:       []string{oidc.ScopeOpenID},
	}

	if appconfig.Token_endpoint_auth_method == "client_secret_post" {
		oidcConfig.config.Endpoint.AuthStyle = oauth2.AuthStyleInParams
	}

	//See https://github.com/gorilla/sessions#store-implementations
	log.Println("--------USING MEMORY STORAGE - THIS IS NOT RECOMMENDED!--------")
	oidcConfig.store = memstore.NewMemStore([]byte(appconfig.CookieKey))

	oidcConfig.store.Options = &sessions.Options{
		Path:     "/",
		MaxAge:   60 * 15,
		HttpOnly: true,
		Secure:   false,
	}

	gob.Register(&oidcResp{})

	return oidcConfig

}

func (oc *oidcConfig) GetUser(w http.ResponseWriter, r *http.Request) {
	session, err := oc.store.Get(r, sessionName)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	sessionInfo := getSessionInfo(session)

	js, _ := json.Marshal(sessionInfo.IDTokenClaims)

	w.Header().Set("Content-Type", "application/json")
	w.Write(js)
}

func (oc *oidcConfig) AuthHandler(next http.HandlerFunc) http.Handler {

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		session, err := oc.store.Get(r, sessionName)
		sessionInfo := getSessionInfo(session)
		isAuthenticated := false

		if sessionInfo == nil {
			log.Println("no session exists...")
			session.Values["reqPath"] = r.URL.Path
			err = session.Save(r, w)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
		} else {
			log.Printf("session exists for user %s and expires at %s \n", getEmail(sessionInfo.IDTokenClaims), sessionInfo.OAuth2Token.Expiry)
			now := time.Now()
			diff := sessionInfo.OAuth2Token.Expiry.Sub(now)
			if diff.Seconds() < 5 {
				log.Printf("refreshing session - will expire in %v seconds... \n", diff.Seconds())
				isAuthenticated = false
			} else {
				log.Printf("session will expire in %v seconds... \n", diff.Seconds())
				isAuthenticated = true
			}
		}

		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		if isAuthenticated {
			next.ServeHTTP(w, r)
		} else {
			oc.state = genState()
			http.Redirect(w, r, oc.config.AuthCodeURL(oc.state), http.StatusFound)
		}
	})
}

func (oc *oidcConfig) HandleCallback(w http.ResponseWriter, r *http.Request) {

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
	session, _ := oc.store.Get(r, sessionName)
	session.Values["OIDCResp"] = resp

	if err := idToken.Claims(&resp.IDTokenClaims); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	err = session.Save(r, w)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	http.Redirect(w, r, session.Values["reqPath"].(string), http.StatusSeeOther)

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
