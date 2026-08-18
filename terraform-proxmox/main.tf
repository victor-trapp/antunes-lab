data "proxmox_version" "current" {}

data "proxmox_virtual_environment_nodes" "available" {}


resource "proxmox_download_file" "ubuntu_noble" {
  content_type = "import"
  datastore_id = "local"
  node_name    = "TrappLab"

  url       = "https://cloud-images.ubuntu.com/noble/current/noble-server-cloudimg-amd64.img"
  file_name = "noble-server-cloudimg-amd64.qcow2"

  overwrite = false
}


resource "proxmox_virtual_environment_vm" "tf_test" {
  name        = "tf-ubuntu-01"
  description = "Terraform study VM"

  node_name = "TrappLab"
  vm_id     = 200

  cpu {
    cores = 2
  }

  memory {
    dedicated = 2048
  }

  disk {
    datastore_id = "local-lvm"
    import_from  = proxmox_download_file.ubuntu_noble.id
    interface    = "virtio0"
    iothread     = true
    discard      = "on"
    size         = 20
  }

  initialization {
    datastore_id = "local-lvm"

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
    bridge = "vmbr0"
  }

  started         = true
  stop_on_destroy = true
}