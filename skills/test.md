# Skill: Test

This skill defines the process for testing a new feature to ensure its quality and correctness.

## 1. Objective

To verify that the implemented feature works as expected, meets all requirements, and does not introduce any regressions.

## 2. Process

### 2.1. Unit Testing
- For each new function or component, write unit tests that cover:
    - **Happy Path:** The expected, normal usage.
    - **Edge Cases:** Input at the boundaries of what is acceptable (e.g., empty strings, zero, null).
    - **Error Conditions:** Invalid input or unexpected states.
- Ensure all new code has a high level of unit test coverage.

### 2.2. Integration Testing
- Write tests that verify the interaction between different components of the feature.
- If the feature involves both frontend and backend changes, ensure there are tests that cover their integration point (e.g., API calls).

### 2.3. Run All Tests
- Execute the full test suite for the project to ensure that no existing functionality has been broken.
- Use the `test.ps1` script (or equivalent command) to run all tests.
- All tests must pass before the feature can be considered for review.
