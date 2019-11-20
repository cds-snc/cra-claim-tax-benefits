terraform {
  backend "s3" {
      bucket = "ctb-terraform-state-bucket"
      key = "terraform.tfstate"
      acl = "private"
  }
}