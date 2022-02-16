package models

// Customer represents data about a Customer
//
// swagger:model Customer
type Customer struct {
	// The customer number
	// example: 47912cc0-d801-41c4-b6da-30577e272f43
	Cno string `json:"cno"`
	// The title of a customer
	// example: Mrs.
	Title string `json:"title,omitempty"`
	// The first name of a customer
	// example: Jane
	FirstName string `json:"firstName,omitempty"`
	// The last name of a customer
	// example: Doe
	LastName string `json:"lastName,omitempty"`
	// The email of a customer
	// example: john.doe.mock@mailinator.com
	Email string `json:"email,omitempty"`
	// The phone number of a customer
	// example: +1-111-111-1111
	Phone string `json:"phone,omitempty"`
	// The address of a customer
	// example: 123, ABC Street, New York, NY, 11111, USA
	Address string `json:"address,omitempty"`
	// The comment given by the customer
	// example: Thanks
	Comment string `json:"comment,omitempty"`
	// The date when the record was created
	// example: 2022-02-03T09:55:19-05:00
	Created string `json:"created,omitempty"`
	// The date when the record was last updated
	// example: 2022-02-03T09:55:19-05:00
	Updated string `json:"updated,omitempty"`
}
