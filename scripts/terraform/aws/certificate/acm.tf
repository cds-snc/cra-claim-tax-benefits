variable "aws_region" {
  description = "The AWS region things are created in"
  default     = "ca-central-1"
}

variable "aws_profile" {
  description = "The AWS profile under which things are created"
  default     = "default"
}

resource "aws_acm_certificate" "main" {
  domain_name       = "${var.aws_profile == "prod" ? "claim-tax-benefits.alpha.canada.ca" : "claim-tax-benefits-staging.alpha.canada.ca" }"
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}