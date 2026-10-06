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

variable "trapp_os_iso_file" {
  description = "trapp-os (Kairos) ISO already present on the Proxmox ISO datastore"
  type        = string
  default     = "trapp-os-v3.6.0-k3s-v1.33.5-92e4a0a6.iso"
}

variable "ubuntu_iso_source" {
  description = "Local path to the ubuntu ISO, uploaded to Proxmox on apply"
  type        = string
  default     = "ubuntu-24.04.2-live-server-amd64.iso"
}

