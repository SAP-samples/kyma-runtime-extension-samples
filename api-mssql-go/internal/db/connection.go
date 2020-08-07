package db

import (
	"database/sql"
	"fmt"
	"log"

	"github.com/SAP-samples/kyma-runtime-extension-samples/api-mssql-go/internal/config"
	_ "github.com/denisenkom/go-mssqldb"
)

var db *sql.DB

//InitDatabase - sets database connection configuration
func InitDatabase() {
	var err error

	connString := getConnString()

	fmt.Printf("Setting connection to db with configuration: %s \n", connString)

	db, err = sql.Open("sqlserver", connString)
	if err != nil {
		log.Fatal("Error opening connection: ", err.Error())
	}
}

//gets configuration and returns appropiate connection string
func getConnString() string {

	config := config.GetConfig()

	connString := fmt.Sprintf("server=%s;user id=%s;password=%s;port=%s;database=%s;",
		config.Server, config.User, config.Password, config.Port, config.Database)

	return connString
}

//will verify the connection is available or generate a new one
func getConnection() *sql.DB {

	err := db.Ping()
	if err != nil {
		log.Fatal("Could not ping db: ", err.Error())
	}

	return db
}
