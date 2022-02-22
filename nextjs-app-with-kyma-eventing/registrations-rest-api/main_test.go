package main

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/DATA-DOG/go-sqlmock"
	"github.com/SAP-samples/kyma-runtime-extension-samples/nextjs-app-with-kyma-eventing/registrations-rest-api/models"
	"github.com/stretchr/testify/assert"
	"io"
	"log"
	"net/http"
	"net/http/httptest"
	"reflect"
	"testing"
)

type ReturnTypeExpected int

const (
	WantCustomer ReturnTypeExpected = iota
	WantCustomers
	WantMessage
	WantErr
)

func TestHandlers(t *testing.T) {
	db1, mock1 := NewDBMock()
	mock1.ExpectQuery("SELECT").WillReturnRows(MockRows2())

	db2, mock2 := NewDBMock()
	mock2.ExpectQuery("SELECT").WillReturnRows(MockErrorRows2())

	db3, mock3 := NewDBMock()
	mock3.ExpectQuery("SELECT").RowsWillBeClosed()

	db4, mock4 := NewDBMock()
	mock4.ExpectQuery("SELECT CNO, TITLE, FIRSTNAME, LASTNAME, EMAIL, PHONE, ADDRESS, COMMENT, CREATED, UPDATED from REGISTRATIONS.CUSTOMER WHERE CNO = '47912cc0-d801-41c4-b6da-30577e272f43'").
		WillReturnRows(MockRows1())

	db5, mock5 := NewDBMock()
	mock5.ExpectQuery("SELECT CNO, TITLE, FIRSTNAME, LASTNAME, EMAIL, PHONE, ADDRESS, COMMENT, CREATED, UPDATED from REGISTRATIONS.CUSTOMER WHERE CNO = '47912cc0-d801-41c4-b6da-30577e272f43'").
		WillReturnRows(MockErrorRows1())

	db6, mock6 := NewDBMock()
	mock6.ExpectQuery("SELECT CNO, TITLE, FIRSTNAME, LASTNAME, EMAIL, PHONE, ADDRESS, COMMENT, CREATED, UPDATED from REGISTRATIONS.CUSTOMER WHERE CNO = '47912cc0-d801-41c4-b6da-30577e272f43'").
		RowsWillBeClosed()

	db7, mock7 := NewDBMock()
	mock7.ExpectQuery("SELECT CNO, TITLE, FIRSTNAME, LASTNAME, EMAIL, PHONE, ADDRESS, COMMENT, CREATED, UPDATED from REGISTRATIONS.CUSTOMER WHERE EMAIL = 'jane.doe.test@mailinator.com'").
		WillReturnRows(MockRows1())

	db8, mock8 := NewDBMock()
	mock8.ExpectQuery("SELECT CNO, TITLE, FIRSTNAME, LASTNAME, EMAIL, PHONE, ADDRESS, COMMENT, CREATED, UPDATED from REGISTRATIONS.CUSTOMER WHERE CNO = '47912cc0-d801-41c4-b6da-30577e272f43' AND EMAIL = 'jane.doe.test@mailinator.com'").
		WillReturnRows(MockRows1())

	db9, mock9 := NewDBMock()
	mock9.ExpectExec("INSERT").WillReturnResult(sqlmock.NewResult(1, 1))

	db10, mock10 := NewDBMock()
	mock10.ExpectExec("INSERT").WillReturnError(fmt.Errorf("some error"))

	db11, mock11 := NewDBMock()
	mock11.ExpectExec("UPDATE").WillReturnResult(sqlmock.NewResult(1, 1))

	db12, mock12 := NewDBMock()
	mock12.ExpectExec("UPDATE").WillReturnResult(sqlmock.NewResult(0, 0))

	db13, mock13 := NewDBMock()
	mock13.ExpectExec("UPDATE").WillReturnError(fmt.Errorf("some error"))

	db14, mock14 := NewDBMock()
	mock14.ExpectExec("DELETE").WillReturnResult(sqlmock.NewResult(1, 1))

	db15, mock15 := NewDBMock()
	mock15.ExpectExec("DELETE").WillReturnResult(sqlmock.NewResult(0, 0))

	db16, mock16 := NewDBMock()
	mock16.ExpectExec("DELETE").WillReturnError(fmt.Errorf("some error"))

	type args struct {
		db     *sql.DB
		method string
		path   string
		body   io.Reader
	}
	tests := []struct {
		name               string
		args               args
		returnTypeExpected ReturnTypeExpected
		customerWanted     models.Customer
		customersWanted    []models.Customer
		messageWanted      models.ServiceMessage
	}{
		{"Test GET customers", args{db1, "GET", "/customers", nil}, WantCustomers, models.Customer{}, getMockCustomers2(), models.ServiceMessage{}},
		{"Test GET customers with DB error", args{nil, "GET", "/customers", nil}, WantErr, models.Customer{}, nil, models.ServiceMessage{}},
		{"Test GET customers with row error", args{db2, "GET", "/customers", nil}, WantErr, models.Customer{}, nil, models.ServiceMessage{}},
		{"Test GET customers with closed rows", args{db3, "GET", "/customers", nil}, WantErr, models.Customer{}, nil, models.ServiceMessage{}},
		{"Test GET customers/search?cno=47912cc0-d801-41c4-b6da-30577e272f43", args{db4, "GET", "/customers/search?cno=47912cc0-d801-41c4-b6da-30577e272f43", nil}, WantCustomers, models.Customer{}, getMockCustomers1(), models.ServiceMessage{}},
		{"Test GET customers/search?cno=47912cc0-d801-41c4-b6da-30577e272f43 with DB error", args{nil, "GET", "/customers/search?cno=47912cc0-d801-41c4-b6da-30577e272f43", nil}, WantErr, models.Customer{}, nil, models.ServiceMessage{}},
		{"Test GET customers/search?cno=47912cc0-d801-41c4-b6da-30577e272f43 with row error", args{db5, "GET", "/customers/search?cno=47912cc0-d801-41c4-b6da-30577e272f43", nil}, WantErr, models.Customer{}, nil, models.ServiceMessage{}},
		{"Test GET customers/search?cno=47912cc0-d801-41c4-b6da-30577e272f43 with closed rows", args{db6, "GET", "/customers/search?cno=47912cc0-d801-41c4-b6da-30577e272f43", nil}, WantErr, models.Customer{}, nil, models.ServiceMessage{}},
		{"Test GET customers/search?email=jane.doe.test@mailinator.com", args{db7, "GET", "/customers/search?email=jane.doe.test@mailinator.com", nil}, WantCustomers, models.Customer{}, getMockCustomers1(), models.ServiceMessage{}},
		{"Test GET customers/search?cno=47912cc0-d801-41c4-b6da-30577e272f43&email=jane.doe.test@mailinator.com", args{db8, "GET", "/customers/search?cno=47912cc0-d801-41c4-b6da-30577e272f43&email=jane.doe.test@mailinator.com", nil}, WantCustomers, models.Customer{}, getMockCustomers1(), models.ServiceMessage{}},
		{"Test POST customers", args{db9, "POST", "/customers", io.NopCloser(bytes.NewReader(getMockCustomer1JSON()))}, WantCustomer, getMockCustomer1(), nil, models.ServiceMessage{}},
		{"Test POST customers with invalid body", args{db9, "POST", "/customers", io.NopCloser(bytes.NewReader(getMockInvalidCustomerJSON()))}, WantErr, models.Customer{}, nil, models.ServiceMessage{}},
		{"Test POST customers with DB error", args{nil, "POST", "/customers", io.NopCloser(bytes.NewReader(getMockCustomer1JSON()))}, WantErr, models.Customer{}, nil, models.ServiceMessage{}},
		{"Test POST customers with error", args{db10, "POST", "/customers", io.NopCloser(bytes.NewReader(getMockCustomer1JSON()))}, WantErr, models.Customer{}, nil, models.ServiceMessage{}},
		{"Test PUT customers/47912cc0-d801-41c4-b6da-30577e272f43", args{db11, "PUT", "/customers/47912cc0-d801-41c4-b6da-30577e272f43", io.NopCloser(bytes.NewReader(getMockCustomer1JSON()))}, WantCustomer, getMockCustomer1(), nil, models.ServiceMessage{}},
		{"Test PUT customers/47912cc0-d801-41c4-b6da-30577e272f43 with invalid body", args{db11, "PUT", "/customers/47912cc0-d801-41c4-b6da-30577e272f43", io.NopCloser(bytes.NewReader(getMockInvalidCustomerJSON()))}, WantErr, getMockCustomer1(), nil, models.ServiceMessage{}},
		{"Test PUT customers/47912cc0-d801-41c4-b6da-30577e272f43", args{db12, "PUT", "/customers/47912cc0-d801-41c4-b6da-30577e272f43", io.NopCloser(bytes.NewReader(getMockCustomer1JSON()))}, WantErr, models.Customer{}, nil, models.ServiceMessage{}},
		{"Test PUT customers/47912cc0-d801-41c4-b6da-30577e272f43 with DB error", args{nil, "PUT", "/customers/47912cc0-d801-41c4-b6da-30577e272f43", io.NopCloser(bytes.NewReader(getMockCustomer1JSON()))}, WantErr, models.Customer{}, nil, models.ServiceMessage{}},
		{"Test PUT customers/47912cc0-d801-41c4-b6da-30577e272f43 with error", args{db13, "PUT", "/customers/47912cc0-d801-41c4-b6da-30577e272f43", io.NopCloser(bytes.NewReader(getMockCustomer1JSON()))}, WantErr, models.Customer{}, nil, models.ServiceMessage{}},
		{"Test DELETE customers/47912cc0-d801-41c4-b6da-30577e272f43", args{db14, "DELETE", "/customers/47912cc0-d801-41c4-b6da-30577e272f43", nil}, WantMessage, models.Customer{}, nil, models.ServiceMessage{Message: "The Customer has been deleted."}},
		{"Test DELETE customers/47912cc0-d801-41c4-b6da-30577e272f43 with DB error", args{nil, "DELETE", "/customers/47912cc0-d801-41c4-b6da-30577e272f43", nil}, WantErr, models.Customer{}, nil, models.ServiceMessage{}},
		{"Test DELETE customers/47912cc0-d801-41c4-b6da-30577e272f43", args{db15, "DELETE", "/customers/47912cc0-d801-41c4-b6da-30577e272f43", nil}, WantErr, models.Customer{}, nil, models.ServiceMessage{}},
		{"Test DELETE customers/47912cc0-d801-41c4-b6da-30577e272f43 with error", args{db16, "DELETE", "/customers/47912cc0-d801-41c4-b6da-30577e272f43", nil}, WantErr, models.Customer{}, nil, models.ServiceMessage{}},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			router := SetupRouter(tt.args.db)
			router.Use()
			w := HandleRequest(router, tt.args.method, tt.args.path, tt.args.body)
			// Check if an error was returned
			var serviceError models.ServiceError
			_ = json.Unmarshal([]byte(w.Body.String()), &serviceError)
			if serviceError.ErrorMessage != "" {
				if tt.returnTypeExpected != WantErr {
					t.Errorf("TestHandlers() serviceError = %v, returnTypeExpected %v", serviceError, tt.returnTypeExpected)
				}
				return
			}
			switch tt.returnTypeExpected {
			case WantCustomer:
				var got models.Customer
				err := json.Unmarshal([]byte(w.Body.String()), &got)
				if err != nil {
					t.Errorf("TestHandlers() err = %v, want %v", err, tt.customersWanted)
				} else {
					assert.Equal(t, tt.customerWanted.Cno, got.Cno)
					assert.Equal(t, tt.customerWanted.Title, got.Title)
					assert.Equal(t, tt.customerWanted.FirstName, got.FirstName)
					assert.Equal(t, tt.customerWanted.LastName, got.LastName)
					assert.Equal(t, tt.customerWanted.Email, got.Email)
					assert.Equal(t, tt.customerWanted.Address, got.Address)
					assert.NotEqual(t, tt.customerWanted.Updated, got.Updated)
				}
			case WantCustomers:
				var got []models.Customer
				err := json.Unmarshal([]byte(w.Body.String()), &got)
				if err != nil {
					t.Errorf("TestHandlers() err = %v, want %v", err, tt.customerWanted)
				} else if !reflect.DeepEqual(got, tt.customersWanted) {
					t.Errorf("TestHandlers() got = %v, want %v", got, tt.customersWanted)
				}
			case WantMessage:
				var got models.ServiceMessage
				err := json.Unmarshal([]byte(w.Body.String()), &got)
				if err != nil {
					t.Errorf("TestHandlers() err = %v, want %v", err, tt.messageWanted)
				} else if !reflect.DeepEqual(got, tt.messageWanted) {
					t.Errorf("TestHandlers() got = %v, want %v", got, tt.messageWanted)
				}
			}
		})
	}
}

