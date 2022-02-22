package models

// ServiceMessage represents a service message
//
// swagger:model ServiceMessage
type ServiceMessage struct {
	// The service message
	// example: Customer updated.
	Message string `json:"message"`
}
