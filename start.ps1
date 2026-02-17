# ChordFlow - One-Click Startup Script
# Starts both backend and frontend servers and opens the app in browser

Write-Host "🎸 Starting ChordFlow..." -ForegroundColor Cyan
Write-Host ""

# Start backend server
Write-Host "📡 Starting backend server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\server'; npm run dev" -WindowStyle Minimized

# Wait a moment for backend to initialize
Start-Sleep -Seconds 2

# Start frontend server
Write-Host "🎨 Starting frontend server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\client'; npm run dev" -WindowStyle Minimized

# Wait for frontend to start
Write-Host "⏳ Waiting for servers to start..." -ForegroundColor Gray
Start-Sleep -Seconds 5

# Open browser
Write-Host "🌐 Opening ChordFlow in browser..." -ForegroundColor Green
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "✅ ChordFlow is starting!" -ForegroundColor Green
Write-Host "   Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "   Backend: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to close this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
