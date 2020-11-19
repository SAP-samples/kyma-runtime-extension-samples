package destination

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/dgraph-io/ristretto"
	"github.com/dgrijalva/jwt-go"
	"github.com/SAP-samples/kyma-runtime-extension-samples/user-propagation/c4c-extension-with-user-context/internal/config"
	"github.com/SAP-samples/kyma-runtime-extension-samples/user-propagation/c4c-extension-with-user-context/internal/model"
	"github.com/SAP-samples/kyma-runtime-extension-samples/user-propagation/c4c-extension-with-user-context/internal/utils"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/clientcredentials"
	"io/ioutil"
	"net/http"
	"time"
)

type Client struct {
	httpClient     *http.Client
	destinationUrl string
	cache          *ristretto.Cache
	parser         *jwt.Parser
}

func NewClient() *Client {
	cfg := config.GlobalConfig.Destination
	httpClient := createClient(cfg)
	cache, err := ristretto.NewCache(&ristretto.Config{
		MaxCost:     1000000,
		NumCounters: 10000,
		BufferItems: 64,
	})

	if err != nil {
		panic(err)
	}

	return &Client{
		httpClient:     httpClient,
		destinationUrl: utils.FullUrl(cfg.Url, cfg.Name),
		cache:          cache,
		parser:         &jwt.Parser{},
	}
}

func createClient(cfg config.Destination) *http.Client {
	oauthConfig := &clientcredentials.Config{
		ClientID:     cfg.OauthClientId,
		ClientSecret: cfg.OauthClientSecret,
		TokenURL:     cfg.OauthTokenUrl,
		AuthStyle:    oauth2.AuthStyleInParams,
	}
	return oauthConfig.Client(context.Background())
}

func (c *Client) ExchangeToken(jwtToken string) (*model.ExchangeTokenResp, error) {
	userName, err := c.x(jwtToken)
	if err != nil {
		return nil, err
	}

	cached, found := c.cache.Get(userName)

	if found {
		println("found in cache")
		return cached.(*model.ExchangeTokenResp), nil
	}

	request, err := http.NewRequest(http.MethodGet, c.destinationUrl, nil)
	if err != nil {
		return nil, err
	}
	request.Header.Set("X-user-token", jwtToken)
	resp, err := c.httpClient.Do(request)
	if err != nil {
		return nil, err
	}

	defer resp.Body.Close()
	bs, err := ioutil.ReadAll(resp.Body)
	var exchangeTokenResp model.ExchangeTokenResp
	if err != nil {
		return nil, err
	}
	err = json.Unmarshal(bs, &exchangeTokenResp)
	if err != nil {
		return nil, err
	}
	fmt.Printf("%+v\n", exchangeTokenResp)

	c.cache.SetWithTTL(userName, &exchangeTokenResp, 1, 3599*time.Second)

	return &exchangeTokenResp, nil
}

func (c *Client) x(jwtToken string) (string, error) {
	token, _, err := c.parser.ParseUnverified(jwtToken, jwt.MapClaims{})
	if err != nil {
		return "", err
	}
	claims := token.Claims.(jwt.MapClaims)

	userName, ok := claims["user_name"]
	if !ok {
		return "", errors.New("JWT token does not contain user_name")
	}

	userNameString, ok := userName.(string)
	if !ok {
		return "", errors.New("JWT token does not contain user_name as a string")
	}

	return userNameString, nil
}
