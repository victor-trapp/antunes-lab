package main

import (
	"fmt"
	"time"
)

// Exercise 05: Goroutines and WaitGroup
//
// `go f()` runs f at the same time as the rest of your code. main doesn't wait for
// it, so you need a way to know when every goroutine is done. sync.WaitGroup:
//
//   var wg sync.WaitGroup
//   for _, h := range hosts {
//       wg.Go(func() { ... })  // starts the goroutine and counts it
//   }
//   wg.Wait()                  // blocks until all of them finish
//
// wg.Go is new in Go 1.25. Older code does wg.Add(1), go func() { defer wg.Done() ... }().
//
// To keep results in order without a lock, give each goroutine its own slot:
// make the result slice up front and have goroutine i write only to results[i].
//
// Why this matters: checking 50 hosts one after another at 1 second each takes
// almost a minute. Doing them all at once takes about a second.
//
// TODO:
// 1. Write LookupAll: call lookup for every host, each in its own goroutine,
//    and return the results in the same order as hosts
// 2. Run the tests with the race detector too:  go test -race ./exercices-02/05-goroutines/
//
// Check it from training/GO:  go test ./exercices-02/05-goroutines/

func LookupAll(hosts []string, lookup func(string) string) []string {
	return nil
}

func slowLookup(host string) string {
	time.Sleep(500 * time.Millisecond)
	return host + ": up"
}

func main() {
	start := time.Now()
	results := LookupAll([]string{"pve01", "ansible-cp", "kairos-cp", "k8s-cp-01"}, slowLookup)
	for _, r := range results {
		fmt.Println(r)
	}
	fmt.Println("took", time.Since(start).Round(time.Millisecond))
}
