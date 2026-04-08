package main

import "fmt"

// Exercise 07 — Structs
//
// A struct groups named fields together to model real-world data.
// Methods are attached to structs via a receiver: func (p Person) Greet() { ... }
// Use a pointer receiver `*Person` when the method needs to modify the struct.
//
// Why this matters: Go uses structs instead of classes. There is no inheritance —
// Go favors composition (embedding one struct in another). This keeps things simple
// and avoids the complexity of deep class hierarchies.
//
// TODO:
// 1. Define a struct `Person` with fields: Name (string) and Age (int)
// 2. Add a method `Greet()` on Person that prints:
//    "Hi, I'm <Name> and I'm <Age> years old"
// 3. Create two Person values — one using a struct literal, one using &Person{}
// 4. Call Greet() on both

func main() {
	// Your code here
	_ = fmt.Println // remove this line once you use fmt
}
