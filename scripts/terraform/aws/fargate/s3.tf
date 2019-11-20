resource "aws_s3_bucket" "terraform" {
  bucket = "ctb-terraform-state-bucket"
  acl    = "private"

  tags = {
    Name        = "Terraform State Bucket"
    Environment = "Dev"
  }
}