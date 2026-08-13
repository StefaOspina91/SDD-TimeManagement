$ErrorActionPreference = 'Stop'

Set-Location $PSScriptRoot\..

Write-Host "Starting Postgres via docker-compose..."
docker compose -f docker-compose.dev.yml up -d

Start-Sleep -Seconds 8

$cid = docker compose -f docker-compose.dev.yml ps -q postgres
if (-not $cid) {
    throw "Postgres container was not started. Check docker compose output."
}

Write-Host "Copying migration into container..."
docker cp ".\migrations\001_init.sql" "${cid}:/tmp/001_init.sql"

Write-Host "Applying migration..."
docker exec -i $cid bash -lc "psql -U tm_dev -d time_management_dev -f /tmp/001_init.sql"

Write-Host "Database ready."
Write-Host "Connection string: postgresql://tm_dev:tm_password@localhost:5432/time_management_dev"
