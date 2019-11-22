variable "server_name" {
  description = "Database server name"
  default = "claim-tax-benefits-pg"
}

variable "database_name" {
  description = "Database name"
  default = "claim-tax-benefits-db"
}

variable "resource_group_name" {
  description = "Default resource group name that the network will be created in."
  default = "cdscracollab-innovation-rg"
}

variable "location" {
  description = "The location/region where the core network will be created. The full list of Azure regions can be found at https://azure.microsoft.com/regions"
  default = "canadacentral"
}

variable "admin_username" {
  description = "The database server admin login name"
  default = "ctb_admin"
}

variable "pg_version" {
  description = "Postgres version"
  default     = "11"
}

variable "backup" {
  description = "Geo-redundant backup"
  default     = "Disabled"
}

variable "retention_days" {
  description = "Retention days"
  default     = "30"
}
variable "auto_grow" {
  description = "Enable/Disable auto-growing of the storage"
  default     = "Enabled"
}

variable "storage_mb" {
  description = "Storage in mb"
  default     = "5120"
}

variable "capacity" {
  description = "SKU capacity"
  default     = "2"
}
variable "sku_name" {
  description = "SKU name"
  default     = "GP_Gen5_2"
}

variable "tags" {
  description = "The tags to associate with your network and subnets."
  type        = "map"

  default = {
    provisioner = "terraform"
  }
}