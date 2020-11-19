FROM golang:1.15 as builder

ENV GO111MODULE=on

WORKDIR /app
COPY go.mod .

RUN go mod download

COPY main.go .
COPY internal internal

RUN CGO_ENABLED=0 GOOS=linux go build -v -a -installsuffix cgo -o c4c-extension-with-user-context .

FROM scratch
WORKDIR /app
COPY --from=builder /etc/ssl/certs /etc/ssl/certs
COPY --from=builder /app/c4c-extension-with-user-context /app/

EXPOSE 8080
ENTRYPOINT ["/app/c4c-extension-with-user-context"]