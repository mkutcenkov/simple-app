param (
    [string]$ServiceId = "srv-d5lsi675r7bs73cp0kk0",
    [string]$AppUrl = "https://simple-app-wne2.onrender.com",
    [int]$TimeoutSeconds = 600,
    [int]$PollingIntervalSeconds = 15
)

$headers = @{
    "Authorization" = "Bearer $env:RENDER_API_KEY"
    "Accept"        = "application/json"
}

Write-Host "Starting Render deployment validation for service ID: $ServiceId"
Write-Host "Target URL: $AppUrl"

$stopwatch = [System.Diagnostics.Stopwatch]::StartNew()

while ($stopwatch.Elapsed.TotalSeconds -lt $TimeoutSeconds) {
    try {
        # 1. Check Service Status via Render API
        $serviceUrl = "https://api.render.com/v1/services/$ServiceId"
        $serviceResponse = Invoke-RestMethod -Uri $serviceUrl -Headers $headers -Method Get
        
        # Access the service details from the response
        # The structure is usually response.service or response[0].service depending on endpoint, 
        # but /services/{id} returns the service object directly or wrapped in 'service'.
        # Based on previous output, it seems to be wrapped in a 'service' property or part of a list.
        # Let's inspect the object structure safely.
        
        $serviceStatus = $null
        if ($serviceResponse.service) {
             # Verify deploy status. 'suspended' means it's not running.
             # We want to check the latest deploy status ideally, but 'suspended' check is a basic first step.
             $serviceStatus = $serviceResponse.service.suspended
        }
        
        # 2. Check Application Health (HTTP 200)
        # We try this even if the API says it's running, to be sure.
        try {
            $webResponse = Invoke-WebRequest -Uri $AppUrl -Method Head -UseBasicParsing -ErrorAction Stop -TimeoutSec 5
            $statusCode = $webResponse.StatusCode
        }
        catch {
            $statusCode = $_.Exception.Response.StatusCode
        }

        Write-Host "Time Elapsed: $($stopwatch.Elapsed.ToString('mm\:ss')) - API Status: $($serviceResponse.service.suspended) - Web Status: $statusCode"

        if ($statusCode -eq 200) {
            Write-Host "`nSUCCESS: Deployment validated! Application is accessible at $AppUrl" -ForegroundColor Green
            exit 0
        }
    }
    catch {
        Write-Host "Error checking status: $_"
    }

    Start-Sleep -Seconds $PollingIntervalSeconds
}

Write-Host "`nTIMEOUT: Deployment validation failed after $TimeoutSeconds seconds." -ForegroundColor Red
exit 1
