# Download the Ubuntu image for the Kubernetes VMs.
resource "proxmox_download_file" "ubuntu_noble" {
  content_type = "import"
  datastore_id = var.proxmox_iso_datastore
  node_name    = var.proxmox_node

  url       = "https://cloud-images.ubuntu.com/noble/current/noble-server-cloudimg-amd64.img"
  file_name = "noble-server-cloudimg-amd64.qcow2"

  overwrite = false
}

locals {
  # Upload a new ISO when its contents change.
  kairos_iso_name = "trapp-os-v3.6.0-k3s-v1.33.5-${substr(filesha256(var.kairos_iso_source), 0, 8)}.iso"
}

# Upload the local Kairos ISO to Proxmox.
resource "proxmox_virtual_environment_file" "kairos_iso" {
  content_type = "iso"
  datastore_id = var.proxmox_iso_datastore
  node_name    = var.proxmox_node

  overwrite = false

  source_file {
    path      = var.kairos_iso_source
    file_name = local.kairos_iso_name
  }
}

# Create the Kairos control plane with the install ISO.
resource "proxmox_virtual_environment_vm" "kairos_cp" {
  name        = "kairos-cp"
  description = "Kairos control-plane node (trapp-os lab)"
  tags        = ["kairos", "lab", "control-plane"]

  node_name = var.proxmox_node
  vm_id     = 210

  bios    = "ovmf"
  machine = "q35"

  operating_system {
    type = "l26"
  }

  cpu {
    cores = 2
    type  = "host"
  }

  memory {
    dedicated = 4096
  }

  efi_disk {
    datastore_id = var.proxmox_vm_datastore
    type         = "4m"
  }

  disk {
    datastore_id = var.proxmox_vm_datastore
    interface    = "scsi0"
    size         = 40
    discard      = "on"
    iothread     = true
  }

  scsi_hardware = "virtio-scsi-single"

  cdrom {
    file_id = proxmox_virtual_environment_file.kairos_iso.id
  }

  # Boot from disk first to avoid reinstalling.
  boot_order = ["scsi0", "ide3"]

  network_device {
    bridge = var.proxmox_bridge
  }

  started         = true
  stop_on_destroy = true
  on_boot         = false
}

# Keep the first agent off until its install ISO is ready.
resource "proxmox_virtual_environment_vm" "kairos_agent_01" {
  name        = "kairos-agent-01"
  description = "Kairos agent node (trapp-os lab)"
  tags        = ["kairos", "lab", "agent"]

  node_name = var.proxmox_node
  vm_id     = 211

  bios    = "ovmf"
  machine = "q35"

  operating_system {
    type = "l26"
  }

  cpu {
    cores = 2
    type  = "host"
  }

  memory {
    dedicated = 4096
  }

  efi_disk {
    datastore_id = var.proxmox_vm_datastore
    type         = "4m"
  }

  disk {
    datastore_id = var.proxmox_vm_datastore
    interface    = "scsi0"
    size         = 40
    discard      = "on"
    iothread     = true
  }

  scsi_hardware = "virtio-scsi-single"

  boot_order = ["scsi0"]

  network_device {
    bridge = var.proxmox_bridge
  }

  started         = false
  stop_on_destroy = true
  on_boot         = false
}

# Keep the second agent off until its install ISO is ready.
resource "proxmox_virtual_environment_vm" "kairos_agent_02" {
  name        = "kairos-agent-02"
  description = "Kairos agent node (trapp-os lab)"
  tags        = ["kairos", "lab", "agent"]

  node_name = var.proxmox_node
  vm_id     = 212

  bios    = "ovmf"
  machine = "q35"

  operating_system {
    type = "l26"
  }

  cpu {
    cores = 2
    type  = "host"
  }

  memory {
    dedicated = 4096
  }

  efi_disk {
    datastore_id = var.proxmox_vm_datastore
    type         = "4m"
  }

  disk {
    datastore_id = var.proxmox_vm_datastore
    interface    = "scsi0"
    size         = 40
    discard      = "on"
    iothread     = true
  }

  scsi_hardware = "virtio-scsi-single"

  boot_order = ["scsi0"]

  network_device {
    bridge = var.proxmox_bridge
  }

  started         = false
  stop_on_destroy = true
  on_boot         = false
}

# Create the Ubuntu VM for the Kubernetes control plane.
resource "proxmox_virtual_environment_vm" "k8s_cp_01" {
  name        = "k8s-cp-01"
  description = "Kubernetes control-plane, built from the Ubuntu cloud image"
  tags        = ["lab", "kubernetes", "control-plane"]

  node_name = var.proxmox_node
  vm_id     = 100

  operating_system {
    type = "l26"
  }

  cpu {
    cores = 2
    type  = "x86-64-v2-AES"
  }

  memory {
    dedicated = 4096
  }

  disk {
    datastore_id = var.proxmox_vm_datastore
    import_from  = proxmox_download_file.ubuntu_noble.id
    interface    = "scsi0"
    size         = 50
    discard      = "on"
    iothread     = true
  }

  scsi_hardware = "virtio-scsi-single"

  initialization {
    datastore_id = var.proxmox_vm_datastore

    ip_config {
      ipv4 {
        address = "dhcp"
      }
    }

    user_account {
      username = "trapp"

      keys = [
        trimspace(file(pathexpand("~/.ssh/github_ed25519.pub")))
      ]
    }
  }

  network_device {
    bridge   = var.proxmox_bridge
    firewall = true
  }

  started         = true
  stop_on_destroy = true
}

