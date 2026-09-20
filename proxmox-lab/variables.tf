variable "proxmox_endpoint" {
  description = "HTTPS endpoint for the Proxmox API"
  type        = string
}

variable "proxmox_insecure" {
  description = "Skip TLS certificate verification in the lab"
  type        = bool
  default     = true
}

variable "proxmox_node" {
  description = "Proxmox node that hosts the lab VMs"
  type        = string
  default     = "TrappLab"
}

variable "proxmox_vm_datastore" {
  description = "Datastore for VM disks and EFI vars disks"
  type        = string
  default     = "local-lvm"
}

variable "proxmox_iso_datastore" {
  description = "Datastore holding ISO images (content type 'iso')"
  type        = string
  default     = "local"
}

variable "proxmox_bridge" {
  description = "Network bridge the lab VMs attach to"
  type        = string
  default     = "vmbr0"
}

variable "kairos_iso_source" {
  description = "Local path to the AuroraBoot-built Kairos ISO, uploaded to Proxmox on apply"
  type        = string
  default     = "../experiments/kairos/artifacts/kairos-ubuntu-24.04-standard-amd64-generic-v3.6.0-k3sv1.33.5+k3s1.iso"

  validation {
    condition     = fileexists(var.kairos_iso_source)
    error_message = "Kairos ISO not found at ${var.kairos_iso_source}. Build it first: cd ../experiments/kairos && ./build.sh. If a rebuild is running, wait for it to finish."
  }
}
