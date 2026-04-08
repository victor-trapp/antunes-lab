package main

import "fmt"

// Exercise 06 — Maps
//
// A map is Go's built-in key-value store: map[KeyType]ValueType
// Always initialize maps before writing to them — writing to a nil map panics.
//   make(map[string]int)   or   map[string]int{"a": 1}
//
// To check if a key exists use the two-value form:
//   value, ok := m[key]   — ok is false if the key is missing
//
// Why this matters: maps are used constantly for lookups, counting, and grouping.
// The `value, ok` idiom is a Go pattern you'll encounter everywhere.
//
// TODO:
// 1. Create a map that stores the age of 3 people (name -> age)
// 2. Print the age of one specific person
// 3. Check if a key "Alice" exists in the map and print an appropriate message
// 4. Delete one entry using `delete` and print the map length before and after

func main() {
	// Your code here
	_ = fmt.Println // remove this line once you use fmt
}
