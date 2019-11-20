# variables.tf

variable "aws_region" {
  description = "The AWS region things are created in"
  default     = "ca-central-1"
}

variable "resource_prefix" {
  description = "Prefix for all resources created as part of this Terraform script"
  default     = "ctb"
}

