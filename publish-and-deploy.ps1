param (
    [string]$CommitMessage = "Update application"
)

# Ensure we are in the script's directory or adjust paths
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $scriptPath

Write-Host "Starting Publish and Deploy process..."

# Check git status
$status = git status --porcelain
if ($status) {
    Write-Host "Uncommitted changes detected. Committing..."
    git add .
    git commit -m "$CommitMessage"
} else {
    Write-Host "No uncommitted changes."
}

# Push to GitHub
Write-Host "Pushing to GitHub..."
# Assuming 'master' is the default branch, adjust if necessary
git push origin master

if ($LASTEXITCODE -ne 0) {
    Write-Host "Git push failed. Please check your remote configuration."
    exit 1
}

Write-Host "Successfully pushed to GitHub."

Write-Host "`n--------------------------------------------------------"
Write-Host "DEPLOYMENT INSTRUCTIONS"
Write-Host "--------------------------------------------------------"
Write-Host "1. Local: Run 'validate-local.ps1' to test changes before pushing."
Write-Host "2. Push: Changes have been pushed to GitHub."
Write-Host "3. Remote: Render should detect the push and deploy automatically."
Write-Host "   Or use Agent Command: 'Deploy simple-app to Render'"
Write-Host "4. Validation: Run 'validate-render-deploy.ps1' to verify live site."
Write-Host "   Example: ./validate-render-deploy.ps1 -DeployId <ID>"
Write-Host "--------------------------------------------------------"
