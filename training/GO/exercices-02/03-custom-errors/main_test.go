package main

import (
	"errors"
	"strconv"
	"testing"
)

func TestParsePortValid(t *testing.T) {
	for _, in := range []string{"1", "22", "8006", "65535"} {
		want, _ := strconv.Atoi(in)
		got, err := ParsePort(in)
		if err != nil || got != want {
			t.Errorf("ParsePort(%q) = %d, %v, want %d, nil", in, got, err, want)
		}
	}
}

func TestParsePortOutOfRange(t *testing.T) {
	for _, in := range []string{"0", "-1", "65536", "70000"} {
		_, err := ParsePort(in)
		var re *RangeError
		if !errors.As(err, &re) {
			t.Errorf("ParsePort(%q) error = %v, want a *RangeError", in, err)
			continue
		}
		want, _ := strconv.Atoi(in)
		if re.Value != want {
			t.Errorf("ParsePort(%q) RangeError.Value = %d, want %d", in, re.Value, want)
		}
	}
}

func TestParsePortNotANumber(t *testing.T) {
	_, err := ParsePort("ssh")
	if !errors.Is(err, strconv.ErrSyntax) {
		t.Errorf("ParsePort(\"ssh\") error = %v, want it to wrap strconv.ErrSyntax", err)
	}
	var re *RangeError
	if errors.As(err, &re) {
		t.Error("ParsePort(\"ssh\") should not be a RangeError")
	}
}

func TestRangeErrorMessage(t *testing.T) {
	err := &RangeError{Value: 70000}
	want := "port 70000 out of range 1-65535"
	if err.Error() != want {
		t.Errorf("Error() = %q, want %q", err.Error(), want)
	}
}
