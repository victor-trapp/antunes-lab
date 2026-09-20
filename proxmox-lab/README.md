# proxmox-lab

Terraform for every VM on my Proxmox host. Nine machines, in two groups.

**Built by Terraform.** The Kairos cluster (`kairos-cp`, `kairos-agent-01`,
`kairos-agent-02`) installs from the ISO built in `../experiments/kairos/`. The
Kubernetes pair (`k8s-cp-01`, `k8s-worker-01`) comes from the Ubuntu cloud
image. Destroy one, apply, and I get it back.

**Adopted.** `trapp-cp` (my control station), `talos-cp-01`, `talos-worker-01`
and `mender-cp` were built by hand and imported later. Terraform can describe
them and tell me if something drifts, but it cannot rebuild them, because what
matters about them is on the disk. They all have `prevent_destroy` on them.

Everything is in one root module and one state file. That is fine for a lab
with one person, but it does mean a careless `destroy` takes all of it.

## Before running anything

**A Proxmox API token.** It goes in the environment, never in a `.tf` file.

```bash
cp .proxmox-env.example .proxmox-env
source .proxmox-env
```

To make one: Proxmox web UI, Datacenter, Permissions, API Tokens, Add. User
`root@pam`, token id `terraform`, Privilege Separation unchecked. The secret is
shown once. `.proxmox-env` is gitignored.

**The endpoint.** `terraform.tfvars` has the Proxmox address, copy
`terraform.tfvars.example` if you need one.

**Azure login**, because the state lives there. `az login`.

**A built ISO** if you are touching the Kairos cluster. Terraform checks and
tells you to go build one if it is missing.

## Running it

```bash
source .proxmox-env
terraform plan -out tfplan
terraform apply tfplan
```

Read the plan first. It is the only review step there is.

Do not commit `tfplan`, it is binary and can hold resolved secrets. It is
gitignored.

## The files

| File | What is in it |
|---|---|
| `versions.tf` | Terraform and provider versions |
| `provider.tf` | provider config, no credentials |
| `variables.tf` | host, datastores, bridge, path to the Kairos ISO |
| `data.tf` | info about the Proxmox host |
| `main.tf` | every VM, one block each |
| `backend.tf` | where state lives |
| `outputs.tf` | what comes back after an apply |

`main.tf` is one block per machine instead of a `for_each` over a map. That
makes it long, about 550 lines, and changing something shared like the bridge
means nine edits. I did it that way because I can read a whole machine in one
place without jumping around, which matters more to me right now. If this ever
grows past twenty VMs the map version is probably better.

One thing that caught me out: Terraform keys state on the resource address, so
renaming `cp_01` to `kairos_cp` looks like "destroy one machine, build another"
unless you add a `moved` block first. Add it, apply, then delete it.

## The Kairos cluster

`main.tf` uploads the ISO and defines the three Kairos VMs. Adding another node
means copying a block and changing the name, VM ID and tags.

Two things matter:

1. **Disk first in the boot order, never the CD.** The ISO installs itself on
   boot, so CD first is an endless wipe and reinstall loop. An empty disk has
   no bootloader so the firmware falls through to the CD, installs once, and
   the disk wins every boot after that.
2. **Install media goes on one node at a time.** The ISO has a hostname and a
   k3s role baked into it, so an ISO built for `kairos-cp` must never be
   attached to an agent.

The agents are empty shells right now. Right hardware, clean disks, no media,
powered off. They stay that way until I write `agent.yaml` and build them their
own ISO.

The full story is in `../experiments/kairos/README.md`.

## Notes to self

**The ISO is tied to a local file path.** `variables.tf` points at
`../experiments/kairos/artifacts/`, and `main.tf` hashes the file so a rebuilt
ISO shows up as a real change instead of being silently skipped. That costs a
1.2 GB read on every plan and only works on a machine that has the file. If I
ever want to run this from CI I will need to publish the ISO somewhere and pass
a digest in as a variable instead.

**Old ISOs pile up.** The filename has a content hash in it, so every rebuild
uploads a new file and leaves the old one behind. Clear them out now and then.

**State is in Azure**, at `proxmox/terraform.tfstate`. The storage account is
built by `azure-platform-lab/infra`. Auth is Entra ID through `az login`, so
there is no storage key anywhere.

The backend takes a lease on the state file while it works, which is what stops
two applies running at once. If Terraform gets killed halfway it cannot release
that lease and the next command refuses with a lock error. Take the lock ID
from the error and:

```bash
terraform force-unlock <LOCK-ID>
```

Check nothing is actually running first. The lock says who took it and when.
