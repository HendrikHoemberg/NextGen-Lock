# Start NextGen Lock Servers
Write-Host "Starting NextGen Lock Backend and Frontend..." -ForegroundColor Cyan

# Install Backend Dependencies
Write-Host "`nInstalling Backend Dependencies..." -ForegroundColor Yellow
Set-Location "$PSScriptRoot\backend"
npm install

# Install Frontend Dependencies
Write-Host "`nInstalling Frontend Dependencies..." -ForegroundColor Yellow
Set-Location "$PSScriptRoot\frontend"
npm install

# Return to root
Set-Location $PSScriptRoot

# Start Backend in background
Write-Host "`nStarting Backend Server on port 5000..." -ForegroundColor Yellow
$backendJob = Start-Job -ScriptBlock {
    Set-Location $using:PSScriptRoot\backend
    npm start
}

# Wait for backend to initialize
Start-Sleep -Seconds 3

# Start Frontend
Write-Host "Starting Frontend Server on port 3000..." -ForegroundColor Yellow
Write-Host "`nServers running!" -ForegroundColor Green
Write-Host "Backend: http://localhost:5000" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host "`nPress Ctrl+C to stop both servers`n" -ForegroundColor Cyan

Set-Location "$PSScriptRoot\frontend"
try {
    npm run dev
} finally {
    Write-Host "`nStopping backend server..." -ForegroundColor Yellow
    Stop-Job $backendJob
    Remove-Job $backendJob
}
