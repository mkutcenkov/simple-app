param (
    [string]$ServiceId = "srv-d5lsi675r7bs73cp0kk0",
    [string]$AppUrl = "https://simple-app-wne2.onrender.com",
    [string]$DeployId = "",
    [int]$TimeoutSeconds = 600,
    [int]$PollingIntervalSeconds = 15
)

$headers = @{
    "Authorization" = "Bearer $env:RENDER_API_KEY"
    "Accept"        = "application/json"
}

Write-Host "Starting Render deployment validation for service ID: $ServiceId"
if ($DeployId) { Write-Host "Waiting for Deploy ID: $DeployId" }
Write-Host "Target URL: $AppUrl"

$stopwatch = [System.Diagnostics.Stopwatch]::StartNew()

while ($stopwatch.Elapsed.TotalSeconds -lt $TimeoutSeconds) {
    try {
        $isLive = $false

        if ($DeployId) {
            # Check specific deploy status
            $deployUrl = "https://api.render.com/v1/services/$ServiceId/deploys/$DeployId"
            $deployResponse = Invoke-RestMethod -Uri $deployUrl -Headers $headers -Method Get
            $deployStatus = $deployResponse.status
            
            Write-Host "Time Elapsed: $($stopwatch.Elapsed.ToString('mm\:ss')) - Deploy Status: $deployStatus"
            
            if ($deployStatus -eq "live") {
                $isLive = $true
            } elseif ($deployStatus -match "failed|canceled") {
                 Write-Host "`nFAILURE: Deployment $DeployId ended with status: $deployStatus" -ForegroundColor Red
                 exit 1
            }
        } else {
            # Fallback: just check service status
            $serviceUrl = "https://api.render.com/v1/services/$ServiceId"
            $serviceResponse = Invoke-RestMethod -Uri $serviceUrl -Headers $headers -Method Get
            
            # If suspended is false, it's technically "running", but not necessarily the new version if we didn't check deploy ID.
            # But this is the legacy behavior we preserve if no DeployId is passed.
            if (-not $serviceResponse.service.suspended) {
                $isLive = $true
            }
             Write-Host "Time Elapsed: $($stopwatch.Elapsed.ToString('mm\:ss')) - Service Suspended: $($serviceResponse.service.suspended)"
        }

        if ($isLive) {
            # 2. Check Application Health (HTTP 200)
            try {
                $webResponse = Invoke-WebRequest -Uri $AppUrl -Method Head -UseBasicParsing -ErrorAction Stop -TimeoutSec 5
                $statusCode = $webResponse.StatusCode
            }
            catch {
                $statusCode = $_.Exception.Response.StatusCode
            }
            
            Write-Host "  -> Web Status: $statusCode"

            if ($statusCode -eq 200) {
                Write-Host "`nSUCCESS: Deployment validated! Application is accessible at $AppUrl" -ForegroundColor Green
                exit 0
            }
        }
    }
    catch {
        Write-Host "Error checking status: $_"
    }

    Start-Sleep -Seconds $PollingIntervalSeconds
}

Write-Host "`nTIMEOUT: Deployment validation failed after $TimeoutSeconds seconds." -ForegroundColor Red
exit 1
