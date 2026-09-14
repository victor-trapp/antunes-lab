package main

import "fmt"

const word = "hi, "

func Hello(name string) string {
	if name == "" {
		name = "World"
	}
	return word + name
}

func main() {
	fmt.Println(Hello("victor"))
}
