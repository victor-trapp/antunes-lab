package main

import (
	"context"
	"errors"
	"testing"
	"time"
)

func TestWaitFinishes(t *testing.T) {
	if err := Wait(context.Background(), 10*time.Millisecond); err != nil {
		t.Errorf("Wait with no deadline = %v, want nil", err)
	}
}

func TestWaitGivesUp(t *testing.T) {
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Millisecond)
	defer cancel()

	start := time.Now()
	err := Wait(ctx, time.Second)
	if !errors.Is(err, context.DeadlineExceeded) {
		t.Errorf("Wait past the deadline = %v, want context.DeadlineExceeded", err)
	}
	if took := time.Since(start); took > 500*time.Millisecond {
		t.Errorf("Wait took %v, it should give up at the 20ms deadline", took)
	}
}

func TestWaitCancelled(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	cancel()
	if err := Wait(ctx, time.Second); !errors.Is(err, context.Canceled) {
		t.Errorf("Wait on a cancelled context = %v, want context.Canceled", err)
	}
}

func TestFetchFast(t *testing.T) {
	got, err := Fetch(context.Background(), func() int { return 42 })
	if err != nil || got != 42 {
		t.Errorf("Fetch = %d, %v, want 42, nil", got, err)
	}
}

func TestFetchSlow(t *testing.T) {
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Millisecond)
	defer cancel()

	start := time.Now()
	got, err := Fetch(ctx, func() int {
		time.Sleep(time.Second)
		return 42
	})
	if !errors.Is(err, context.DeadlineExceeded) || got != 0 {
		t.Errorf("Fetch past the deadline = %d, %v, want 0, context.DeadlineExceeded", got, err)
	}
	if took := time.Since(start); took > 500*time.Millisecond {
		t.Errorf("Fetch took %v, it should give up at the 20ms deadline", took)
	}
}
