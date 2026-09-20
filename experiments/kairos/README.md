# trapp-os

A custom Kairos image that installs itself into a small k3s cluster without me
touching a keyboard.

Kairos is an immutable Linux for edge machines. The OS is a read only image,
and everything about a machine, its hostname, users and Kubernetes role, comes
from a cloud-config file baked into the install media. You describe the machine
you want, build an ISO, boot it, and the machine builds itself.

I wanted to try this because it is close to the edge pattern I see at work, and
because building my own branded OS sounded fun. This folder is the image build.
The VMs it installs onto are in `proxmox-lab/`.

There is a diagram in `architecture.excalidraw` if you prefer pictures.

## What it builds

A 1.2 GB ISO with Ubuntu 24.04, Kairos v3.6.0 and k3s v1.33.5, with three
things of my own in it:

- A boot menu that says trapp-os instead of Kairos
- An ASCII banner at login showing hostname, Kairos version, IP and k3s status
- A node config so it installs itself on first boot without asking

Boot it on an empty machine, leave it alone, and it comes back as a running k3s
control plane that survives reboots.

## What you need

Docker for the build, Terraform for the VMs, and a Proxmox host. I run
everything from `trapp-cp`, my Ubuntu control VM.

## Building and deploying

```bash
cd experiments/kairos
./build.sh

cd ../../proxmox-lab
az login
source .proxmox-env
terraform apply
```

Then open the VM console and let it boot the first menu entry. It wipes the
disk, installs, reboots, and comes up as `kairos-cp`.

For a different machine pass its config file: `./build.sh agent.yaml`. It looks
in `nodes/`.

## Layout

```
experiments/kairos/
├── build.sh                 builds the ISO
├── image/                   branding, same on every machine
│   ├── boot-menu.cfg
│   └── login-banner.sh
├── nodes/                   one file per machine
│   └── control-plane.yaml
└── artifacts/               build output, gitignored
```

The split is the image on one side and the machines on the other. Anything in
`image/` is the same everywhere. Anything in `nodes/` describes one specific
machine. When I add the agents they are two more files in `nodes/` and nothing
in `image/` changes.

| File | What it does | Where it lands |
|---|---|---|
| `nodes/control-plane.yaml` | hostname, users, SSH key, k3s role, install settings | `/config.yaml` on the ISO |
| `image/boot-menu.cfg` | the GRUB menu | `/boot/grub2/grub.cfg` on the ISO |
| `image/login-banner.sh` | the login banner | `/etc/profile.d/00-trapp-os-banner.sh` in the OS |

AuroraBoot expects those files in directory trees that mirror where they end
up, which meant six nested folders for two files. `build.sh` builds the trees
at build time instead and keeps the mapping in one readable block near the top.

## How a change reaches a machine

Edit a file, run `./build.sh`, run `terraform apply`, then reinstall the node.
All three customisations are applied at install time, so a machine that is
already running will not pick up a new banner until it is rebuilt.

To rebuild a node:

```bash
terraform apply -replace='proxmox_virtual_environment_vm.kairos_cp'
```

That destroys the VM and makes a new one with an empty disk. An empty disk has
no bootloader so the firmware falls through to the CD and installs once.

## Careful

The config has `install.auto: true`, so the first menu entry wipes the disk and
installs straight away with no prompt. Fine on a lab VM, not fine anywhere
else.

Never put the CD before the disk in the boot order. With an auto installing
image that is an endless wipe and reinstall loop. Disk first works because an
empty disk has no bootloader and the firmware falls through to the CD by
itself.

The second menu entry, `trapp-os (manual)`, has no `install-mode` and boots a
live session without touching the disk. That is the safe one if I just want to
look around, and the one to avoid when I actually wanted an install.

Before using this on a real machine, set `install.device` to a specific disk
instead of `auto`, and change the default menu entry so the destructive one is
not what happens after a ten second timeout.

## Why these versions

**Kairos v3.6.0 and not v3.7.2.** On v3.7.2 an installed node lost its identity
every reboot. Hostname reset to a random `kairos-xxxx`, k3s never started, and
`/var/lib/rancher` was not on persistent storage. It was an upstream bug, a
failed mount at boot meant all the persistent mounts were skipped while the
boot still reported success. v3.6.0 does not do this.

If containerd ever refuses to start with `"overlayfs" snapshotter cannot be
enabled`, do not fix it with `--snapshotter=fuse-overlayfs`. That is a symptom
of `/var/lib/rancher` not being on persistent storage and the flag just hides a
node that is losing its state.

**Baked config and not the web installer.** Installing through the Kairos web
UI did not write the config to the OEM partition properly, so nothing applied
on later boots.

**The image tag uses `-k3s-`** as in `...-v3.6.0-k3s-v1.33.5-k3s1`, not the
`-k3sv-` the docs show. Trust the registry.

## When things go wrong

**The node booted but never installed.** Check which menu entry it used. The
second one installs nothing. From inside the live session `cat /proc/cmdline`
tells you, there should be `install-mode` in there.

**The build fails with `invalid path`.** Docker on my machine is the snap
build and it cannot see `/tmp`. It mounts it empty instead of failing. Anything
docker reads has to be under `$HOME`, which is why `build.sh` stages into
`artifacts/staging/`. Quick check:

```bash
t=$(mktemp -d); touch $t/x; docker run --rm -v $t:/p alpine ls /p
```

An empty listing means confinement, not a missing file.

**A change to the banner did not show up.** It only applies at install time,
and it lives inside the compressed image where you cannot see it from an ISO
listing. `build.sh` checks it on every build, so if that passed the node just
needs reinstalling.

**Something I changed on a node disappeared after a reboot.** Only `/oem`,
`/usr/local`, `/home` and declared mounts survive. `/etc` is an overlay on
tmpfs. Persistent changes belong in the node config, which is applied on every
boot.

**Terraform cannot find the ISO.** I have not built one, or a build is still
running.

## Next

1. Brand the installed system's boot menu too, not just the ISO. This has to be
   done from the real `/etc/kairos/branding/grubmenu.cfg` on a working node, a
   made up version with wrong paths gives an unbootable machine.
2. Static IP for the control plane, with k3s `--tls-san` and `--node-ip` set to
   match.
3. Bring up the agent nodes with their own config.
4. Deploy something on it. On an immutable OS stateful data has to live under a
   persistent path or it is gone on reboot.
5. Network boot instead of a CD, using AuroraBoot's server mode.
6. A USB stick to install this on a real laptop. Firmware, secure boot and disk
   detection are all different on real hardware.
