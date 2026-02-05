package main

import "fmt"
var taxRate = 0.1
var price = 40.0

func main() {
	tax := taxRate * price
	fmt.Println("tax:", tax)
}
