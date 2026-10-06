package main

import "fmt"

// Exercise 03: Custom errors
//
// Exercise 10 in exercices-01 used a sentinel error and errors.Is. That tells you
// *which* error happened. When the caller also needs details, make your own error type:
//
//   type RangeError struct{ Value int }
//   func (e *RangeError) Error() string { return ... }
//
// Anything with an Error() string method is an error. To get it back out of a
// (possibly wrapped) error, use errors.As:
//
//   var re *RangeError
//   if errors.As(err, &re) { fmt.Println(re.Value) }
//
// Why this matters: real tools need to tell "you typed garbage" apart from "that
// number is out of range" and say something useful for each.
//
// TODO:
// 1. Make RangeError.Error() return "port <Value> out of range 1-65535"
// 2. Write ParsePort:
//    - use strconv.Atoi to turn s into a number
//    - if that fails, return the error wrapped with fmt.Errorf and %w
//      (the test checks errors.Is(err, strconv.ErrSyntax) still works)
//    - if the number is below 1 or above 65535, return &RangeError{Value: n}
//    - otherwise return the port and nil
// 3. In main, parse "22", "0", "70000" and "ssh", and print a different message
//    for a RangeError than for anything else
//
// Check it from training/GO:  go test ./exercices-02/03-custom-errors/

type RangeError struct {
	Value int
}

func (e *RangeError) Error() string {
	return ""
}

func ParsePort(s string) (int, error) {
	return 0, nil
}

func main() {
	_ = fmt.Println // remove this line once you use fmt
}
