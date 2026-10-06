package main

import (
	"context"
	"time"
)

// Result is what one check found.
type Result struct {
	Addr    string
	Open    bool
	Latency time.Duration
	Err     error
}

// check is what CheckAll calls for each address. It's a variable so the tests
// can swap in a slow fake and count how many checks run at once, so call
// check(...) in CheckAll, not Check(...).
var check = Check

// Check dials addr over TCP and reports whether it opened within timeout.
//
// TODO: see README.md
func Check(ctx context.Context, addr string, timeout time.Duration) Result {
	return Result{Addr: addr}
}

// CheckAll checks every address, at most workers at a time, and returns the
// results in the same order as addrs.
//
// TODO: see README.md
func CheckAll(ctx context.Context, addrs []string, workers int, timeout time.Duration) []Result {
	return nil
}
