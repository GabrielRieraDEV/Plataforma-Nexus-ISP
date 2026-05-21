@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Plataforma Nexus ISP
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\iniciar.ps1"
