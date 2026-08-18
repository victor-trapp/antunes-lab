variable "proxmox_endpoint" {
  description = "HTTPS endpoint for the Proxmox API"
  type        = string
}

variable "proxmox_insecure" {
  description = "Skip TLS certificate verification in the lab"
  type        = bool
  default     = true
}