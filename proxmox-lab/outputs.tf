# Show the Proxmox version.
output "proxmox_version" {
  value = data.proxmox_version.current.version
}

# Show host names, CPU counts and online status.
output "proxmox_nodes" {
  value = {
    names     = data.proxmox_virtual_environment_nodes.available.names
    cpu_count = data.proxmox_virtual_environment_nodes.available.cpu_count
    online    = data.proxmox_virtual_environment_nodes.available.online
  }
}
# Show where the ISO is stored in Proxmox.
output "kairos_iso" {
  description = "Volume ID of the Kairos ISO uploaded to Proxmox"
  value       = proxmox_virtual_environment_file.kairos_iso.id
}

# List the VMs and whether Terraform can rebuild them.
output "vms" {
  description = "Every VM in this lab and whether Terraform can rebuild it"
  value = {
    "kairos-cp" = {
      vm_id   = proxmox_virtual_environment_vm.kairos_cp.vm_id
      purpose = "Kairos control plane"
      managed = "built"
      rebuild = "yes - from the trapp-os ISO"
    }
    "kairos-agent-01" = {
      vm_id   = proxmox_virtual_environment_vm.kairos_agent_01.vm_id
      purpose = "Kairos agent (empty shell)"
      managed = "built"
      rebuild = "yes - from the trapp-os ISO"
    }
    "kairos-agent-02" = {
      vm_id   = proxmox_virtual_environment_vm.kairos_agent_02.vm_id
      purpose = "Kairos agent (empty shell)"
      managed = "built"
      rebuild = "yes - from the trapp-os ISO"
    }
    "k8s-cp-01" = {
      vm_id   = proxmox_virtual_environment_vm.k8s_cp_01.vm_id
      purpose = "Kubernetes control plane"
      managed = "built"
      rebuild = "yes - from the Ubuntu cloud image"
    }
    "k8s-worker-01" = {
      vm_id   = proxmox_virtual_environment_vm.k8s_worker_01.vm_id
      purpose = "Kubernetes worker"
      managed = "built"
      rebuild = "yes - from the Ubuntu cloud image"
    }
    "trapp-cp" = {
      vm_id   = proxmox_virtual_environment_vm.trapp_cp.vm_id
      purpose = "Control station and jump host"
      managed = "adopted"
      rebuild = "NO - hand-built, the value is on the disk"
    }
    "talos-cp-01" = {
      vm_id   = proxmox_virtual_environment_vm.talos_cp_01.vm_id
      purpose = "Talos control plane (earlier experiment)"
      managed = "adopted"
      rebuild = "NO - hand-built, the value is on the disk"
    }
    "talos-worker-01" = {
      vm_id   = proxmox_virtual_environment_vm.talos_worker_01.vm_id
      purpose = "Talos worker (earlier experiment)"
      managed = "adopted"
      rebuild = "NO - hand-built, the value is on the disk"
    }
    "mender-cp" = {
      vm_id   = proxmox_virtual_environment_vm.mender_cp.vm_id
      purpose = "Mender control plane (device-management experiment)"
      managed = "adopted"
      rebuild = "NO - hand-built, the value is on the disk"
    }
  }
}
