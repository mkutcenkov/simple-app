# This skill creates a DESIGN.md template for a new feature.

param (
    [string]$FeatureName
)

if ([string]::IsNullOrEmpty($FeatureName)) {
    $FeatureName = "New Feature"
}

$designContent = @"
# Design for: $FeatureName

## 1. Architecture

*A high-level overview of the proposed solution.*

## 2. UI/UX (if applicable)

*Mockups, wireframes, or a description of the user interface.*

## 3. Implementation Plan

*A breakdown of the steps required to implement the feature.*

## 4. Testing Strategy

*An outline of how the feature will be tested.*
"@

$designFile = "DESIGN-$($FeatureName.Replace(' ', '-')).md"

Set-Content -Path $designFile -Value $designContent

Write-Host "Created design template: $designFile"
