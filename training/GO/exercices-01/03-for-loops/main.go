package main

import "fmt"

// Exercise 03 — For Loops
//
// Go has only ONE loop keyword: `for`. It covers all patterns:
//   Classic:    for i := 0; i < 10; i++ { ... }
//   While-like: for condition { ... }
//   Infinite:   for { ... }  — use `break` to exit
//   Range:      for i, v := range slice { ... }
//
// Why this matters: a single loop construct means less to learn and
// more consistent code across any Go codebase. `range` is especially
// powerful — it works on slices, maps, strings, and channels.
//
// TODO:
// 1. Use a classic for loop to print numbers 1 through 10
// 2. Use a while-like for loop to count down from 5 to 1, then print "Go!"
// 3. BONUS: use `continue` to skip even numbers when printing 1 through 20

func main() {
	// Your code here
	_ = fmt.Println // remove this line once you use fmt
}
