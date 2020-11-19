package router

import (
	"github.com/gorilla/mux"
	"github.com/SAP-samples/kyma-runtime-extension-samples/user-propagation/c4c-extension-with-user-context/internal/handlers"
	"net/http"
)

func New() http.Handler {
	router := mux.NewRouter()
	router.HandleFunc("/tasks", handlers.NewDispatcher().CreateTask).Methods(http.MethodPost)
	return router
}
