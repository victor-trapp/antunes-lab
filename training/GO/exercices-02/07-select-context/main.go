package main

import (
	"context"
	"errors"
	"fmt"
	"time"
)

// Exercise 07: select and context
//
// select waits on several channels at once and runs whichever case is ready first:
//
//   select {
//   case v := <-results:
//       // got an answer
//   case <-ctx.Done():
//       return ctx.Err()   // cancelled, or the deadline passed
//   }
//
// A context.Context carries a deadline or a cancel signal down through your calls.
// context.WithTimeout(ctx, 2*time.Second) gives you one that gives up after 2 seconds.
// time.After(d) gives you a channel that fires once after d.
//
// Why this matters: anything that talks to the network should be able to give up.
// A health check that hangs forever on a dead host is worse than no health check.
//
// TODO:
// 1. Wait: return nil after d, or ctx.Err() if ctx is done first
// 2. Fetch: run work in a goroutine and return its result, or 0 and ctx.Err()
//    if ctx is done first. Give the goroutine a buffered channel (make(chan int, 1))
//    so it can still send and exit after you've stopped waiting for it.
//
// Check it from training/GO:  go test ./exercices-02/07-select-context/

var errNotDone = errors.New("not implemented yet")

func Wait(ctx context.Context, d time.Duration) error {
	return errNotDone
}

func Fetch(ctx context.Context, work func() int) (int, error) {
	return 0, errNotDone
}

func main() {
	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Millisecond)
	defer cancel()

	n, err := Fetch(ctx, func() int {
		time.Sleep(time.Second)
		return 42
	})
	fmt.Println(n, err)
}
