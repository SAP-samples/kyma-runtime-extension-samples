//  Registrations REST API:
//   version: 1.0.0
//   title: Registrations REST API
//  Schemes: http, https
//  Host: localhost:8080
//  BasePath: /
//  Consumes:
//	  - application/json
//  Produces:
//    - application/json
//
// swagger:meta
package main

import (
	"database/sql"
	"github.com/SAP-samples/kyma-runtime-extension-samples/nextjs-app-with-kyma-eventing/registrations-rest-api/models"
	_ "github.com/SAP/go-hdb/driver"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"log"
	"net/http"
	"os"
	"time"
)

func main() {
	dbUser := os.Getenv("HANA_DB_USER")
	dbPassword := os.Getenv("HANA_DB_PASSWORD")
	dbHost := os.Getenv("HANA_DB_HOST")
	dbPort := os.Getenv("HANA_DB_PORT")
	pemFile := "DigiCertGlobalRootCA.pem"
	connectString := "hdb://" + dbUser + ":" + dbPassword + "@" + dbHost + ":" + dbPort + "?TLSServerName=" + dbHost + "&TLSRootCAFile=" + pemFile
	log.Println("connectString is " + connectString)
	pool, err := sql.Open("hdb", connectString)
	if err != nil {
		log.Fatalln(err)
	}
	defer func(pool *sql.DB) {
		err := pool.Close()
		if err != nil {
			log.Print(err)
		}
	}(pool)
	pool.SetConnMaxLifetime(60 * time.Minute)
	pool.SetMaxIdleConns(30)
	pool.SetMaxOpenConns(30)
	routerErr := SetupRouter(pool).Run(":8080")
	if routerErr != nil {
		log.Fatalln(routerErr)
	}
}

// SetupRouter will set up the gin router
func SetupRouter(pool *sql.DB) *gin.Engine {
	// Creates a gin router with default middleware
	router := gin.Default()
	router.Use(cors.Default())
	router.Use(ApiMiddleware(pool))

	// Handlers for REST GET, POST, PUT, DELETE requests
	router.GET("/customers", ListCustomersHandler)
	router.GET("/customers/search", SearchCustomersHandler)
	router.POST("/customers", NewCustomerHandler)
	router.PUT("/customers/:cno", UpdateCustomerHandler)
	router.DELETE("/customers/:cno", DeleteCustomerHandler)
	router.GET("/metrics", gin.WrapH(promhttp.Handler()))
	return router
}

// ApiMiddleware will add the connection pool to the context
func ApiMiddleware(pool *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set("pool", pool)
		c.Next()
	}
}

// swagger:operation GET /customers listCustomers
// Returns list of customers
// ---
// produces:
// - application/json
// responses:
//     '200':
//         description: Successful operation
//         schema:
//           type: array
//           items:
//             $ref: "#/definitions/Customer"
//     '500':
//         description: Internal Server Error
//         schema:
//           $ref: "#/definitions/ServiceError"
func ListCustomersHandler(c *gin.Context) {
	pool, ok := c.MustGet("pool").(*sql.DB)
	if pool == nil || !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"errorMessage": "There was an error connecting to the database."})
		return
	}

	rows, err := pool.Query("SELECT CNO, TITLE, FIRSTNAME, LASTNAME, EMAIL, PHONE, ADDRESS, COMMENT, CREATED, UPDATED from REGISTRATIONS.CUSTOMER")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"errorMessage": err.Error()})
		return
	}
	defer func(rows *sql.Rows) {
		err := rows.Close()
		if err != nil {
			log.Print(err)
		}
	}(rows)

	customers, err := ProcessCustomers(rows)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"errorMessage": err.Error()})
		return
	}

	c.IndentedJSON(http.StatusOK, customers)
}

