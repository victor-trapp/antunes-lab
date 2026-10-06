package main

import (
	"encoding/json"
	"slices"
	"testing"
)

func TestParseInventory(t *testing.T) {
	data := []byte(`[
		{"hostname": "pve01", "address": "192.168.0.10", "port": 8006, "tags": ["proxmox", "host"]},
		{"hostname": "ansible-cp", "address": "192.168.0.120"}
	]`)

	hosts, err := ParseInventory(data)
	if err != nil {
		t.Fatalf("ParseInventory error: %v", err)
	}
	if len(hosts) != 2 {
		t.Fatalf("got %d hosts, want 2", len(hosts))
	}

	pve := hosts[0]
	if pve.Name != "pve01" || pve.IP != "192.168.0.10" || pve.Port != 8006 {
		t.Errorf("first host = %+v, want pve01 at 192.168.0.10:8006", pve)
	}
	if !slices.Equal(pve.Tags, []string{"proxmox", "host"}) {
		t.Errorf("first host tags = %v, want [proxmox host]", pve.Tags)
	}
	if hosts[1].Name != "ansible-cp" || hosts[1].Port != 0 {
		t.Errorf("second host = %+v, want ansible-cp with no port", hosts[1])
	}
}

func TestParseInventoryBadJSON(t *testing.T) {
	if _, err := ParseInventory([]byte(`[{"hostname": `)); err == nil {
		t.Error("ParseInventory on broken JSON should return an error")
	}
}

func TestMarshalLeavesOutEmptyFields(t *testing.T) {
	got, err := json.Marshal(Host{Name: "ansible-cp", IP: "192.168.0.120"})
	if err != nil {
		t.Fatal(err)
	}
	want := `{"hostname":"ansible-cp","address":"192.168.0.120"}`
	if string(got) != want {
		t.Errorf("json.Marshal = %s, want %s", got, want)
	}
}

func TestAddr(t *testing.T) {
	tests := []struct {
		host Host
		want string
	}{
		{Host{IP: "192.168.0.10", Port: 8006}, "192.168.0.10:8006"},
		{Host{IP: "192.168.0.120"}, "192.168.0.120:22"},
		{Host{IP: "fe80::1", Port: 80}, "[fe80::1]:80"},
	}
	for _, tt := range tests {
		if got := tt.host.Addr(); got != tt.want {
			t.Errorf("Addr() for %+v = %q, want %q", tt.host, got, tt.want)
		}
	}
}
