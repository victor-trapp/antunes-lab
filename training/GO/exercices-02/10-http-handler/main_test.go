package main

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestHealth(t *testing.T) {
	rec := httptest.NewRecorder()
	Health(rec, httptest.NewRequest(http.MethodGet, "/healthz", nil))

	if rec.Code != http.StatusOK {
		t.Errorf("status = %d, want 200", rec.Code)
	}
	if ct := rec.Header().Get("Content-Type"); ct != "application/json" {
		t.Errorf("Content-Type = %q, want application/json", ct)
	}
	var body map[string]string
	if err := json.NewDecoder(rec.Body).Decode(&body); err != nil {
		t.Fatalf("body is not JSON: %v", err)
	}
	if body["status"] != "ok" {
		t.Errorf("body = %v, want {\"status\":\"ok\"}", body)
	}
}

func TestMux(t *testing.T) {
	srv := httptest.NewServer(NewMux())
	defer srv.Close()

	tests := []struct {
		method, path string
		want         int
	}{
		{http.MethodGet, "/healthz", http.StatusOK},
		{http.MethodPost, "/healthz", http.StatusMethodNotAllowed},
		{http.MethodGet, "/nope", http.StatusNotFound},
	}
	for _, tt := range tests {
		req, _ := http.NewRequest(tt.method, srv.URL+tt.path, nil)
		resp, err := http.DefaultClient.Do(req)
		if err != nil {
			t.Fatal(err)
		}
		resp.Body.Close()
		if resp.StatusCode != tt.want {
			t.Errorf("%s %s = %d, want %d", tt.method, tt.path, resp.StatusCode, tt.want)
		}
	}
}
