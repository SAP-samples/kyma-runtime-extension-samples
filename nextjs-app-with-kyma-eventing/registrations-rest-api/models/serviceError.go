package models

// ServiceError represents an error message
//
// swagger:model ServiceError
type ServiceError struct {
	// The error message
	// example: Some error
	ErrorMessage string `json:"errorMessage"`
}
