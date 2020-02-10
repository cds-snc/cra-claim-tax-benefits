# Code review guidelines

While solipsism is an interesting philosophical tributary, it’s not a very good way to write long-term maintained software. In general we work in teams at CDS, so we require mandatory code reviews before merging any Pull Request.

Just like all the fun and cool code we love to write often comes down to subjective, individual decisions, the practice of reviewing code is pretty subjective, given that different individuals will do different reviews.

Here are a list of considerations to keep in mind when doing a review: firstly focusing on principles to keep in mind for reviewers, and then leading into technical considerations.

## Principles for reviewers

- [Be nice](https://qz.com/work/625870/after-years-of-intensive-analysis-google-discovers-the-key-to-good-teamwork-is-being-nice/)
  - If you're not sure how someone wants their code reviewed or how they prefer to receive feedback, talk to them beforehand
  - read the CDS [Code of Conduct](https://github.com/cds-snc/.github/blob/master/CODE_OF_CONDUCT.md)
- Point out when something is particularly good or clever
  - Reviews often focus on negative things so highlight good things as well when you see them
- Be explicit with feedback
  - If screenshots or gifs will help make your point, include them
- Programming is subjective
  - Different approaches are valid
  - Ask for clarifications if you need any
- Communicate which ideas you feel strongly about and those you don't
- Never review code on weekends

## Technical code review checklist

### Logic

- Does the code work?
  - Does it perform its intended function?
  - Is the logic correct?
  - Is the proposed UI accessible?
  - Make sure to test the working code yourself
- Is all the code easily understood?
  - Which parts are confusing to you and why?
  - Multiple (nested) if/else blocks are code smells for complex logic
  - If you are taking a lot of time to understand the code, perhaps it needs comments or refactoring
- Can the code be simplified?
  - Remove unused parameters or "generic" code that is only used once
  - Don't solve problems you don't have
- Does similar functionality already exist in the codebase?
  - If so, why isn’t this functionality reused? (Note: it's okay to not reuse things — but it's worth asking the question.)
- Can any of the code be replaced with library or built-in functions?
- Does this change introduce any security concerns?
  - Does it accept or handle user data?

### Comments

- Has all commented-out code been deleted?
  - We can find past code using version control if needed
- Are all functions commented?
- Do comments exist to describe the intent of any thorny logic?
- Are there comments that no longer make sense?

### Errors

- Can you think of any use case in which the code does not behave as intended?
  - Run the code and try to cause errors
- Are potential errors being caught and logged?
- Are third-party utilities are used which may return errors?
- Is any unusual behavior or edge-case handling described?

### Tests

- Do tests exist, and are they comprehensive?
  - Do tests exist for errors or bad inputs?
- Are tests checking things at the right level?
  - Often, unit tests aren't suitable for complex flows
- Do the existing set of tests pass?
  - Tests should be running as part of a continuous integration workflow

### Documentation

- Does this change require an update to the README or configuration files?
- Is the reason for the change outlined in the commit message?
  - [A good commit message](https://github.com/alphagov/styleguides/blob/master/git.md) explains what changed and _why_ it was done this way
  - Linking to external references is a good idea if you debugged something or found some code on stack overflow

## Further references

The Government Digital Service in the UK has really good guidance on some of this stuff.

1. [Pull request guidance](https://github.com/alphagov/styleguides/blob/master/pull-requests.md)
2. [Writing a good commit message](https://github.com/alphagov/styleguides/blob/master/git.md)

Also this list of [Code Review guidelines for reviewers and reviewees by thoughtbot](https://github.com/thoughtbot/guides/tree/master/code-review) is terrific.
