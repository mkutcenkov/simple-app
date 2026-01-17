# Script to build and run the Docker container locally for testing

$ImageName = "simple-app"
$ContainerName = "simple-app-container"

Write-Host "Building Docker image '$ImageName'..."
docker build -t $ImageName .

if ($LASTEXITCODE -ne 0) {
    Write-Error "Docker build failed."
    exit 1
}

Write-Host "Checking for existing container..."
docker rm -f $ContainerName 2>$null

Write-Host "Running container on http://localhost:8080..."
docker run -d -p 8080:8080 --name $ContainerName $ImageName

Write-Host "Container started. Access the app at http://localhost:8080"
Write-Host "To view logs: docker logs -f $ContainerName"
Write-Host "To stop: docker stop $ContainerName"
