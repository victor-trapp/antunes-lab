package main

import "fmt"

func Greet(name1, name2 string) {
	fmt.Printf("Hello, %s and %s!\n", name1, name2)
}

func main() {
	Greet("Alice", "Bob")
}
