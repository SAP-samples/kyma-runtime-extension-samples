package db

import (
	"fmt"
	"time"
)

//Order -
type Order struct {
	Orderid     string    `json:"order_id"`
	Description string    `json:"description"`
	Created     time.Time `json:"created"`
}

type RowsAffected struct {
	RowsAffected int64
}

func GetOrder(order_id string) ([]Order, error) {
	tsql := fmt.Sprintf("SELECT * FROM Orders WHERE order_id=@p1;")
	return query(tsql, order_id)
}

func GetOrders() ([]Order, error) {
	tsql := fmt.Sprintf("SELECT * FROM Orders;")
	return query(tsql, nil)
}

func AddOrder(order_id string, description string) ([]Order, error) {
	tsql := fmt.Sprintf("INSERT INTO Orders(order_id, description) VALUES(@p1,@p2);")
	_, err := exec(tsql, order_id, description)
	if err != nil {
		return nil, err
	}

	tsql = fmt.Sprintf("SELECT * FROM Orders WHERE order_id=@p1;")
	return query(tsql, order_id, description)
}

func EditOrder(order_id string, description string) (RowsAffected, error) {
	tsql := fmt.Sprintf("UPDATE Orders SET description=@p2 WHERE order_id=@p1")
	return exec(tsql, order_id, description)
}

func DeleteOrder(order_id string) (RowsAffected, error) {
	tsql := fmt.Sprintf("DELETE FROM Orders WHERE order_id=@p1")
	return exec(tsql, order_id)
}

func exec(tsql string, args ...interface{}) (RowsAffected, error) {

	db := getConnection()

	rowsAffectedResult := RowsAffected{}
	rowsAffectedResult.RowsAffected = 0

	fmt.Printf("Executing SQL: %s \n", tsql)
	fmt.Printf("With args: %s \n", args...)

	result, err := db.Exec(tsql, args...)
	if err != nil {
		return rowsAffectedResult, err
	}
	num, _ := result.RowsAffected()

	rowsAffectedResult.RowsAffected = num

	return rowsAffectedResult, nil

}

func query(tsql string, args ...interface{}) ([]Order, error) {

	db := getConnection()

	order := Order{}
	orders := []Order{}

	fmt.Printf("Executing SQL: %s \n", tsql)
	fmt.Printf("With args: %s \n", args...)

	rows, err := db.Query(tsql, args...)

	if err != nil {
		fmt.Println("failed...")
		return nil, err
	}

	defer rows.Close()

	for rows.Next() {
		err := rows.Scan(&order.Orderid, &order.Description, &order.Created)
		if err != nil {
			return nil, err
		}
		orders = append(orders, order)
	}

	return orders, nil
}
