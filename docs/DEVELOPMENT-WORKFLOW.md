# Agile development workflow

1. Development sprints are two weeks long.
2. At the beginning of a sprint, the development team meets with the members of the larger team to discuss priorities for new features.
3. The development team reviews open issues from the last sprint and prioritizes them with the next development targets.
4. Developers self-assign issues from the list of open issues in GitHub.
5. To resolve an issue, a developer:
   - Checks out a new branch from master
   - Builds the feature or resolves the bug described in the issue
   - Continuously commits code to their branch at sensible intervals
   - Writes unit and integration tests where appropriate for the code they have added
   - Changes/removes unit and integration tests for code they have modified
   - Runs the test suite(s) and ensures all tests pass
   - Commits the final code, pushes the code to GitHub, and opens a pull request in GitHub
   - Awaits [GitHub Actions](https://github.com/features/actions) to verify that all tests pass on CI
   - Spot check features using Heroku [Review Apps](https://devcenter.heroku.com/articles/github-integration-review-apps)
   - Requests other members of the team [review the pull request](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/docs/CODE-REVIEW-GUIDELINES.md).
   - If other team members have comments, they will note these in GitHub for the developer to either fix them or discuss
   - Other team members approve the pull request after all discussions have been resolved
   - Pull requests are then merged to master by the author of the pull request
   - [GitHub Actions](https://github.com/features/actions) verify once more that all tests pass on the updated master and then deploys the code into production
6. This process is repeated iteratively until a new sprint starts.
7. At the end of a sprint, the development team reviews the issues completed and suggests improvements for the next sprint.
