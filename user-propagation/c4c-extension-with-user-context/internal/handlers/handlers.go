package handlers

import (
	"encoding/json"
	"github.com/SAP-samples/kyma-runtime-extension-samples/user-propagation/c4c-extension-with-user-context/internal/c4c"
	"github.com/SAP-samples/kyma-runtime-extension-samples/user-propagation/c4c-extension-with-user-context/internal/model"
	"io/ioutil"
	"net/http"
	"strings"
)

type Dispatcher struct {
	c4cClient *c4c.Client
}

func NewDispatcher() *Dispatcher {
	return &Dispatcher{c4cClient: c4c.New()}
}

func (d *Dispatcher) CreateTask(w http.ResponseWriter, incoming *http.Request) {
	err, createdTaskBytes := d.doCreateTask(incoming)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	} else {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		_, _ = w.Write(createdTaskBytes)
	}
}

func (d *Dispatcher) doCreateTask(incoming *http.Request) (error, []byte) {
	jwtToken := d.getJwtToken(incoming)

	bs, err := ioutil.ReadAll(incoming.Body)
	if err != nil {
		return err, nil
	}

	var taskReq model.CreateTask
	err = json.Unmarshal(bs, &taskReq)
	if err != nil {
		return err, nil
	}
	defer incoming.Body.Close()

	task := model.NewTask(taskReq)
	err, createdTask := d.c4cClient.CreateTask(jwtToken, task)
	createdTaskBytes, err := json.Marshal(createdTask)
	return err, createdTaskBytes
}

func (d *Dispatcher) getJwtToken(incoming *http.Request) string {
	jwtToken := incoming.Header.Get("Authorization")
	return strings.Split(jwtToken, " ")[1]
}
