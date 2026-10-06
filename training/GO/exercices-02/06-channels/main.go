package main

import "fmt"

// Exercise 06: Channels and pipelines
//
// A channel is a pipe between goroutines. One side sends, the other receives:
//
//   ch := make(chan int)
//   go func() { ch <- 42; close(ch) }()
//   for n := range ch { ... }   // keeps going until the channel is closed
//
// A pipeline is a chain of stages. Each stage takes a channel in, starts a goroutine
// that works on the values, and hands back a new channel out:
//
//   Gen(1, 2, 3) -> Square -> Sum
//
// Return the channel as <-chan int (receive only) so callers can't send into it.
//
// Why this matters: this is how Go programs move data between workers without
// sharing memory and without locks.
//
// TODO:
// 1. Gen: return a channel that gets every number in nums, then is closed
// 2. Square: return a channel with every value from in squared, closed when in is
// 3. Sum: read everything from in and return the total
//
// If a test hangs, a channel isn't being closed, so the range never ends.
// Ctrl+C, or run with -timeout 5s.
//
// Check it from training/GO:  go test ./exercices-02/06-channels/

func Gen(nums ...int) <-chan int {
	out := make(chan int)
	close(out)
	return out
}

func Square(in <-chan int) <-chan int {
	out := make(chan int)
	close(out)
	return out
}

func Sum(in <-chan int) int {
	return 0
}

func main() {
	fmt.Println(Sum(Square(Gen(1, 2, 3))))
}
