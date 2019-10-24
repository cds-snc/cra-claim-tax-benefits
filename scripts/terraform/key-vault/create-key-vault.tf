variable "location" {
  description = "The Azure location where this resource should be created"
  type        = "string"
  default     = "canada central"
}

variable "resource_group_name" {
  description = "The Azure resource group where this should be created"
  type        = "string"
  default     = "cdscracollab-innovation-rg"
}

variable "azure_key_vault_name" {
  description = "Name of the Azure Key Vault resource"
  type        = "string"
}

variable "azure_tenant_id" {
  description = "Tenant ID to use for the Key Vault ACLs"
  type        = "string"
}

variable "azure_service_principal_id" {
  description = "Service Principal ID to use for the Key Vault ACLs"
  type        = "string"
}

variable "sku_name" {
  description = "Name of the SKU used for this Key Vault. Possible values are standard and premium."
  type        = "string"
}

resource "azurerm_key_vault" "main" {
  name                        = "${var.azure_key_vault_name}"
  location                    = "${var.location}"
  resource_group_name         = "${var.resource_group_name}"
  enabled_for_disk_encryption = true
  tenant_id                   = "${var.azure_tenant_id}"

  sku_name = "${var.sku_name}"

  access_policy {
    tenant_id = "${var.azure_tenant_id}"
    object_id = "${var.azure_service_principal_id}"

    key_permissions = [
      "get",
    ]

    secret_permissions = [
      "get",
    ]

    storage_permissions = [
      "get",
    ]
  }

  network_acls {
    default_action = "Deny"
    bypass         = "AzureServices"
  }

  tags = {
    environment = "production"
  }
}

