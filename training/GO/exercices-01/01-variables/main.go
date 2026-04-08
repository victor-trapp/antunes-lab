package main

import "fmt"

// Exercise 01 — Variables & Types
//
// In Go, variables are statically typed — the type is fixed at compile time.
// You can declare variables with `var` or use the shorthand `:=` (only inside functions).
// Constants are declared with `const` and can never be reassigned.
//
// Why this matters: Go's type system catches mismatches (e.g. adding a string to an int)
// at compile time, before your code even runs. This prevents a whole class of runtime bugs.
//
// TODO:
// 1. Declare a variable `name` of type string using `var` and assign your name to it
// 2. Declare a variable `age` of type int using the shorthand `:=`
// 3. Declare a constant `pi` equal to 3.14159
// 4. Print all three values using fmt.Println

func main() {
	var name string = "victor"
	age := 15
	const pi float64 = 3.14159

	fmt.Println("hi", name)
	fmt.Println("my age is", age)
	fmt.Println("pi number", pi)
}
