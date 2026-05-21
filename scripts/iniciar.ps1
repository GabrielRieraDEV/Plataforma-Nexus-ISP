# Plataforma Nexus ISP — inicio local sin Docker (Windows)
# Uso: doble clic en INICIAR.bat o: powershell -File scripts\iniciar.ps1

$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$Root = Split-Path -Parent $PSScriptRoot
$Backend = Join-Path $Root "backend"
$Frontend = Join-Path $Root "frontend"
$Templates = Join-Path $PSScriptRoot "templates"

function Write-Step([string]$Message) {
    Write-Host ""
    Write-Host ">> $Message" -ForegroundColor Cyan
}

function Write-Ok([string]$Message) {
    Write-Host "   OK: $Message" -ForegroundColor Green
}

function Write-Fail([string]$Message) {
    Write-Host ""
    Write-Host "ERROR: $Message" -ForegroundColor Red
    Write-Host ""
    Read-Host "Presione Enter para cerrar"
    exit 1
}

function Find-Python {
    $candidates = @(
        @{ Cmd = "py"; Args = @("-3.12", "-c", "import sys; print(sys.executable)") },
        @{ Cmd = "py"; Args = @("-3", "-c", "import sys; print(sys.executable)") },
        @{ Cmd = "python"; Args = @("-c", "import sys; print(sys.executable)") }
    )
    foreach ($c in $candidates) {
        try {
            $out = & $c.Cmd @c.Args 2>$null
            if ($LASTEXITCODE -eq 0 -and $out) {
                return $out.Trim()
            }
        } catch { }
    }
    return $null
}

function Find-Node {
    try {
        $v = node --version 2>$null
        if ($LASTEXITCODE -eq 0 -and $v) { return $true }
    } catch { }
    return $false
}

Clear-Host
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "  Plataforma Nexus ISP — inicio local" -ForegroundColor Yellow
Write-Host "  (sin Docker)" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow

Write-Step "Comprobando requisitos"

$pythonExe = Find-Python
if (-not $pythonExe) {
    Write-Fail @"
No se encontro Python 3.12+.

Instale Python desde https://www.python.org/downloads/
Marque la opcion "Add python.exe to PATH" durante la instalacion.
"@
}
Write-Ok "Python: $pythonExe"

if (-not (Find-Node)) {
    Write-Fail @"
No se encontro Node.js.

Instale Node.js LTS desde https://nodejs.org/
Reinicie la terminal o el equipo despues de instalar.
"@
}
Write-Ok "Node.js: $(node --version)"

Write-Step "Configurando variables de entorno"

$backendEnv = Join-Path $Backend ".env"
$frontendEnv = Join-Path $Frontend ".env"

if (-not (Test-Path $backendEnv)) {
    Copy-Item (Join-Path $Templates "backend.env") $backendEnv
    Write-Ok "Creado backend/.env (base SQLite local)"
} else {
    Write-Ok "backend/.env ya existe"
}

if (-not (Test-Path $frontendEnv)) {
    Copy-Item (Join-Path $Templates "frontend.env") $frontendEnv
    Write-Ok "Creado frontend/.env"
} else {
    Write-Ok "frontend/.env ya existe"
}

Write-Step "Instalando dependencias del backend (primera vez puede tardar)"

$venvDir = Join-Path $Backend ".venv"
$venvPython = Join-Path $venvDir "Scripts\python.exe"
$venvPip = Join-Path $venvDir "Scripts\pip.exe"

if (-not (Test-Path $venvPython)) {
    & $pythonExe -m venv $venvDir
    if (-not (Test-Path $venvPython)) {
        Write-Fail "No se pudo crear el entorno virtual en backend/.venv"
    }
}

Push-Location $Backend
& $venvPip install -q -r requirements.txt
if ($LASTEXITCODE -ne 0) {
    Pop-Location
    Write-Fail "Fallo pip install en backend. Revise su conexion a internet."
}
Pop-Location
Write-Ok "Backend listo"

Write-Step "Instalando dependencias del frontend (primera vez puede tardar)"

Push-Location $Frontend
$lockFile = Join-Path $Frontend "package-lock.json"
if (Test-Path $lockFile) {
    npm ci --no-audit --no-fund 2>&1 | Out-Host
} else {
    npm install --no-audit --no-fund 2>&1 | Out-Host
}
if ($LASTEXITCODE -ne 0) {
    Pop-Location
    Write-Fail "Fallo npm install en frontend. Revise su conexion a internet."
}
Pop-Location
Write-Ok "Frontend listo"

Write-Step "Iniciando servicios"

$backendCmd = @"
`$Host.UI.RawUI.WindowTitle = 'Nexus ISP - Backend'
Set-Location '$Backend'
& '$venvDir\Scripts\Activate.ps1'
Write-Host 'Backend en http://localhost:8000' -ForegroundColor Green
Write-Host 'API docs: http://localhost:8000/docs' -ForegroundColor DarkGray
uvicorn app.main:app --host 127.0.0.1 --port 8000
"@

$frontendCmd = @"
`$Host.UI.RawUI.WindowTitle = 'Nexus ISP - Frontend'
Set-Location '$Frontend'
Write-Host 'Frontend en http://localhost:3000' -ForegroundColor Green
npm run dev
"@

Start-Process powershell -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-Command", $backendCmd | Out-Null
Start-Sleep -Seconds 4
Start-Process powershell -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-Command", $frontendCmd | Out-Null

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Sistema iniciado" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Panel:    http://localhost:3000" -ForegroundColor White
Write-Host "  API:      http://localhost:8000" -ForegroundColor White
Write-Host "  Usuario:  admin" -ForegroundColor White
Write-Host "  Password: admin123" -ForegroundColor White
Write-Host ""
Write-Host "  Deje abiertas las ventanas Backend y Frontend." -ForegroundColor DarkGray
Write-Host "  Para detener: cierre esas ventanas o Ctrl+C en cada una." -ForegroundColor DarkGray
Write-Host ""

Start-Sleep -Seconds 6
Start-Process "http://localhost:3000" | Out-Null

Read-Host "Presione Enter para cerrar esta ventana (los servicios siguen en las otras)"
