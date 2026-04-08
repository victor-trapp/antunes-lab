package main

import (
	"errors"
	"fmt"
)

// Exercise 10 — Error Handling
//
// Go does not have exceptions. Errors are plain values of type `error`.
// Functions signal failure by returning an error as the last return value.
// The caller is responsible for checking it — ignoring errors is a conscious choice.
//
// You can create errors with:
//   fmt.Errorf("something went wrong: %w", err)   — wraps another error
//   errors.New("something went wrong")             — simple error
//
// Use errors.Is(err, target) to check for a specific sentinel error.
//
// Why this matters: explicit error handling makes failure paths visible and
// forces you to think about what can go wrong. It leads to more robust programs
// compared to unchecked exceptions that can silently propagate.
//
// TODO:
// 1. Define a sentinel error: var ErrNotFound = errors.New("not found")
// 2. Write a function `findUser(id int) (string, error)` that:
//    - Returns "Alice" if id == 1
//    - Returns "Bob"   if id == 2
//    - Returns ErrNotFound for any other id (wrap it with fmt.Errorf and %w)
// 3. In main, call findUser with ids 1, 2, and 99
// 4. For each call, handle the error:
//    - Use errors.Is to detect ErrNotFound specifically
//    - Print the username when found, print "user not found" when not

func main() {
	// Your code here
	_ = fmt.Println // remove this line once you use fmt
	_ = errors.New  // remove this line once you use errors
}
