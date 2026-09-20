# Read the Proxmox version.
data "proxmox_version" "current" {}

# Read the available hosts and their status.
data "proxmox_virtual_environment_nodes" "available" {}
