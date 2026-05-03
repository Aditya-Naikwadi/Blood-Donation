# Stage 1: Builder
FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

# Stage 2: Runner
FROM gcr.io/distroless/static:nonroot
WORKDIR /
COPY --from=builder /app/main /main
USER nonroot:nonroot
EXPOSE 3002
HEALTHCHECK --interval=30s --timeout=3s \
  CMD ["/main", "-health"] 
ENTRYPOINT ["/main"]
