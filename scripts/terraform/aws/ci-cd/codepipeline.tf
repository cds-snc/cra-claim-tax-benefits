resource "aws_codepipeline" "codepipeline" {
  name     = "claim-tax-benefits"
  role_arn = "${aws_iam_role.iam_codepipeline_role.arn}"
  
  artifact_store {
    location = "${aws_s3_bucket.default.bucket}"
    type     = "S3"
  }
  
  # Configure CodePipeline poll code from Github if there is any commits. 
  stage {
    name = "Source"

    action {
      name             = "Source"
      category         = "Source"
      owner            = "ThirdParty"
      provider         = "GitHub"
      version          = "1"
      output_artifacts = ["code"]

      configuration {
        OAuthToken           = "${var.github_oauth_token}"
        Owner                = "${var.repo_owner}"
        Repo                 = "${var.repo_name}"
        Branch               = "${var.branch}"
        PollForSourceChanges = "${var.poll_source_changes}"
      }
    }
  }
  
  # We use CodeBuild to Build Docker Image.
  stage {
    name = "BuildDocker"

    action {
      name            = "Build"
      category        = "Build"
      owner           = "AWS"
      provider        = "CodeBuild"
      input_artifacts = ["code"]
      version         = "1"
      configuration {
        ProjectName = "${aws_codebuild_project.codebuild_docker_image.name}"
      }
    }
  }
  
  # We use CodeBuild to deploy application. 
  stage {
    name = "Deploy"

    action {
      name            = "Deploy"
      category        = "Build"
      owner           = "AWS"
      provider        = "CodeBuild"
      input_artifacts = ["code"]
      version         = "1"
      configuration {
        ProjectName = "${aws_codebuild_project.codebuild_deploy_on_ecs.name}"
      }
    }
  }
}