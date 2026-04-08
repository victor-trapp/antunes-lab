package main

import "fmt"

// Exercise 04 — Functions
//
// Functions are declared with `func`. Go supports multiple return values,
// which is how errors are returned alongside results — no exceptions.
// Parameters and return types must be explicitly typed.
//
// Why this matters: multiple return values are one of Go's most practical features.
// The pattern `result, err := someFunc()` is the standard Go error-handling idiom
// and you will see it in virtually every Go program.
//
// TODO:
// 1. Write a function `add(a, b int) int` that returns the sum of two integers
// 2. Write a function `divide(a, b float64) (float64, error)` that returns
//    the result of a/b, or an error if b is zero (use fmt.Errorf to create the error)
// 3. Call both functions in main and print the results
// 4. Handle the error from divide with an if statement and print a message if it occurs

func main() {
	// Your code here
	_ = fmt.Println // remove this line once you use fmt
}
