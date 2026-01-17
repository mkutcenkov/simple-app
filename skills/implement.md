# Skill: Implement

This skill defines the process for writing code to implement an approved feature design.

## 1. Objective

To translate the design document into clean, efficient, and maintainable code that meets all requirements.

## 2. Process

### 2.1. Setup
- Ensure you are on the correct Git branch. If not, create a new feature branch (`feature/[feature-name]`).
- Set up any necessary development environment configurations.

### 2.2. Code Implementation
- Follow the implementation plan from the `DESIGN-[feature-name].md` document step by step.
- Adhere strictly to the project's established coding style and conventions (see `settings/project-settings.json`).
- Write clear and concise code. Add comments only when necessary to explain the "why" behind complex logic.
- Create or modify files as outlined in the design.

### 2.3. Integrate and Verify
- As you complete parts of the implementation, run the application locally to ensure they work as expected.
- Use the `run.ps1` script for local testing.
- If frontend changes were made, use the `deploy.ps1` script to update the local environment.
