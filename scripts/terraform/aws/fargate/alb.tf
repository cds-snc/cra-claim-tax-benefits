# Application Load Balancer (ALB)
resource "aws_alb" "main" {
  name            = "${var.resource_prefix}-load-balancer"
  subnets         = aws_subnet.public.*.id
  security_groups = [aws_security_group.lb.id]
}

# Provides a Target Group resource for use with the 
# Application Load Balancer resource.
resource "aws_alb_target_group" "app" {
  name        = "${var.resource_prefix}-target-group"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "ip"
  health_check {
    path = "/"
    matcher = "302"
  }
}

# Redirects all traffic on port 80 to 443
resource "aws_alb_listener" "front_end_http" {
  load_balancer_arn = aws_alb.main.id
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = "${aws_alb_target_group.app.arn}"
  }
}