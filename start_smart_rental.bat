@echo off
echo ========================================================
echo       Starting Smart Rental Backend & Frontend
echo ========================================================
echo.

echo [1/2] Starting Django API Backend (Port 8000)...
start "Smart Rental Backend" cmd /k "cd backend && call venv\Scripts\activate.bat && python manage.py runserver"

echo [2/2] Starting Next.js User Frontend (Port 3000)...
start "Smart Rental Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================================
echo SUCCESS! Both servers have been launched in new windows.
echo Please wait a few seconds for them to load.
echo Once ready, access your application here:
echo http://localhost:3000
echo ========================================================
pause
