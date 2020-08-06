package db

import (
	"context"
	"database/sql"
	"fmt"
	"log"

	"github.com/SAP-samples/kyma-runtime-extension-samples/api-mssql-go/internal/config"
	_ "github.com/denisenkom/go-mssqldb"
)

var db *sql.DB

func init() {
	config.InitConfig()
	config := config.GetConfig()

	connString := fmt.Sprintf("server=%s;user id=%s;password=%s;port=%s;database=%s;",
		config.Server, config.User, config.Password, config.Port, config.Database)

	setConn(connString)
}

func setConn(connString string) {
	var err error

	db, err = sql.Open("sqlserver", connString)
	if err != nil {
		log.Fatal("Error creating connection pool: ", err.Error())
	}
	ctx := context.Background()
	err = db.PingContext(ctx)
	if err != nil {
		log.Fatal(err.Error())
	}
	fmt.Printf("The database has successfully been connected!\n")

}

func GetConn() *sql.DB {
	return db
}
