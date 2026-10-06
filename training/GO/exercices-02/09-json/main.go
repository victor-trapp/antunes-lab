package main

import "fmt"

// Exercise 09: JSON
//
// encoding/json turns structs into JSON and back. Struct tags say what each
// field is called in the JSON:
//
//   type Host struct {
//       Name string `json:"hostname"`
//       Port int    `json:"port,omitempty"`   // left out when it's 0
//   }
//
//   json.Unmarshal(data, &hosts)   // JSON -> Go
//   json.Marshal(h)                // Go -> JSON
//
// Only exported fields (capital letter) are read or written. Without a tag, the
// field name is used, and matching is case insensitive, so "name" would fill Name.
// That's why the JSON here uses "hostname" and "address", so you need the tags.
//
// net.JoinHostPort joins an IP and a port and adds the [] around IPv6 for you.
//
// Why this matters: every API, every config file, the Beszel API, all JSON.
//
// TODO:
// 1. Add json tags to Host: hostname, address, port (omitempty), tags (omitempty)
// 2. ParseInventory: unmarshal data into a []Host. Return the error if it's bad JSON
// 3. Addr: return "address:port", using port 22 when Port is 0
//
// Check it from training/GO:  go test ./exercices-02/09-json/

type Host struct {
	Name string
	IP   string
	Port int
	Tags []string
}

func ParseInventory(data []byte) ([]Host, error) {
	return nil, nil
}

func (h Host) Addr() string {
	return ""
}

func main() {
	data := []byte(`[
		{"hostname": "pve01", "address": "192.168.0.10", "port": 8006, "tags": ["proxmox"]},
		{"hostname": "ansible-cp", "address": "192.168.0.120"}
	]`)

	hosts, err := ParseInventory(data)
	if err != nil {
		fmt.Println("bad inventory:", err)
		return
	}
	for _, h := range hosts {
		fmt.Println(h.Name, h.Addr(), h.Tags)
	}
}
