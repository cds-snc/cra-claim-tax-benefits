variable "domain" {
  description = "(Required) Specify the Service Domain."
  default     = "claim-tax-benefits-staging.alpha.cds-snc.ca"
  type        = "string"
}

variable "name" {
  description = "(Required) Specify the Service Name."
  default     = "claim-tax-benefits"
  type        = "string"
}