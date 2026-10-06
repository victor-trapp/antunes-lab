package main

import "testing"

func TestArea(t *testing.T) {
	r := Rectangle{Width: 3, Height: 4}
	if got := r.Area(); got != 12 {
		t.Errorf("Area() = %v, want 12", got)
	}
}

func TestPerimeter(t *testing.T) {
	r := Rectangle{Width: 3, Height: 4}
	if got := r.Perimeter(); got != 14 {
		t.Errorf("Perimeter() = %v, want 14", got)
	}
}

func TestScale(t *testing.T) {
	r := Rectangle{Width: 3, Height: 4}
	r.Scale(2)
	if r.Width != 6 || r.Height != 8 {
		t.Errorf("after Scale(2) got %vx%v, want 6x8 (is Scale using a pointer receiver?)", r.Width, r.Height)
	}
}

func TestIsSquare(t *testing.T) {
	square := Rectangle{Width: 5, Height: 5}
	if !square.IsSquare() {
		t.Error("5x5 should be a square")
	}
	notSquare := Rectangle{Width: 3, Height: 4}
	if notSquare.IsSquare() {
		t.Error("3x4 should not be a square")
	}
}
