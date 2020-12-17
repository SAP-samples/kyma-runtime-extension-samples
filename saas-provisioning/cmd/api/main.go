package main

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"

	"github.com/SAP-samples/kyma-runtime-extension-samples/saas-provisioning/internal/saas"
)

func main() {

	router := mux.NewRouter().StrictSlash(true)

	router.HandleFunc("/callback/v1.0/tenants/{tenant}", saas.Provision).Methods("PUT")
	router.HandleFunc("/callback/v1.0/tenants/{tenant}", saas.Deprovision).Methods("DELETE")

	log.Fatal(http.ListenAndServe(":8000", router))
}
