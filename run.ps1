# This script runs the ASP.NET Core web application.

Write-Host "Starting the web application..."
Write-Host "You can access the application at https://localhost:7158 or http://localhost:5291"

dotnet run --project SimpleApp.Api
