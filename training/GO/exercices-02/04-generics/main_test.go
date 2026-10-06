package main

import (
	"slices"
	"strconv"
	"testing"
)

func TestMap(t *testing.T) {
	got := Map([]int{1, 2, 3}, strconv.Itoa)
	want := []string{"1", "2", "3"}
	if !slices.Equal(got, want) {
		t.Errorf("Map ints to strings = %v, want %v", got, want)
	}

	lengths := Map([]string{"go", "rust"}, func(s string) int { return len(s) })
	if !slices.Equal(lengths, []int{2, 4}) {
		t.Errorf("Map strings to lengths = %v, want [2 4]", lengths)
	}
}

func TestFilter(t *testing.T) {
	got := Filter([]int{1, 2, 3, 4, 5, 6}, func(n int) bool { return n%2 == 0 })
	if !slices.Equal(got, []int{2, 4, 6}) {
		t.Errorf("Filter evens = %v, want [2 4 6]", got)
	}

	none := Filter([]string{"a", "b"}, func(string) bool { return false })
	if len(none) != 0 {
		t.Errorf("Filter keeping nothing = %v, want empty", none)
	}
}

func TestSum(t *testing.T) {
	if got := Sum([]int{1, 2, 3, 4}); got != 10 {
		t.Errorf("Sum ints = %v, want 10", got)
	}
	if got := Sum([]float64{1.5, 2.5}); got != 4 {
		t.Errorf("Sum floats = %v, want 4", got)
	}

	type Bytes int64
	if got := Sum([]Bytes{512, 512}); got != 1024 {
		t.Errorf("Sum of a named int64 type = %v, want 1024", got)
	}
}
