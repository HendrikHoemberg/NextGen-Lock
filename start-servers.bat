@echo off
echo Starting NextGen Lock Backend and Frontend...

REM Install Backend Dependencies
echo.
echo Installing Backend Dependencies...
cd /d %~dp0\backend
call npm install

REM Install Frontend Dependencies
echo.
echo Installing Frontend Dependencies...
cd /d %~dp0\frontend
call npm install

REM Return to root
cd /d %~dp0

REM Start Backend in background
echo.
echo Starting Backend Server on port 5000...
start /B cmd /c "cd /d %~dp0\backend && npm start"

REM Wait for backend to initialize
timeout /t 3 /nobreak >nul

REM Start Frontend
echo Starting Frontend Server on port 3000...
echo.
echo Servers running!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press Ctrl+C to stop both servers
echo.

cd /d %~dp0\frontend
npm run dev
