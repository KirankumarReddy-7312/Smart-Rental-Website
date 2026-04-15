@echo off
echo Starting Smart Rental Platform...

:: Start Backend
start cmd /k "echo Starting Backend... && cd backend && python manage.py runserver"

:: Start Frontend
start cmd /k "echo Starting Frontend... && cd frontend && npm run dev"

echo Both systems are launching!
echo Backend: http://127.0.0.1:8000
echo Frontend: http://localhost:3000
pause