# Create the Ubuntu VM for the Kubernetes worker.
resource "proxmox_virtual_environment_vm" "k8s_worker_01" {
  name        = "k8s-worker-01"
  description = "Kubernetes worker, built from the Ubuntu cloud image"
  tags        = ["lab", "kubernetes", "worker"]

  node_name = var.proxmox_node
  vm_id     = 104

  operating_system {
    type = "l26"
  }

  cpu {
    cores = 2
    type  = "x86-64-v2-AES"
  }

  memory {
    dedicated = 4096
  }

  disk {
    datastore_id = var.proxmox_vm_datastore
    import_from  = proxmox_download_file.ubuntu_noble.id
    interface    = "scsi0"
    size         = 50
    discard      = "on"
    iothread     = true
  }

  scsi_hardware = "virtio-scsi-single"

  initialization {
    datastore_id = var.proxmox_vm_datastore

    ip_config {
      ipv4 {
        address = "dhcp"
      }
    }

    user_account {
      username = "trapp"

      keys = [
        trimspace(file(pathexpand("~/.ssh/github_ed25519.pub")))
      ]
    }
  }

  network_device {
    bridge   = var.proxmox_bridge
    firewall = true
  }

  started         = true
  stop_on_destroy = true
}

# Imported VM; this is where I run Terraform.
resource "proxmox_virtual_environment_vm" "trapp_cp" {
  name        = "trapp-cp"
  description = "Control station and jump host, runs Terraform, Docker and the lab SSH keys"
  tags        = ["lab", "control", "jump-host"]

  node_name = var.proxmox_node
  vm_id     = 101

  operating_system {
    type = "l26"
  }

  cpu {
    cores   = 4
    sockets = 1
    type    = "x86-64-v2-AES"
  }

  memory {
    dedicated = 8192
  }

  disk {
    datastore_id = "local-lvm"
    interface    = "scsi0"
    size         = 150
    iothread     = false
  }

  scsi_hardware = "virtio-scsi-pci"

  cdrom {
    file_id   = "local:iso/ubuntu-24.04.2-live-server-amd64.iso"
    interface = "ide2"
  }

  boot_order = ["scsi0", "ide2", "net0"]

  network_device {
    bridge      = var.proxmox_bridge
    mac_address = "BC:24:11:81:17:8C"
    firewall    = false
  }

  agent {
    enabled = true
  }

  started             = true
  on_boot             = false
  reboot_after_update = false

  lifecycle {
    prevent_destroy = true
  }
}

# Manage the existing Talos control plane VM.
resource "proxmox_virtual_environment_vm" "talos_cp_01" {
  name        = "talos-cp-01"
  description = "Talos control plane (earlier immutable-OS experiment)"
  tags        = ["lab", "talos", "control-plane"]

  node_name = var.proxmox_node
  vm_id     = 102

  operating_system {
    type = "l26"
  }

  cpu {
    cores   = 1
    sockets = 1
    type    = "x86-64-v2-AES"
  }

  memory {
    dedicated = 2048
  }

  disk {
    datastore_id = "local"
    interface    = "scsi0"
    size         = 50
    file_format  = "qcow2"
    iothread     = true
  }

  scsi_hardware = "virtio-scsi-single"

  cdrom {
    file_id   = "local:iso/metal-amd64.iso"
    interface = "ide2"
  }

  boot_order = ["scsi0", "ide2", "net0"]

  network_device {
    bridge      = var.proxmox_bridge
    mac_address = "BC:24:11:8A:15:99"
    firewall    = false
  }

  started             = false
  on_boot             = false
  reboot_after_update = false

  lifecycle {
    prevent_destroy = true
  }
}

# Manage the existing Talos worker VM.
resource "proxmox_virtual_environment_vm" "talos_worker_01" {
  name        = "talos-worker-01"
  description = "Talos worker (earlier immutable-OS experiment)"
  tags        = ["lab", "talos", "worker"]

  node_name = var.proxmox_node
  vm_id     = 103

  operating_system {
    type = "l26"
  }

  cpu {
    cores   = 1
    sockets = 2
    type    = "x86-64-v2-AES"
  }

  memory {
    dedicated = 2048
  }

  disk {
    datastore_id = "local"
    interface    = "scsi0"
    size         = 50
    file_format  = "qcow2"
    iothread     = true
  }

  scsi_hardware = "virtio-scsi-single"

  cdrom {
    file_id   = "local:iso/metal-amd64.iso"
    interface = "ide2"
  }

  boot_order = ["scsi0", "ide2", "net0"]

  network_device {
    bridge      = var.proxmox_bridge
    mac_address = "BC:24:11:15:17:DD"
    firewall    = true
  }

  started             = false
  on_boot             = false
  reboot_after_update = false

  lifecycle {
    prevent_destroy = true
  }
}

# Manage the existing Mender VM.
resource "proxmox_virtual_environment_vm" "mender_cp" {
  name        = "mender-cp"
  description = "Mender control plane (device-management experiment)"
  tags        = ["lab", "mender"]

  node_name = var.proxmox_node
  vm_id     = 105

  operating_system {
    type = "l26"
  }

  cpu {
    cores   = 2
    sockets = 2
    type    = "x86-64-v2"
  }

  memory {
    dedicated = 8192
  }

  disk {
    datastore_id = "local-lvm"
    interface    = "scsi0"
    size         = 50
    iothread     = true
  }

  scsi_hardware = "virtio-scsi-single"

  cdrom {
    file_id   = "local:iso/ubuntu-24.04.2-live-server-amd64.iso"
    interface = "ide2"
  }

  boot_order = ["scsi0", "ide2", "net0"]

  network_device {
    bridge      = var.proxmox_bridge
    mac_address = "BC:24:11:F2:DD:AC"
    firewall    = true
  }

  started             = false
  on_boot             = false
  reboot_after_update = false

  lifecycle {
    prevent_destroy = true
  }
}