func ProcessCustomers(rows *sql.Rows) ([]models.Customer, error) {
	var Cno, Title, FirstName, LastName, Email, Phone, Address, Comment, Created, Updated string
	customers := make([]models.Customer, 0)
	for rows.Next() {
		err := rows.Scan(&Cno, &Title, &FirstName, &LastName, &Email, &Phone, &Address, &Comment, &Created, &Updated)
		if err != nil {
			log.Print(err.Error())
			return customers, err
		}
		customers = append(customers, models.Customer{Cno: Cno, Title: Title, FirstName: FirstName, LastName: LastName, Email: Email, Phone: Phone, Address: Address, Comment: Comment, Created: Created, Updated: Updated})
	}

	err := rows.Err()
	if err != nil {
		log.Print(err.Error())
		return customers, err
	}
	return customers, nil
}

// swagger:operation POST /customers newCustomer
// Create a new customer
// ---
// consumes:
// - "application/json"
// produces:
// - "application/json"
// parameters:
// - in: "body"
//   name: "body"
//   description: "Customer object that needs to be added"
//   required: true
//   schema:
//     $ref: "#/definitions/Customer"
// responses:
//     '201':
//         description: Successful operation
//         schema:
//           $ref: "#/definitions/Customer"
//     '400':
//         description: Invalid input
//         schema:
//           $ref: "#/definitions/ServiceError"
//     '500':
//         description: Internal Server Error
//         schema:
//           $ref: "#/definitions/ServiceError"
func NewCustomerHandler(c *gin.Context) {
	var newCustomer models.Customer

	// Call ShouldBindJSON to bind the received JSON to newCustomer.
	if err := c.ShouldBindJSON(&newCustomer); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"errorMessage": err.Error()})
		return
	}

	newCustomer.Created = time.Now().Format(time.RFC3339)
	newCustomer.Updated = newCustomer.Created

	pool, ok := c.MustGet("pool").(*sql.DB)
	if pool == nil || !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"errorMessage": "There was an error connecting to the database."})
		return
	}
	stmt := `INSERT INTO REGISTRATIONS.CUSTOMER VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);`
	res, err := pool.Exec(stmt, newCustomer.Cno, newCustomer.Title, newCustomer.FirstName, newCustomer.LastName, newCustomer.Email, newCustomer.Phone, newCustomer.Address, newCustomer.Comment, newCustomer.Created, newCustomer.Created)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"errorMessage": err.Error()})
		return
	}
	count, err := res.RowsAffected()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"errorMessage": err.Error()})
		return
	}
	log.Println("Number of records updated:", count)

	c.IndentedJSON(http.StatusCreated, newCustomer)
}

// swagger:operation PUT /customers/{cno} updateCustomer
// Update an existing customer
// ---
// consumes:
// - "application/json"
// produces:
// - "application/json"
// parameters:
// - name: cno
//   in: path
//   description: Customer number
//   required: true
//   type: string
// - in: "body"
//   name: "body"
//   description: "Customer object that needs to be updated"
//   required: true
//   schema:
//     $ref: "#/definitions/Customer"
// responses:
//     '202':
//         description: Successful operation
//         schema:
//           $ref: "#/definitions/Customer"
//     '400':
//         description: Invalid input
//         schema:
//           $ref: "#/definitions/ServiceError"
//     '404':
//         description: Customer not found
//         schema:
//           $ref: "#/definitions/ServiceError"
//     '500':
//         description: Internal Server Error
//         schema:
//           $ref: "#/definitions/ServiceError"
func UpdateCustomerHandler(c *gin.Context) {
	cno := c.Param("cno")
	var customer models.Customer
	if err := c.ShouldBindJSON(&customer); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"errorMessage": err.Error()})
		return
	}

	customer.Cno = cno
	customer.Updated = time.Now().Format(time.RFC3339)

	pool, ok := c.MustGet("pool").(*sql.DB)
	if pool == nil || !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"errorMessage": "There was an error connecting to the database."})
		return
	}

	stmt := `UPDATE REGISTRATIONS.CUSTOMER SET TITLE = $1, FIRSTNAME = $2, LASTNAME = $3, EMAIL = $4, PHONE = $5, ADDRESS = $6, COMMENT = $7, UPDATED = $8 WHERE CNO = $9;`
	res, err := pool.Exec(stmt, customer.Title, customer.FirstName, customer.LastName, customer.Email, customer.Phone, customer.Address, customer.Comment, customer.Updated, cno)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"errorMessage": err.Error()})
		return
	}
	count, err := res.RowsAffected()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"errorMessage": err.Error()})
		return
	}
	log.Println("Number of records updated:", count)

	if count > 0 {
		c.IndentedJSON(http.StatusAccepted, customer)
		return
	}

	c.IndentedJSON(http.StatusNotFound, gin.H{"errorMessage": "Customer not found"})
}

