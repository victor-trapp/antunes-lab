output "proxmox_version" {
  value = data.proxmox_version.current.version
}

output "proxmox_nodes" {
  value = {
    names     = data.proxmox_virtual_environment_nodes.available.names
    cpu_count = data.proxmox_virtual_environment_nodes.available.cpu_count
    online    = data.proxmox_virtual_environment_nodes.available.online
  }
}