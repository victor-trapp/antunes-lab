# proxmox-lab

Everything that runs on my Proxmox host. Terraform makes the VMs, Ansible sets
up what runs on them.

```
proxmox-lab/
├── terraform/   the VMs
└── ansible/     playbooks, run from ansible-cp
```

## Terraform

Terraform owns ten machines, in two groups.

**Built by Terraform.** The Kairos cluster (`kairos-cp`, `kairos-agent-01`,
`kairos-agent-02`) installs from the ISO built in `../experiments/kairos/`. The
Kubernetes pair (`k8s-cp-01`, `k8s-worker-01`) comes from the Ubuntu cloud
image. Destroy one, apply, and I get it back.

`ansible-cp`, my Ansible control node, is the odd one out. Terraform makes the
VM, but I installed Ubuntu on it by hand from the ISO, so getting it back means
doing the install again.

**Adopted.** `trapp-cp` (my control station), `talos-cp-01`, `talos-worker-01`
and `mender-cp` were built by hand and imported later. Terraform can describe
them and tell me if something drifts, but it cannot rebuild them, because what
matters about them is on the disk. They all have `prevent_destroy` on them.

Everything is in one root module and one state file. That is fine for a lab
with one person, but it does mean a careless `destroy` takes all of it.

Every command in this section runs from inside `terraform/`.

### Before running anything

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

**The Kairos ISO on the datastore** if you are touching the Kairos cluster.
Terraform does not upload it any more, it expects the file to already be there
under the name in `trapp_os_iso_file`.

### Running it

```bash
cd terraform
source .proxmox-env
terraform plan -out tfplan
terraform apply tfplan
```

Read the plan first. It is the only review step there is.

Do not commit `tfplan`, it is binary and can hold resolved secrets. It is
gitignored.

### The files

| File | What is in it |
|---|---|
| `versions.tf` | Terraform and provider versions |
| `provider.tf` | provider config, no credentials |
| `variables.tf` | host, datastores, bridge, ISO names |
| `data.tf` | info about the Proxmox host |
| `main.tf` | every VM, one block each |
| `backend.tf` | where state lives |
| `outputs.tf` | what comes back after an apply |

`main.tf` is one block per machine instead of a `for_each` over a map. That
makes it long, about 575 lines, and changing something shared like the bridge
means ten edits. I did it that way because I can read a whole machine in one
place without jumping around, which matters more to me right now. If this ever
grows past twenty VMs the map version is probably better.

One thing that caught me out: Terraform keys state on the resource address, so
renaming `cp_01` to `kairos_cp` looks like "destroy one machine, build another"
unless you add a `moved` block first. Add it, apply, then delete it.

### The Kairos cluster

`main.tf` defines the three Kairos VMs and points the control plane's CD drive
at the ISO on the datastore. Adding another node means copying a block and
changing the name, VM ID and tags.

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

## Ansible

Right now Ansible does one job: it puts the Beszel hub on `ansible-cp` so I can
see every machine on the network from one page. I run it on `ansible-cp`
itself, so the playbook targets localhost and there is no inventory yet.

```bash
cd ansible
ansible-galaxy collection install -r requirements.yml
ansible-playbook beszel-hub.yml -K
```

| File | What is in it |
|---|---|
| `requirements.yml` | the `community.beszel` collection |
| `beszel-hub.yml` | installs the hub as a systemd service, version pinned |

The hub is at `http://192.168.0.120:8090`. I add machines from the web UI, not
from Ansible. Add System gives me an install command with the key and token
already in it, I run that on the machine and it shows up. The agent listens on
45876, so that port has to be open to the hub.

Network monitors live in the same UI. The agents run ping, TCP, HTTP or DNS
checks against a target, which is how I watch the router and anything else that
can't run an agent.

Two things that caught me out:

- **Brew on the Mac.** The install fails halfway because the tap isn't trusted,
  but the script still prints the "check status" lines like it worked. Run
  `brew trust henrygd/beszel` first.
- **ICMP monitors on locked down boxes.** If normal users can't ping on that
  machine, the agent can't either, and the monitor shows 100% loss even when
  the target is fine. A TCP monitor works there.

## Notes to self

**Terraform doesn't manage the Kairos ISO any more.** It used to upload it from
`../experiments/kairos/artifacts/` and hash the file on every plan, which was a
1.2 GB read and only worked on a machine that had the build. Now I upload the
ISO by hand and `trapp_os_iso_file` names it. After a rebuild, upload the new
file and bump that variable. The `removed` block at the top of `main.tf`
dropped the old upload from state without deleting it in Proxmox.

**Old ISOs pile up.** The filename has a content hash in it, so every rebuild
is a new file and the old one stays on the datastore. Clear them out now and
then.

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
