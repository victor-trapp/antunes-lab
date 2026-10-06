# Antunes Lab

Welcome to my home lab repository.

This repo is where I document, build, and test ideas around Linux, Kubernetes, edge platforms, automation, Go, and platform engineering.

The main purpose of this lab is to help me move deeper into Platform Engineering by building things hands-on.

## About me

I currently come from a Linux and technical support background, working with real Linux-based systems, services, networking, logs, and production-style troubleshooting.

My goal is to keep building on that foundation and move to Platform Engineering.


This repository is my place to practise and learn skills in a structured way.

## Why this repo exists

I created this repo to document my home lab journey and keep all my platform engineering learning in one place.

The focus is not just to install tools randomly. The goal is to understand how the pieces fit together in a real platform:

I want to understand how modern edge platforms are built, operated, updated, monitored, and recovered when things go wrong.

## Current focus

At the moment, I am focusing on:

- Talos Linux
- Kubernetes
- Running workloads on a Kubernetes cluster
- Building a small Go API
- Containerising the Go app
- Deploying the app using Kubernetes manifests
- Understanding health and readiness probes
- Building a clean home lab structure
- Learning how immutable OS concepts fit into edge platforms

## Current lab architecture

The current lab is running on Proxmox.

```text
Proxmox Home Lab
  ↓
Talos Linux VMs
  ↓
Kubernetes Cluster
  ↓
Go API Workload
```

The Talos lab currently includes:

```text
Talos control plane
Talos worker node
Kubernetes running across the cluster
Container workloads deployed into Kubernetes
```

Talos is being used here to understand immutable Kubernetes node management, where the node is not treated like a normal SSH-managed Linux server.

## Training

The `training/` folder is where I do raw language practice before applying things in the lab.

It's all Go now, the TypeScript is gone.

- `exercices-01`: variables, control flow, functions, slices, maps, structs, pointers, interfaces, and error handling
- `exercices-02`: methods, strings and runes, custom errors, generics, goroutines, channels, select and context, mutexes, JSON, and an HTTP health check. Each one comes with tests, so I know when I've got it right
- `projects/portcheck`: a small CLI that checks TCP ports on a list of hosts at the same time, using most of what's in `exercices-02`
- `go-in-one-evening`: the Three Dots Labs course
- `quii`: where I started on Learn Go with Tests
- Some early JavaScript notes

Everything in `exercices-02` and `projects` starts out failing. I fill in the code until the tests pass. From `training/GO`:

```bash
go test ./exercices-02/01-methods/
go test -race ./exercices-02/...
```

The idea is to keep language fundamentals separate from the lab itself. When I am learning a concept in Go I put it here, so the main lab folders stay focused on the platform work.

## What I want to learn from this repo

This repo is designed to help me build confidence with:

- Linux platform fundamentals
- Kubernetes at the edge
- immutable OS concepts
- Go services and tools
- containerisation
- health checks and probes
- observability
- GitOps
- Helm
- diagnostics
- automation
- platform documentation

## Future plans

Planned next steps:

- deploy `edge-status-api` into the Talos Kubernetes cluster
- add a container build workflow
- add Kubernetes manifests for the Go app
- add a Helm chart for the app
- test a simple GitOps workflow
- build a Debian + k0s lab
- create a Go CLI called `edgecheck`
- add diagnostics scripts
- add Prometheus/Grafana for monitoring purpose
- experiment Mender update/artifact concepts

## Long-term goal

The long-term goal of this repo is to become a practical learning space for edge platform engineering.

I want to understand how to build and operate systems that are:

- reliable
- secure
- observable
- repeatable
- easy to update
- easy to troubleshoot
- useful for developers building on top of the platform

This repo is part of that journey.
