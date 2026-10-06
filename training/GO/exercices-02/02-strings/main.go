package main

import "fmt"

// Exercise 02: Strings, runes and table tests
//
// A Go string is a slice of bytes, not characters. "olá" is 4 bytes but 3 characters,
// because "á" takes 2 bytes in UTF-8. A character is called a rune.
//
//   len("olá")          // 4, bytes
//   []rune("olá")       // [o l á], 3 runes
//   for i, r := range s // range over a string gives you runes, not bytes
//
// The strings package has most of what you need: strings.Fields, strings.ToLower,
// strings.Builder for building a string bit by bit.
//
// The tests for this one are table driven: one slice of cases and one loop.
// That is how most Go tests are written.
//
// Why this matters: reversing or slicing a string by bytes works fine until someone
// types a name with an accent in it, and then it prints garbage.
//
// TODO:
// 1. Reverse: reverse s by runes, so Reverse("olá") is "álo"
// 2. WordCount: count each word in s, ignoring case. "Go go" is {"go": 2}
// 3. IsPalindrome: true if s reads the same backwards, ignoring case and spaces
// 4. Open main_test.go and add two cases of your own to each table
//
// Check it from training/GO:  go test ./exercices-02/02-strings/

func Reverse(s string) string {
	return ""
}

func WordCount(s string) map[string]int {
	return nil
}

func IsPalindrome(s string) bool {
	return false
}

func main() {
	fmt.Println(Reverse("olá"))
	fmt.Println(WordCount("the cat and the hat"))
	fmt.Println(IsPalindrome("Never odd or even"))
}
