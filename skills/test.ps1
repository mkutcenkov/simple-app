# This skill runs the tests for the project.

Write-Host "Running tests..."

# Run frontend tests
Write-Host "Running frontend tests..."
npm test --prefix simple-app-client -- --watchAll=false

if ($LASTEXITCODE -ne 0) {
    Write-Host "Frontend tests failed."
    exit 1
}

Write-Host "Frontend tests passed."

# Placeholder for backend tests
Write-Host "Running backend tests (placeholder)..."
# In a real-world scenario, you would run your backend tests here.
# For example:
# dotnet test SimpleApp.Api

Write-Host "All tests passed."