func HandleRequest(r http.Handler, method, path string, body io.Reader) *httptest.ResponseRecorder {
	req, _ := http.NewRequest(method, path, body)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	return w
}

func getTableColumns() []string {
	return []string{"cno", "title", "firstName", "lastName", "email", "phone", "address", "comment", "created", "updated"}
}

func getMockCustomer1JSON() []byte {
	mockCustomer1JSON, _ := json.Marshal(getMockCustomer1())
	return mockCustomer1JSON
}

func getMockInvalidCustomerJSON() []byte {
	mockInvalidCustomerJSON, _ := json.Marshal(getMockCustomers2())
	return mockInvalidCustomerJSON
}

func getMockCustomer1() models.Customer {
	return models.Customer{
		Cno:       "47912cc0-d801-41c4-b6da-30577e272f43",
		Title:     "Mrs.",
		FirstName: "Jane",
		LastName:  "Doe",
		Email:     "jane.doe.test@mailinator.com",
		Phone:     "",
		Address:   "123, ABC Street, New York, NY, 11111, USA",
		Comment:   "",
		Created:   "2022-02-03T09:55:19-05:00",
		Updated:   "2022-02-03T09:55:19-05:00",
	}
}

func getMockCustomer2() models.Customer {
	return models.Customer{
		Cno:       "47912cc0-d801-41c4-b6da-30577e272f45",
		Title:     "Mr.",
		FirstName: "John",
		LastName:  "Doe",
		Email:     "john.doe.test@mailinator.com",
		Phone:     "",
		Address:   "123, ABC Street, New York, NY, 11111, USA",
		Comment:   "",
		Created:   "2022-02-03T09:55:19-05:00",
		Updated:   "2022-02-03T09:55:19-05:00",
	}
}

