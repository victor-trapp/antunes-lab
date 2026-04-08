package main

import "fmt"

// Exercise 09 — Interfaces
//
// An interface defines a set of method signatures.
// Any type that implements those methods satisfies the interface automatically —
// there is no `implements` keyword. This is called implicit satisfaction.
//
// Why this matters: interfaces let you write functions that work with any type
// that has the right behavior. This makes code flexible and easy to test
// without tightly coupling to concrete types.
//
// TODO:
// 1. Define an interface `Shape` with a single method: Area() float64
// 2. Create two structs: Rectangle (Width, Height float64) and Circle (Radius float64)
// 3. Implement Area() for both:
//    - Rectangle: Width * Height
//    - Circle:    3.14159 * Radius * Radius
// 4. Write a function `printArea(s Shape)` that prints the area of any Shape
// 5. Call printArea with both a Rectangle and a Circle from main

func main() {
	// Your code here
	_ = fmt.Println // remove this line once you use fmt
}
