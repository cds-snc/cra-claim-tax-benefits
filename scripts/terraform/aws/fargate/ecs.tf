# Provides an ECS cluster.
resource "aws_ecs_cluster" "main" {
  name = "${var.resource_prefix}-cluster"
}

data "aws_caller_identity" "current" {
}

output "account_id" {
  value = "${data.aws_caller_identity.current.account_id}"
}

output "caller_arn" {
  value = "${data.aws_caller_identity.current.arn}"
}

output "caller_user" {
  value = "${data.aws_caller_identity.current.user_id}"
}

# Get data from template file
data "template_file" "ctb_app" {
  template = file("./templates/ecs/ctb_app.json.tpl")

  vars = {
    app_image      = "${data.aws_caller_identity.current.account_id}.dkr.ecr.ca-central-1.amazonaws.com/${var.app_image}"
    app_port       = var.app_port
    fargate_cpu    = var.fargate_cpu
    fargate_memory = var.fargate_memory
    aws_region     = var.aws_region
    resource_prefix = var.resource_prefix
  }
}

# Manages a revision of an ECS task definition to be used in
resource "aws_ecs_task_definition" "app" {
  family                   = "${var.resource_prefix}-app-task"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.fargate_cpu
  memory                   = var.fargate_memory
  container_definitions    = data.template_file.ctb_app.rendered
}

# Provides an ECS service - effectively a task that is expected to run until an error occurs or a user terminates it
resource "aws_ecs_service" "main" {
  name            = "${var.resource_prefix}-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.app.arn
  desired_count   = var.app_count
  launch_type     = "FARGATE"

  network_configuration {
    security_groups  = [aws_security_group.ecs_tasks.id]
    subnets          = aws_subnet.private.*.id
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_alb_target_group.app.id
    container_name   = "${var.resource_prefix}-app"
    container_port   = var.app_port
  }

  depends_on = [aws_alb_listener.front_end_http, aws_iam_role_policy_attachment.ecs_task_execution_role]
}