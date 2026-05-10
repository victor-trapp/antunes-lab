# Talos Notes

Notes I keep as I work with Talos Linux. Things that caught me out or that I want to remember.

## What makes Talos different

You cannot SSH into a Talos node. There is no shell. All management is done through `talosctl` using the machine config API.

This feels strange at first if you are used to managing Linux servers over SSH, but it makes sense once you understand the idea: the OS is just a layer to run Kubernetes. You do not need to log into it.

## Key commands

```bash
# check node health
talosctl health --nodes <node-ip>

# see running services on a node
talosctl services --nodes <node-ip>

# read kernel logs
talosctl dmesg --nodes <node-ip>

# read container logs from a node
talosctl logs -n <node-ip> kubelet

# apply a config update
talosctl apply-config --nodes <node-ip> --file controlplane.yaml

# get the kubeconfig after bootstrapping
talosctl kubeconfig --nodes <node-ip>
```

## Setting up a new cluster

1. Download the Talos ISO from the official site
2. Boot the ISO in a Proxmox VM — do not install anything, just boot it
3. Note the IP the node gets from DHCP
4. Generate machine configs:

```bash
talosctl gen config <cluster-name> https://<control-plane-ip>:6443
```

This creates `controlplane.yaml`, `worker.yaml`, and `talosconfig`.

5. Apply the control plane config:

```bash
talosctl apply-config --insecure --nodes <control-plane-ip> --file controlplane.yaml
```

6. Apply the worker config:

```bash
talosctl apply-config --insecure --nodes <worker-ip> --file worker.yaml
```

7. Bootstrap etcd:

```bash
talosctl bootstrap --nodes <control-plane-ip>
```

8. Download the kubeconfig:

```bash
talosctl kubeconfig --nodes <control-plane-ip>
```

9. Check the cluster:

```bash
kubectl get nodes
```

## The talosconfig file

`talosconfig` is the config file for the `talosctl` CLI. It tells `talosctl` where to find your nodes and how to authenticate.

```bash
export TALOSCONFIG=./talosconfig
```

Or merge it into `~/.talos/config`:

```bash
talosctl config merge ./talosconfig
```

## Things that caught me out

- Talos nodes boot into maintenance mode before you apply a config. You can apply configs while in maintenance mode using `--insecure`
- After bootstrapping you need to wait a couple of minutes for the API server and etcd to come up
- The node IP can change if you do not set a static IP or a DHCP reservation — set one early
- `kubectl get nodes` will show the nodes as NotReady for a while after bootstrap, this is normal while the CNI comes up

## Things I want to understand better

- how the machine config schema works in detail
- how to handle upgrades through talosctl
- how to add extra nodes to an existing cluster
- how Talos handles disk and partition layout
- what machineconfig patches are and when to use them
