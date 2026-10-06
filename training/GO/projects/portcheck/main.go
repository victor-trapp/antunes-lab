package main

import (
	"context"
	"fmt"
	"os"
	"time"
)

func main() {
	// TODO: -workers and -timeout flags, addresses from os.Args or stdin,
	// a table with text/tabwriter, and exit 1 if anything is closed.
	addrs := os.Args[1:]
	for _, r := range CheckAll(context.Background(), addrs, 10, 2*time.Second) {
		fmt.Println(r.Addr, r.Open, r.Latency, r.Err)
	}
}
