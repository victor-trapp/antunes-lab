package main

import "fmt"

// Exercise 05 — Arrays & Slices
//
// An array has a fixed size:   [3]int{1, 2, 3}
// A slice is dynamic:          []int{1, 2, 3}
//
// Slices are what you'll use almost always. Use `append` to grow them.
// `len` gives the number of elements. `range` lets you iterate over them.
//
// Why this matters: slices are Go's workhorse collection type.
// Knowing the difference between arrays (value-copied) and slices (reference-like)
// prevents subtle bugs when passing collections to functions.
//
// TODO:
// 1. Declare a slice of strings with 3 fruit names
// 2. Append 2 more fruits to the slice using `append`
// 3. Use a `for range` loop to print each fruit with its index
// 4. Print the final length of the slice

func main() {
	// Your code here
	_ = fmt.Println // remove this line once you use fmt
}
