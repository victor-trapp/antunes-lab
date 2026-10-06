# Run az login to access the state in Azure.
terraform {
  backend "azurerm" {
    resource_group_name  = "rg-terraform-state"
    storage_account_name = "trappstorageazure"
    container_name       = "tfstate"
    key                  = "proxmox/terraform.tfstate"
    use_azuread_auth     = true
  }
}
