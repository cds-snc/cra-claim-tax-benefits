variable "aws_region" {
  description = "The AWS region things are created in"
  default     = "ca-central-1"
}

variable "aws_profile" {
  description = "The AWS profile under which things are created"
  default     = "default"
}

variable "ecs_task_execution_role_name" {
  description = "ECS task execution role name"
  default = "ctb-role"
}

variable "az_count" {
  description = "Number of AZs to cover in a given region"
  default     = "2"
}

variable "app_image" {
  description = "Docker image to run in the ECS cluster"
  default = "claim-tax-benefits:latest"
}

variable "app_port" {
  description = "Port exposed by the docker image to redirect traffic to"
  default     = 3005
}

variable "app_count" {
  description = "Number of docker containers to run"
  default     = 1
}

variable "health_check_path" {
  default = "/"
}

variable "fargate_cpu" {
  description = "Fargate instance CPU units to provision (1 vCPU = 1024 CPU units)"
  default     = "512"
}

variable "fargate_memory" {
  description = "Fargate instance memory to provision (in MiB)"
  default     = "1024"
}

variable "resource_prefix" {
  description = "Prefix for all resources created as part of this Terraform script"
  default     = "ctb"
}

