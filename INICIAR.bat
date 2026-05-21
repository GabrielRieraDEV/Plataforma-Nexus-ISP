@echo off
chcp 65001 >nul 2>&1
cd /d "%~dp0"
title Plataforma Nexus ISP

echo.
echo Iniciando Plataforma Nexus ISP...
echo.

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\iniciar.ps1"
set EXITCODE=%ERRORLEVEL%

if %EXITCODE% NEQ 0 (
    echo.
    echo Hubo un error. Revise la ventana de arriba o el archivo logs\iniciar.log
    echo.
)

pause
