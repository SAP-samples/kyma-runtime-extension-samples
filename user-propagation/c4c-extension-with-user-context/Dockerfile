FROM golang:1.21 as builder

ENV CGO_ENABLED=0 GOOS=linux GOARCH=amd64 GO111MODULE=on

WORKDIR /app
COPY go.mod .

COPY main.go .
COPY internal internal

RUN go mod download
RUN go mod tidy

RUN CGO_ENABLED=0 GOOS=linux go build -o c4c-extension-with-user-context .

FROM scratch
WORKDIR /app
COPY --from=builder /etc/ssl/certs /etc/ssl/certs
COPY --from=builder /app/c4c-extension-with-user-context /app/

EXPOSE 8080
ENTRYPOINT ["/app/c4c-extension-with-user-context"]