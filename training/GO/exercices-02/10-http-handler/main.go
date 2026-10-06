package main

import (
	"log"
	"net/http"
)

// Exercise 10: An HTTP health check
//
// A handler is any function with this shape:
//
//   func(w http.ResponseWriter, r *http.Request)
//
// You write the response into w. Headers first, then the status code, then the body:
//
//   w.Header().Set("Content-Type", "application/json")
//   w.WriteHeader(http.StatusOK)
//   json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
//
// Since Go 1.22 a ServeMux pattern can include the method:
//
//   mux.HandleFunc("GET /healthz", Health)
//
// and a POST to /healthz then gets 405 Method Not Allowed for free.
//
// The tests use net/http/httptest, so they never open a real port.
//
// Why this matters: this is the /healthz a Kubernetes liveness probe calls. Every
// service I write for the lab will have one.
//
// TODO:
// 1. Health: reply 200 with Content-Type application/json and the body {"status":"ok"}
// 2. NewMux: register Health on "GET /healthz"
// 3. go run ./exercices-02/10-http-handler/ and then curl localhost:8080/healthz
//
// Check it from training/GO:  go test ./exercices-02/10-http-handler/

func Health(w http.ResponseWriter, r *http.Request) {
}

func NewMux() *http.ServeMux {
	mux := http.NewServeMux()
	return mux
}

func main() {
	log.Println("listening on :8080")
	log.Fatal(http.ListenAndServe(":8080", NewMux()))
}
