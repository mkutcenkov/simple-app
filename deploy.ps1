# This script automates the build of the React frontend and deploys it to the ASP.NET Core backend.

Write-Host "Starting build and deployment process..."

# Build the React application
Write-Host "Building React app..."
npm run build --prefix simple-app-client

# Check if the build was successful
if ($LASTEXITCODE -ne 0) {
    Write-Host "React build failed. Aborting deployment."
    exit 1
}

Write-Host "React app built successfully."

# Define paths
$buildDir = "simple-app-client/build"
$targetDir = "SimpleApp.Api/wwwroot"

# Clear the target directory
Write-Host "Clearing target directory: $targetDir"
Remove-Item -Path "$targetDir/*" -Recurse -Force

# Copy build files to the target directory
Write-Host "Copying build files to $targetDir"
Copy-Item -Path "$buildDir/*" -Destination $targetDir -Recurse

Write-Host "Deployment complete."
