package main

import "fmt"

// Exercise 08 — Pointers
//
// A pointer holds the memory address of a value.
//   &x   — gives you the address of x (a pointer to x)
//   *p   — dereferences p (reads or writes the value at that address)
//
// Go does NOT have pointer arithmetic like C — it's memory-safe by design.
//
// Why this matters: Go passes everything by value (a copy). Pointers let you
// share and mutate a value across function calls without copying it.
// You'll also see pointers used with structs to avoid expensive copies.
//
// TODO:
// 1. Declare an int variable `x` with value 10
// 2. Create a pointer `p` that points to `x`
// 3. Use the pointer to change the value of `x` to 20
// 4. Print `x` directly — it should now be 20
// 5. Write a function `double(n *int)` that doubles the value in place
//    Call it with &x and verify the result

func main() {
	// Your code here
	_ = fmt.Println // remove this line once you use fmt
}
