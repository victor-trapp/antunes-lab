package main

import (
	"fmt"
	"slices"
	"testing"
	"time"
)

func TestLookupAllKeepsOrder(t *testing.T) {
	hosts := []string{"a", "b", "c", "d"}
	got := LookupAll(hosts, func(h string) string { return h + "!" })
	want := []string{"a!", "b!", "c!", "d!"}
	if !slices.Equal(got, want) {
		t.Errorf("LookupAll = %v, want %v", got, want)
	}
}

func TestLookupAllRunsAtTheSameTime(t *testing.T) {
	hosts := make([]string, 10)
	for i := range hosts {
		hosts[i] = fmt.Sprintf("host-%d", i)
	}
	lookup := func(h string) string {
		time.Sleep(100 * time.Millisecond)
		return h
	}

	start := time.Now()
	got := LookupAll(hosts, lookup)
	took := time.Since(start)

	if !slices.Equal(got, hosts) {
		t.Errorf("LookupAll = %v, want %v", got, hosts)
	}
	// One after another would take a full second.
	if took > 500*time.Millisecond {
		t.Errorf("10 lookups of 100ms took %v, they should run at the same time", took)
	}
}

func TestLookupAllEmpty(t *testing.T) {
	if got := LookupAll(nil, func(h string) string { return h }); len(got) != 0 {
		t.Errorf("LookupAll(nil) = %v, want empty", got)
	}
}
