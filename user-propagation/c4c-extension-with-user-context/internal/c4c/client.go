package c4c

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/SAP-samples/kyma-runtime-extension-samples/user-propagation/c4c-extension-with-user-context/internal/destination"
	"github.com/SAP-samples/kyma-runtime-extension-samples/user-propagation/c4c-extension-with-user-context/internal/model"
	"github.com/SAP-samples/kyma-runtime-extension-samples/user-propagation/c4c-extension-with-user-context/internal/utils"
	"io/ioutil"
	"net/http"
)

type Client struct {
	destinationClient *destination.Client
	client            *http.Client
}

func New() *Client {
	client := &http.Client{}
	destinationClient := destination.NewClient()
	return &Client{
		destinationClient: destinationClient,
		client:            client,
	}
}

func (c *Client) CreateTask(jwtToken string, task model.Task) (error, *model.CreatedTask) {
	exchangeTokenResp, err := c.destinationClient.ExchangeToken(jwtToken)
	if err != nil {
		return err, nil
	}
	return c.executeCreateTaskReq(exchangeTokenResp, task)
}

func (c *Client) executeCreateTaskReq(exchangeTokenResp *model.ExchangeTokenResp, task model.Task) (error, *model.CreatedTask) {
	bs, err := json.Marshal(task)
	if err != nil {
		return err, nil
	}
	req, err := http.NewRequest(http.MethodPost,
		utils.FullUrl(exchangeTokenResp.DestinationConfiguration.URL,
			"/TasksCollection"), bytes.NewReader(bs))
	if err != nil {
		return err, nil
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json")
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", exchangeTokenResp.AuthTokens[0].Value))
	resp, err := c.client.Do(req)
	if err != nil {
		return err, nil
	}

	defer resp.Body.Close()
	fmt.Printf("%+v\n", resp)

	responseBytes, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return err, nil
	}

	var createdTaskResp model.CreatedTaskResponse
	err = json.Unmarshal(responseBytes, &createdTaskResp)
	if err != nil {
		return err, nil
	}
	return nil, &createdTaskResp.D.Results
}
