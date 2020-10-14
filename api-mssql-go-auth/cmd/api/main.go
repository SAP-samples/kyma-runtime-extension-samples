package main

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"

	"github.com/SAP-samples/kyma-runtime-extension-samples/api-mssql-go/package/api"

	"github.com/SAP-samples/kyma-runtime-extension-samples/api-mssql-go-auth/internal/auth"
)

func main() {

	authOIDC := auth.InitOIDC()
	apiServer := api.InitAPIServer()

	router := mux.NewRouter().StrictSlash(true)
	router.HandleFunc("/oauth/callback", authOIDC.HandleCallback)

	router.Handle("/user", authOIDC.AuthHandler(http.HandlerFunc(authOIDC.GetUser))).Methods("GET")
	router.Handle("/orders", authOIDC.AuthHandler(http.HandlerFunc(apiServer.GetOrders))).Methods("GET")
	router.Handle("/orders/{id}", authOIDC.AuthHandler(http.HandlerFunc(apiServer.GetOrder))).Methods("GET")
	router.Handle("/orders/{id}", authOIDC.AuthHandler(http.HandlerFunc(apiServer.DeleteOrder))).Methods("DELETE")
	router.Handle("/orders/{id}", authOIDC.AuthHandler(http.HandlerFunc(apiServer.EditOrder))).Methods("PUT")
	router.Handle("/orders", authOIDC.AuthHandler(http.HandlerFunc(apiServer.AddOrder))).Methods("POST")

	router.HandleFunc("/orderCodeEvent", apiServer.ConsumeOrderCode).Methods("POST")

	log.Fatal(http.ListenAndServe(":8000", router))
}
