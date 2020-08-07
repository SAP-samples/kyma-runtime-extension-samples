package api

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/SAP-samples/kyma-runtime-extension-samples/api-mssql-go/internal/db"
)

type order struct {
	Orderid     string `json:"order_id"`
	Description string `json:"description"`
}

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

	var order order

	fmt.Println("EditOrder")

	defer r.Body.Close()
	err := json.NewDecoder(r.Body).Decode(&order)

	rowsEffected, err := db.EditOrder(order.Orderid, order.Description)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	js, _ := json.Marshal(rowsEffected)

	w.Header().Set("Content-Type", "application/json")
	w.Write(js)
}

func AddOrder(w http.ResponseWriter, r *http.Request) {

	var order order

	defer r.Body.Close()
	err := json.NewDecoder(r.Body).Decode(&order)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	orders, err := db.AddOrder(order.Orderid, order.Description)

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
