export interface Task {
    subject: string;
}

export interface TaskResponse {
    ObjectID: string;
    ID: string;
    DocumentType: string;
    StatusText: string;
    Owner: string;
    Subject: string;
}