package main

import "testing"

func TestHello(t *testing.T) {
	t.Run("saying hi to people", func(t *testing.T) {
		got := Hello("Antunes")
		want := "hi, Antunes"
		rightName(t, got, want)
	})

	t.Run("say 'hi, World' when an empty string is supplied", func(t *testing.T) {
		got := Hello("")
		want := "hi, World"
		rightName(t, got, want)
	})

	t.Run("test if name is victor", func(t *testing.T) {
		got := Hello("victor")
		want := "hi, victor"
		rightName(t, got, want)
	})
}

func rightName(t testing.TB, got, want string) {
	t.Helper()
	if got != want {
		t.Errorf("got %q want %q", got, want)
	}
}