func getMockCustomers1() []models.Customer {
	return []models.Customer{getMockCustomer1()}
}

func getMockCustomers2() []models.Customer {
	return []models.Customer{getMockCustomer1(), getMockCustomer2()}
}

func MockRows1() (rows *sqlmock.Rows) {
	return sqlmock.NewRows(getTableColumns()).
		AddRow("47912cc0-d801-41c4-b6da-30577e272f43", "Mrs.", "Jane", "Doe", "jane.doe.test@mailinator.com", "", "123, ABC Street, New York, NY, 11111, USA", "", "2022-02-03T09:55:19-05:00", "2022-02-03T09:55:19-05:00")
}

func MockRows2() (rows *sqlmock.Rows) {
	return sqlmock.NewRows(getTableColumns()).
		AddRow("47912cc0-d801-41c4-b6da-30577e272f43", "Mrs.", "Jane", "Doe", "jane.doe.test@mailinator.com", "", "123, ABC Street, New York, NY, 11111, USA", "", "2022-02-03T09:55:19-05:00", "2022-02-03T09:55:19-05:00").
		AddRow("47912cc0-d801-41c4-b6da-30577e272f45", "Mr.", "John", "Doe", "john.doe.test@mailinator.com", "", "123, ABC Street, New York, NY, 11111, USA", "", "2022-02-03T09:55:19-05:00", "2022-02-03T09:55:19-05:00")
}

func MockErrorRows1() (rows *sqlmock.Rows) {
	return sqlmock.NewRows(getTableColumns()).
		RowError(0, errors.New("scanErr"))
}

func MockErrorRows2() (rows *sqlmock.Rows) {
	return sqlmock.NewRows(getTableColumns()).
		AddRow("47912cc0-d801-41c4-b6da-30577e272f43", "Mrs.", "Jane", "Doe", "jane.doe.test@mailinator.com", "", "123, ABC Street, New York, NY, 11111, USA", "", "2022-02-03T09:55:19-05:00", "2022-02-03T09:55:19-05:00").
		RowError(0, errors.New("scanErr"))
}

func NewDBMock() (*sql.DB, sqlmock.Sqlmock) {
	db, mock, err := sqlmock.New()
	if err != nil {
		log.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	return db, mock
}
