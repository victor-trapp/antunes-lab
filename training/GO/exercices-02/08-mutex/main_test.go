package main

import (
	"sync"
	"testing"
)

func TestCounter(t *testing.T) {
	c := NewCounter()
	c.Inc("web")
	c.Inc("web")
	c.Inc("db")

	if got := c.Get("web"); got != 2 {
		t.Errorf("Get(\"web\") = %d, want 2", got)
	}
	if got := c.Get("db"); got != 1 {
		t.Errorf("Get(\"db\") = %d, want 1", got)
	}
	if got := c.Get("cache"); got != 0 {
		t.Errorf("Get(\"cache\") = %d, want 0", got)
	}
}

func TestCounterConcurrent(t *testing.T) {
	c := NewCounter()
	var wg sync.WaitGroup
	for range 100 {
		wg.Go(func() {
			for range 100 {
				c.Inc("web")
			}
		})
	}
	wg.Wait()

	if got := c.Get("web"); got != 10000 {
		t.Errorf("100 goroutines x 100 Inc = %d, want 10000", got)
	}
}
