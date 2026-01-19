# GEMINI Development Process

This document outlines the standard process for developing and implementing new features using the Gemini CLI.

## 1. Requirement Analysis

**Goal:** To fully understand the user's request and requirements.

**Process:**
- If the request is unclear, I will ask targeted questions to clarify the feature's scope, goals, and constraints.
- I will identify the key components of the feature and the expected outcomes.

## 2. Design Proposal

**Goal:** To create a comprehensive design proposal for the user's review and approval.

**Process:**
- I will create a `DESIGN.md` document for the feature.
- The design will include:
    - **Architecture:** A high-level overview of the proposed solution, including new components, and modifications to existing ones.
    - **UI/UX (if applicable):** Mockups, wireframes, or a description of the user interface and interaction flow.
    - **Implementation Plan:** A breakdown of the steps required to implement the feature.
    - **Testing Strategy:** An outline of how the feature will be tested.
- I will present the design to the user for approval.

## 3. User Approval

**Goal:** To get explicit approval from the user before starting implementation.

**Process:**
- I will wait for the user to review the design and provide feedback.
- If changes are requested, I will update the design and resubmit it for approval.

## 4. Implementation

**Goal:** To write the code for the feature according to the approved design.

**Process:**
- I will follow the implementation plan outlined in the `DESIGN.md`.
- I will adhere to the project's coding conventions and style.
- I will create or modify files as needed.

## 5. Testing

**Goal:** To ensure the new feature is working correctly and doesn't introduce regressions.

**Process:**
- I will write unit tests and integration tests for the new code.
- I will run all tests to ensure they pass.

## 6. Local Validation

**Goal:** To verify the application functionality in a production-like environment before committing.

**Process:**
- I will execute `powershell -File simple-app/validate-local.ps1`.
- I will ask the user to open `http://localhost:8080` and confirm the changes are correct.
- I will wait for the user's explicit confirmation before proceeding.
- If issues are found, I will revert to the **Implementation** phase.

## 7. Code Review

**Goal:** To review the code for quality, correctness, and adherence to best practices.

**Process:**
- I will perform a self-review of the code.
- I will use any available linters or static analysis tools to check the code.
- I will use the `review-and-commit.ps1` script to formalize this process.

## 8. Finalization

**Goal:** To complete the feature development and merge it into the main codebase.

**Process:**
- I will commit the changes with a clear and descriptive message.
    - **Title:** A concise summary of the change (e.g., "Fix: ...", "Feat: ...").
    - **Description:** A bulleted list or detailed explanation of *what* was changed and *why*.
- I will use the updated `review-and-commit.ps1` script, providing both the message and the description.
- I will inform the user that the feature is complete and ready for use.

## 9. Deployment

**Goal:** To deploy the application to the Render cloud platform.

**Process:**
- I will ensure all changes are pushed to the GitHub repository.
- I will utilize the **Render MCP** to manage the deployment:
    - Trigger a new deployment for the `simple-app` service.
    - Monitor the build and deployment status.
    - Retrieve the active service URL.
- I will verify the deployed application using the validation script:
    - Execute `powershell -File simple-app/validate-render-deploy.ps1 -DeployId <DEPLOY_ID>`, passing the `DeployId` returned by the Render MCP.
    - Ensure the script returns a success status (Exit Code 0).
