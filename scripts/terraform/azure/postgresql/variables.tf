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

variable "database_server_name" {
  description = "The PostgreSQL database server name"
  type        = "string"
}

variable "sku_name" {
  description = "Name of the SKU used for this Key Vault. Possible values are standard and premium."
  type        = "string"
}

variable "sku_tier" {
  description = "The tier of the particular SKU. Possible values are Basic, GeneralPurpose, and MemoryOptimized"
  type        = "string"
}

variable "sku_capacity" {
  description = "Name of the SKU used for this Key Vault. Possible values are standard and premium."
  type        = "string"
}

variable "sku_family" {
  description = "The family of hardware Gen4 or Gen5, before selecting your family check the product documentation for availability in your region."
  type        = "string"
}

variable "database_version" {
  description = "Specifies the version of PostgreSQL to use. Valid values are 9.5, 9.6, 10, 10.0, and 11. Changing this forces a new resource to be created."
  type        = "string"
  default     = "11.5"
}

variable "admin_username" {
  description = "The Administrator Login for the PostgreSQL Server. Changing this forces a new resource to be created."
  type        = "string"
  default     = "11.5"
}

variable "admin_password" {
  description = " The Password associated with the administrator_login for the PostgreSQL Server."
  type        = "string"
}

variable "ssl_enforcement" {
  description = "Specifies if SSL should be enforced on connections. Possible values are Enabled and Disabled."
  type        = "string"
}

variable "database_charset" {
  description = "Specifies the Charset for the PostgreSQL Database, which needs to be a valid PostgreSQL Charset. Changing this forces a new resource to be created."
  type        = "string"
  default     = "UTF8"
}

variable "database_collation" {
  description = "Specifies the Collation for the PostgreSQL Database, which needs to be a valid PostgreSQL Collation."
  type        = "string"
  default     = "English_United States.1252"
}

variable "database_name" {
  description = "Specifies the name of the PostgreSQL Database, which needs to be a valid PostgreSQL identifier. "
  type        = "string"
}



