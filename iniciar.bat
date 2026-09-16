@echo off
title NAS Computer - Lanzador
echo ===================================================
echo     Iniciando NAS Computer (Backend + Frontend)
echo ===================================================
echo.
echo 1. Levantando API Backend en http://localhost:3000...
start "NAS - Backend API (Puerto 3000)" cmd /k "cd /d ""%~dp0backend"" && npm run start:dev"

echo 2. Levantando Frontend en http://localhost:5173...
start "NAS - Frontend (Puerto 5173)" cmd /k "cd /d ""%~dp0frontend"" && npm run dev"

echo.
echo Los dos servicios se estan ejecutando en ventanas independientes.
echo Puedes cerrar este iniciador.
timeout /t 5
