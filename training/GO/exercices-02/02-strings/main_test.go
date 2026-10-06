package main

import (
	"maps"
	"testing"
)

func TestReverse(t *testing.T) {
	tests := []struct {
		in, want string
	}{
		{"", ""},
		{"Go", "oG"},
		{"hello", "olleh"},
		{"olá", "álo"},
		// TODO: add two cases of your own
	}
	for _, tt := range tests {
		if got := Reverse(tt.in); got != tt.want {
			t.Errorf("Reverse(%q) = %q, want %q", tt.in, got, tt.want)
		}
	}
}

func TestWordCount(t *testing.T) {
	tests := []struct {
		in   string
		want map[string]int
	}{
		{"", map[string]int{}},
		{"the cat and the hat", map[string]int{"the": 2, "cat": 1, "and": 1, "hat": 1}},
		{"Go go GO", map[string]int{"go": 3}},
		{"  extra   spaces  ", map[string]int{"extra": 1, "spaces": 1}},
		// TODO: add two cases of your own
	}
	for _, tt := range tests {
		if got := WordCount(tt.in); !maps.Equal(got, tt.want) {
			t.Errorf("WordCount(%q) = %v, want %v", tt.in, got, tt.want)
		}
	}
}

func TestIsPalindrome(t *testing.T) {
	tests := []struct {
		in   string
		want bool
	}{
		{"", true},
		{"racecar", true},
		{"Never odd or even", true},
		{"go", false},
		// TODO: add two cases of your own
	}
	for _, tt := range tests {
		if got := IsPalindrome(tt.in); got != tt.want {
			t.Errorf("IsPalindrome(%q) = %v, want %v", tt.in, got, tt.want)
		}
	}
}
