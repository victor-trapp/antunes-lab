package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"time"
)

func main() {
	port := getenv("PORT", "8080")

	http.HandleFunc("/", root)
	http.HandleFunc("/health", health)
	http.HandleFunc("/ready", ready)
	http.HandleFunc("/version", version)
	http.HandleFunc("/info", info)

	log.Printf("boom listening on :%s", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}

func root(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, map[string]string{"msg": "edge-status-api UP"})
}

func health(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, map[string]string{"status": "YEAH"})
}

func ready(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, map[string]string{"status": "well ready"})
}

func version(w http.ResponseWriter, r *http.Request) {
	host, err := os.Hostname()
	if err != nil {
		host = "unknown"
	}

	writeJSON(w, map[string]string{
		"service":   "edge-status-api",
		"version":   getenv("APP_VERSION", "dev"),
		"hostname":  host,
		"timestamp": time.Now().UTC().Format(time.RFC3339),
	})
}

func info(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, map[string]string{
		"environment": getenv("ENVIRONMENT", "trapp-lab"),
		"site_name":   getenv("SITE_NAME", "the real trapp-lab"),
		"message":     getenv("MESSAGE", "ola tudo bem?? hi from my Talos Kubernetes cluster :)"),
	})
}

func writeJSON(w http.ResponseWriter, v any) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(v)
}

func getenv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}