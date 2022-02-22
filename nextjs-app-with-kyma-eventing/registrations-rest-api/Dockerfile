FROM golang:alpine as builder

WORKDIR /build

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -ldflags '-extldflags "-static"' -o main .

FROM scratch

WORKDIR /app

COPY --from=builder /build .

CMD ["./main"]