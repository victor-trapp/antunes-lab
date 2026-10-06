package main

import (
	"fmt"
	"sync"
)

// Exercise 08: Mutex
//
// When several goroutines change the same thing, they need to take turns.
// A sync.Mutex is the lock:
//
//   c.mu.Lock()
//   defer c.mu.Unlock()
//   c.counts[key]++
//
// A map is not safe to write from two goroutines at once. Go notices and crashes
// with "fatal error: concurrent map writes". That's on purpose, it's better than
// silently losing data.
//
// Channels (exercise 06) are for passing data around. A mutex is for protecting
// data that stays in one place. A counter is the second kind.
//
// Why this matters: a request counter on a web server is touched by every request,
// and every request runs in its own goroutine.
//
// TODO:
// 1. NewCounter: return a Counter with the map made, so Inc doesn't panic on a nil map
// 2. Inc: add one to counts[key]
// 3. Get: return counts[key]
// 4. Do it without the lock first and run the tests. Then add the lock.
//
// Check it from training/GO:  go test -race ./exercices-02/08-mutex/

type Counter struct {
	mu     sync.Mutex
	counts map[string]int
}

func NewCounter() *Counter {
	return &Counter{}
}

func (c *Counter) Inc(key string) {
}

func (c *Counter) Get(key string) int {
	return 0
}

func main() {
	c := NewCounter()
	var wg sync.WaitGroup
	for range 1000 {
		wg.Go(func() { c.Inc("requests") })
	}
	wg.Wait()
	fmt.Println("requests:", c.Get("requests"))
}
