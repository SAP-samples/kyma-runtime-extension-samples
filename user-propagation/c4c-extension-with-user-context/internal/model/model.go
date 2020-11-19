package model

type ExchangeTokenResp struct {
	DestinationConfiguration DestinationConfiguration `json:"destinationConfiguration"`
	AuthTokens               []AuthToken              `json:"authTokens"`
}

type DestinationConfiguration struct {
	URL string `json:"URL"`
}

type AuthToken struct {
	TokenType string `json:"type"`
	Value     string `json:"value"`
	ExpiresIn string `json:"expires_in"`
}

type Task struct {
	Subject      string `json:"Subject"`
	PriorityCode string `json:"PriorityCode"`
	Status       string `json:"Status"`
	DocumentType string `json:"DocumentType"`
}

func NewTask(createTask CreateTask) Task {
	return Task{
		Subject:      createTask.Subject,
		PriorityCode: "1",
		Status:       "1",
		DocumentType: "0006",
	}
}

type CreateTask struct {
	Subject string `json:"subject"`
}
type CreatedTask struct {
	ObjectID     string `json:"ObjectID"`
	DocumentType string `json:"DocumentType"`
	ID           string `json:"ID"`
	StatusText   string `json:"StatusText"`
	Owner        string `json:"Owner"`
	Subject      string `json:"Subject"`
}
type d struct {
	Results CreatedTask `json:"results"`
}
type CreatedTaskResponse struct {
	D d `json:"d"`
}
