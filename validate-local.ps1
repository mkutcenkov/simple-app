# Script to deploy and run the application locally using Docker Compose for validation

Write-Host "=========================================="
Write-Host "   Simple App - Local Validation Tool"
Write-Host "=========================================="

# 1. Build and Run via Docker Compose
Write-Host "`n[1/3] Starting services via Docker Compose..."
Write-Host "      Building app and spinning up Postgres database..."

docker compose up -d --build

if ($LASTEXITCODE -ne 0) {
    Write-Error "Docker Compose failed to start."
    exit 1
}

# 2. Wait for user validation
Write-Host "`n[2/3] Services are running!"
Write-Host "      URL: http://localhost:8080"
Write-Host "`nPLEASE ACTION: Open the URL in your browser and verify the changes."
Write-Host "Note: It might take a few seconds for the app to apply migrations and start serving requests."
Write-Host "Press any key to STOP the services and finish validation..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# 3. Cleanup
Write-Host "`n[Stopping] Shutting down services..."
docker compose down
Write-Host "Validation session ended."