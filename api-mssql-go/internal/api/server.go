package api

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/SAP-samples/kyma-runtime-extension-samples/api-mssql-go/internal/db"
)

func GetOrder(w http.ResponseWriter, r *http.Request) {

	order_id := strings.Split(r.URL.Path, "/")[2]
	orders, err := db.GetOrder(order_id)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	js, _ := json.Marshal(orders)

	w.Header().Set("Content-Type", "application/json")
	w.Write(js)
}

func GetOrders(w http.ResponseWriter, r *http.Request) {
	orders, err := db.GetOrders()

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	js, _ := json.Marshal(orders)

	w.Header().Set("Content-Type", "application/json")
	w.Write(js)
}

func EditOrder(w http.ResponseWriter, r *http.Request) {

	order_id := r.FormValue("order_id")
	description := r.FormValue("description")
	rowsEffected, err := db.EditOrder(order_id, description)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	js, _ := json.Marshal(rowsEffected)

	w.Header().Set("Content-Type", "application/json")
	w.Write(js)
}

func AddOrder(w http.ResponseWriter, r *http.Request) {
	order_id := r.FormValue("order_id")
	description := r.FormValue("description")
	orders, err := db.AddOrder(order_id, description)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	js, _ := json.Marshal(orders)

	w.Header().Set("Content-Type", "application/json")
	w.Write(js)
}

func DeleteOrder(w http.ResponseWriter, r *http.Request) {
	order_id := strings.Split(r.URL.Path, "/")[2]
	rowsEffected, err := db.DeleteOrder(order_id)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	js, _ := json.Marshal(rowsEffected)

	w.Header().Set("Content-Type", "application/json")
	w.Write(js)
}
