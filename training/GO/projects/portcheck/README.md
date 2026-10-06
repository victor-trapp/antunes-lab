# portcheck

A small CLI that checks if TCP ports are open on a list of hosts, all at the same
time. It's the same thing Beszel's TCP monitors do, and it uses most of what's in
`exercices-02`: errors, goroutines, a limit on how many run at once, context
timeouts, and table output.

```bash
go run ./projects/portcheck/ 192.168.0.1:53 192.168.0.120:8090 192.168.0.184:45876
```

```
ADDRESS               STATUS  LATENCY
192.168.0.1:53        open    1.2ms
192.168.0.120:8090    open    0.4ms
192.168.0.184:45876   closed  connection refused
```

It exits with 1 if anything is closed, so it can go in a script.

## What to build

`check.go` has the two functions the tests cover:

- **`Check`** dials one address with `net.Dialer.DialContext` and gives up after
  `timeout`. It fills in a `Result`: open or not, how long the connect took, and
  the error if it failed. Close the connection straight away, we only care that
  it opened.
- **`CheckAll`** runs `Check` for every address, at most `workers` at a time,
  and returns the results in the same order as the addresses. A buffered
  channel of size `workers` works as the limit: send into it before starting a
  check, read from it when one finishes. Call the `check` variable, not `Check`,
  because the test swaps it for a slow fake to count how many run at once.

Then `main.go`:

1. Flags for `-workers` (default 10) and `-timeout` (default 2s) with the `flag` package
2. Addresses from the command line, or one per line from stdin if there are none
3. A table with `text/tabwriter`
4. `os.Exit(1)` if anything is closed

## Checking it

```bash
go test ./projects/portcheck/
go test -race ./projects/portcheck/
```

The tests open a real port on `127.0.0.1` and point `Check` at it, plus one
that's closed, so they don't need the network.

## If I want more

- `-json` to print the results as JSON (exercise 09)
- read a list of hosts from the `ParseInventory` format in exercise 09
- `-watch 30s` to keep checking on a loop, like a tiny Beszel
