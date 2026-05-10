# Go Platform Learning Notes

Notes I write as I build Go things in the lab. Not a course or a guide — just things I want to remember as I go.

## What I have built so far

- `edge-status-api` — a small HTTP API with multiple endpoints, JSON responses, and Kubernetes probes

## Things I learned building edge-status-api

### Serving HTTP in Go

The standard library `net/http` package handles routing without needing any framework.

```go
http.HandleFunc("/health", health)
log.Fatal(http.ListenAndServe(":8080", nil))
```

Each handler is just a function that takes a `ResponseWriter` and a `*Request`.

### Reading env vars with a fallback

```go
func getenv(key, fallback string) string {
    if v := os.Getenv(key); v != "" {
        return v
    }
    return fallback
}
```

This pattern is useful in containers where i want defaults but allow overrides through env vars.

### Writing JSON responses

```go
func writeJSON(w http.ResponseWriter, v any) {
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(v)
}
```

Set the content type first, then encode directly into the response writer.
