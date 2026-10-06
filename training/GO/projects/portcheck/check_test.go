package main

import (
	"context"
	"fmt"
	"net"
	"sync/atomic"
	"testing"
	"time"
)

// openPort starts a listener on a random local port and returns its address.
func openPort(t *testing.T) string {
	t.Helper()
	ln, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { ln.Close() })
	go func() {
		for {
			conn, err := ln.Accept()
			if err != nil {
				return
			}
			conn.Close()
		}
	}()
	return ln.Addr().String()
}

// closedPort finds a free local port and closes it again, so nothing is listening.
func closedPort(t *testing.T) string {
	t.Helper()
	ln, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		t.Fatal(err)
	}
	addr := ln.Addr().String()
	ln.Close()
	return addr
}

func TestCheckOpen(t *testing.T) {
	addr := openPort(t)
	r := Check(context.Background(), addr, time.Second)

	if !r.Open || r.Err != nil {
		t.Errorf("Check(%s) = open %v, err %v, want open with no error", addr, r.Open, r.Err)
	}
	if r.Addr != addr {
		t.Errorf("Result.Addr = %q, want %q", r.Addr, addr)
	}
	if r.Latency <= 0 {
		t.Errorf("Result.Latency = %v, want more than 0", r.Latency)
	}
}

func TestCheckClosed(t *testing.T) {
	addr := closedPort(t)
	r := Check(context.Background(), addr, time.Second)

	if r.Open || r.Err == nil {
		t.Errorf("Check(%s) = open %v, err %v, want closed with an error", addr, r.Open, r.Err)
	}
}

func TestCheckBadAddress(t *testing.T) {
	r := Check(context.Background(), "no-port-here", time.Second)
	if r.Open || r.Err == nil {
		t.Errorf("Check on an address with no port = open %v, err %v, want an error", r.Open, r.Err)
	}
}

func TestCheckRespectsContext(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	cancel()
	r := Check(ctx, openPort(t), time.Second)
	if r.Open || r.Err == nil {
		t.Errorf("Check with a cancelled context = open %v, err %v, want an error", r.Open, r.Err)
	}
}

func TestCheckAllKeepsOrder(t *testing.T) {
	open1, closed, open2 := openPort(t), closedPort(t), openPort(t)
	addrs := []string{open1, closed, open2}

	results := CheckAll(context.Background(), addrs, 2, time.Second)
	if len(results) != len(addrs) {
		t.Fatalf("got %d results, want %d", len(results), len(addrs))
	}
	wantOpen := []bool{true, false, true}
	for i, r := range results {
		if r.Addr != addrs[i] || r.Open != wantOpen[i] {
			t.Errorf("results[%d] = %s open %v, want %s open %v", i, r.Addr, r.Open, addrs[i], wantOpen[i])
		}
	}
}

func TestCheckAllLimitsWorkers(t *testing.T) {
	// Swap check for a slow fake that counts how many run at once.
	var running, most atomic.Int32
	orig := check
	t.Cleanup(func() { check = orig })
	check = func(ctx context.Context, addr string, timeout time.Duration) Result {
		n := running.Add(1)
		for {
			m := most.Load()
			if n <= m || most.CompareAndSwap(m, n) {
				break
			}
		}
		time.Sleep(20 * time.Millisecond)
		running.Add(-1)
		return Result{Addr: addr, Open: true}
	}

	addrs := make([]string, 12)
	for i := range addrs {
		addrs[i] = fmt.Sprintf("host-%d:22", i)
	}
	results := CheckAll(context.Background(), addrs, 3, time.Second)

	if len(results) != len(addrs) {
		t.Fatalf("got %d results, want %d", len(results), len(addrs))
	}
	if got := most.Load(); got > 3 {
		t.Errorf("%d checks ran at once, want at most 3 (the workers limit)", got)
	} else if got < 2 {
		t.Errorf("only %d check ran at once, they should run in parallel", got)
	}
}
