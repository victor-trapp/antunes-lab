package main

import "fmt"

// Exercise 04: Generics
//
// Without generics you'd write SumInts, SumFloats, FilterStrings, FilterInts...
// A type parameter lets one function work for many types:
//
//   func Map[T, U any](s []T, f func(T) U) []U
//
// T and U are filled in by the compiler from what you pass in. `any` means any type.
// When the function needs to do something with T, like +, you need a constraint
// that lists the types that support it. Number below is one.
//
// Why this matters: you'll see this all over modern Go, including the slices and
// maps packages in the standard library.
//
// TODO:
// 1. Map: return a new slice with f applied to every element
// 2. Filter: return a new slice with only the elements where keep returns true
// 3. Sum: add up every element. Start from `var total T`
// 4. Add float32 to Number, then check Sum still compiles with a []float32
//
// Check it from training/GO:  go test ./exercices-02/04-generics/

type Number interface {
	~int | ~int64 | ~float64
}

func Map[T, U any](s []T, f func(T) U) []U {
	return nil
}

func Filter[T any](s []T, keep func(T) bool) []T {
	return nil
}

func Sum[T Number](s []T) T {
	var total T
	return total
}

func main() {
	fmt.Println(Map([]int{1, 2, 3}, func(n int) int { return n * 10 }))
	fmt.Println(Filter([]string{"web", "db", "cache"}, func(s string) bool { return len(s) > 2 }))
	fmt.Println(Sum([]float64{1.5, 2.5}))
}
