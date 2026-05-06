FROM golang:1.22-alpine AS builder
WORKDIR /src
COPY go.mod main.go ./
RUN CGO_ENABLED=0 go build -o /out/edge-status-api .

FROM alpine:3.20
COPY --from=builder /out/edge-status-api /edge-status-api
EXPOSE 8080
CMD ["/edge-status-api"]