// swagger:operation GET /customers/search searchCustomers
// Search customers based on cno and/or email
// ---
// produces:
// - application/json
// parameters:
//   - name: cno
//     in: query
//     description: customer number
//     required: false
//     type: string
//   - name: email
//     in: query
//     description: email address
//     required: false
//     type: string
// responses:
//     '200':
//         description: Successful operation
//         schema:
//           type: array
//           items:
//             $ref: "#/definitions/Customer"
//     '404':
//         description: Customer not found
//         schema:
//           $ref: "#/definitions/ServiceError"
//     '500':
//         description: Internal Server Error
//         schema:
//           $ref: "#/definitions/ServiceError"
func SearchCustomersHandler(c *gin.Context) {
	pool, ok := c.MustGet("pool").(*sql.DB)
	if pool == nil || !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"errorMessage": "There was an error connecting to the database."})
		return
	}

	cno, hasCno := c.GetQuery("cno")
	email, hasEmail := c.GetQuery("email")

	customers, err := GetCustomers(pool, cno, hasCno, email, hasEmail)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"errorMessage": err.Error()})
		return
	}

	if len(customers) > 0 {
		c.IndentedJSON(http.StatusOK, customers)
		return
	}

	c.IndentedJSON(http.StatusNotFound, gin.H{"errorMessage": "Customer not found."})
}

func GetCustomers(pool *sql.DB, cno string, hasCno bool, email string, hasEmail bool) ([]models.Customer, error) {
	query := "SELECT CNO, TITLE, FIRSTNAME, LASTNAME, EMAIL, PHONE, ADDRESS, COMMENT, CREATED, UPDATED from REGISTRATIONS.CUSTOMER"
	switch {
	case hasCno && hasEmail:
		query = query + " WHERE CNO = '" + cno + "' AND EMAIL = '" + email + "'"
	case hasCno:
		query = query + " WHERE CNO = '" + cno + "'"
	case hasEmail:
		query = query + " WHERE EMAIL = '" + email + "'"
	}
	rows, err := pool.Query(query)
	if err != nil {
		log.Print(err.Error())
		return nil, err
	}
	defer func(rows *sql.Rows) {
		err := rows.Close()
		if err != nil {
			log.Print(err)
		}
	}(rows)

	customers, err := ProcessCustomers(rows)
	if err != nil {
		log.Print(err.Error())
	}

	return customers, err
}

// swagger:operation DELETE /customers/{cno} deleteCustomer
// Delete an existing recipe
// ---
// produces:
// - application/json
// parameters:
//   - name: cno
//     in: path
//     description: Customer number
//     required: true
//     type: string
// responses:
//     '200':
//         description: Successful operation
//         schema:
//           $ref: "#/definitions/ServiceMessage"
//     '404':
//         description: Customer not found
//         schema:
//           $ref: "#/definitions/ServiceError"
//     '500':
//         description: Internal Server Error
//         schema:
//           $ref: "#/definitions/ServiceError"
func DeleteCustomerHandler(c *gin.Context) {
	cno := c.Param("cno")

	pool, ok := c.MustGet("pool").(*sql.DB)
	if pool == nil || !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"errorMessage": "There was an error connecting to the database."})
		return
	}

	stmt := `DELETE FROM REGISTRATIONS.CUSTOMER WHERE CNO = $1;`
	res, err := pool.Exec(stmt, cno)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"errorMessage": err.Error()})
		return
	}
	count, err := res.RowsAffected()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"errorMessage": err.Error()})
		return
	}
	log.Println("Number of records deleted:", count)

	if count > 0 {
		c.IndentedJSON(http.StatusOK, gin.H{"message": "The Customer has been deleted."})
		return
	}

	c.IndentedJSON(http.StatusNotFound, gin.H{"errorMessage": "Customer not found."})
}
