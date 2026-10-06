package main

import "fmt"

// Exercise 01: Methods
//
// A method is a function with a receiver. The receiver is either a value or a pointer:
//
//   func (r Rectangle) Area() float64    // gets a copy of r
//   func (r *Rectangle) Scale(f float64) // can change r
//
// If the method needs to change the struct, it needs a pointer receiver.
// A value receiver changes a copy, and the copy is thrown away when the method returns.
//
// Why this matters: this is the most common surprise when coming to Go. The code
// compiles, nothing errors, and the struct just doesn't change.
//
// TODO:
// 1. Make Area return Width * Height
// 2. Make Perimeter return 2 * (Width + Height)
// 3. Make Scale multiply Width and Height by f. The test still fails until you
//    change it to a pointer receiver. Try it with the value receiver first and see.
// 4. Make IsSquare return true when Width == Height
//
// Check it from training/GO:  go test ./exercices-02/01-methods/

type Rectangle struct {
	Width, Height float64
}

func (r Rectangle) Area() float64 {
	return 0
}

func (r Rectangle) Perimeter() float64 {
	return 0
}

func (r Rectangle) Scale(f float64) {
}

func (r Rectangle) IsSquare() bool {
	return false
}

func main() {
	r := Rectangle{Width: 3, Height: 4}
	fmt.Println("area:", r.Area(), "perimeter:", r.Perimeter())
	r.Scale(2)
	fmt.Println("after scale:", r.Width, r.Height)
}
