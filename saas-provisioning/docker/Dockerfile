FROM golang:1.14 as builder

ENV GO111MODULE=on

WORKDIR /app
COPY go.mod .
COPY go.sum .

RUN go mod download

COPY cmd               ./cmd
COPY internal               ./internal

RUN ls /app/
RUN CGO_ENABLED=0 GOOS=linux go build -v -a -o saas-provioning ./cmd/api

FROM alpine:3.8 as certs
RUN apk add -U --no-cache ca-certificates

FROM scratch
WORKDIR /app
COPY --from=builder /app/saas-provioning  /app/
COPY --from=certs /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY resources               /app/resources

EXPOSE 8000
ENTRYPOINT ["/app/saas-provioning"]