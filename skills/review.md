# Skill: Review

This skill defines the process for reviewing code before it is committed to the main branch.

## 1. Objective

To ensure that all new code is high-quality, correct, maintainable, and adheres to project standards.

## 2. Process

### 2.1. Self-Review Checklist
Before committing, perform a self-review using the following checklist:
- **[ ] Correctness:** Does the code do what it's supposed to do and meet all requirements from the design?
- **[ ] Readability:** Is the code easy to understand? Are variable and function names clear?
- **[ ] Consistency:** Does the code follow the project's existing style and patterns?
- **[ ] Simplicity:** Is the code as simple as it can be? Is there any unnecessary complexity?
- **[ ] Testing:** Are there sufficient tests for the new code? Do all tests pass?
- **[ ] Documentation:** Is any necessary documentation (e.g., comments for complex logic) present?

### 2.2. Automated Checks
- Run any available automated tools to check the code.
- This may include:
    - **Linters:** To check for style and formatting issues.
    - **Static Analyzers:** To find potential bugs or code smells.
- Use the `review.ps1` script (or equivalent command) as a placeholder to run these tools.

### 2.3. Commit
- Once the code has passed the self-review and automated checks, commit it using the `review-and-commit.ps1` script.
- The commit message should be clear and follow the project's conventions.
