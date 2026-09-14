variable "location" {
  description = "Azure region where resources will be created"
  type        = string
  default     = "uksouth"
}

variable "resource_group_name" {
  description = "Name of the terraform state resource group"
  type        = string
  default     = "rg-terraform-state"
}

variable "storage_account_name" {
  description = "Unique name for the terraform state storage"
  type        = string
}

variable "container_name" {
  description = "Blob container used to store terraform state"
  type        = string
  default     = "tfstate"
}