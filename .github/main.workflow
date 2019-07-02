workflow "Run tests on push" {
  on = "push"
  resolves = [
    "Lint Dockerfile",
    "Run jest unit tests",
  ]
}

action "Lint Dockerfile" {
  uses = "docker://cdssnc/docker-lint"
}

action "Install npm dependencies" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  args = "install"
}

action "Run JS linter" {
  uses  = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  args  = "run lint"
  needs = [
    "Install npm dependencies"
  ]
}

action "Run jest unit tests" {
  uses  = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  args  = "test"
  needs = [
    "Install npm dependencies"
  ]
}
