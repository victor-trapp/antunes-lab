package main

import (
	"slices"
	"testing"
)

func collect(ch <-chan int) []int {
	var out []int
	for n := range ch {
		out = append(out, n)
	}
	return out
}

func TestGen(t *testing.T) {
	got := collect(Gen(1, 2, 3))
	if !slices.Equal(got, []int{1, 2, 3}) {
		t.Errorf("Gen(1, 2, 3) sent %v, want [1 2 3]", got)
	}
	if got := collect(Gen()); len(got) != 0 {
		t.Errorf("Gen() sent %v, want nothing", got)
	}
}

func TestSquare(t *testing.T) {
	got := collect(Square(Gen(1, 2, 3, 4)))
	if !slices.Equal(got, []int{1, 4, 9, 16}) {
		t.Errorf("Square sent %v, want [1 4 9 16]", got)
	}
}

func TestSum(t *testing.T) {
	if got := Sum(Square(Gen(1, 2, 3))); got != 14 {
		t.Errorf("Sum(Square(Gen(1, 2, 3))) = %d, want 14", got)
	}
}
