package main

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"

	"github.com/SAP-samples/kyma-runtime-extension-samples/api-mssql-go/internal/api"
)

func main() {
	router := mux.NewRouter().StrictSlash(true)

	router.HandleFunc("/orders", api.GetOrders).Methods("GET")
	router.HandleFunc("/orders/{id}", api.GetOrder).Methods("GET")
	router.HandleFunc("/orders/{id}", api.DeleteOrder).Methods("DELETE")
	router.HandleFunc("/orders", api.EditOrder).Methods("PUT")
	router.HandleFunc("/orders", api.AddOrder).Methods("POST")

	log.Fatal(http.ListenAndServe(":8000", router))
}
