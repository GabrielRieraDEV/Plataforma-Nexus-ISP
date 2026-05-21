# Plataforma Nexus ISP - inicio local sin Docker (Windows)
# Uso: doble clic en INICIAR.bat

$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $PSScriptRoot
$Backend = Join-Path $Root "backend"
$Frontend = Join-Path $Root "frontend"
$Templates = Join-Path $PSScriptRoot "templates"
$LogDir = Join-Path $Root "logs"
$LogFile = Join-Path $LogDir "iniciar.log"

if (-not (Test-Path $LogDir)) {
    New-Item -ItemType Directory -Path $LogDir -Force | Out-Null
}

function Log-Line([string]$Text) {
    $line = "[{0}] {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $Text
    Add-Content -Path $LogFile -Value $line -Encoding UTF8
}

function Write-Step([string]$Message) {
    Write-Host ""
    Write-Host ">> $Message" -ForegroundColor Cyan
    Log-Line $Message
}

function Write-Ok([string]$Message) {
    Write-Host "   OK: $Message" -ForegroundColor Green
    Log-Line "OK: $Message"
}

function Stop-WithError([string]$Message) {
    Write-Host ""
    Write-Host "ERROR: $Message" -ForegroundColor Red
    Log-Line "ERROR: $Message"
    Write-Host ""
    Write-Host "Detalle guardado en: $LogFile" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Presione Enter para cerrar"
    exit 1
}

function Find-PythonExe {
    $commands = @(
        @("py", "-3.12", "-c", "import sys; print(sys.executable)"),
        @("py", "-3", "-c", "import sys; print(sys.executable)"),
        @("python", "-c", "import sys; print(sys.executable)")
    )
    foreach ($parts in $commands) {
        $exe = $parts[0]
        $args = $parts[1..($parts.Length - 1)]
        try {
            $out = & $exe @args 2>$null
            if ($LASTEXITCODE -eq 0 -and $out) {
                return ($out | Select-Object -First 1).ToString().Trim()
            }
        } catch {
            Log-Line "Python no encontrado con: $exe"
        }
    }
    return $null
}

function Test-NodeJs {
    try {
        $null = Get-Command node -ErrorAction Stop
        return $true
    } catch {
        return $false
    }
}

function Test-BackendDeps([string]$PythonPath) {
    if (-not (Test-Path $PythonPath)) {
        return $false
    }
    & $PythonPath -c "import uvicorn, fastapi, sqlmodel" 2>$null | Out-Null
    return $LASTEXITCODE -eq 0
}

function Test-FrontendDeps([string]$FrontendPath) {
    $nextModule = Join-Path $FrontendPath "node_modules\next\package.json"
    return Test-Path $nextModule
}

function Wait-ForUrl([string]$Url, [int]$Seconds, [string]$Label) {
    $deadline = (Get-Date).AddSeconds($Seconds)
    $attempt = 0
    while ((Get-Date) -lt $deadline) {
        $attempt++
        try {
            $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 5
            if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 500) {
                return $true
            }
        } catch {
            if ($attempt -eq 1 -or ($attempt % 5) -eq 0) {
                Write-Host "   Esperando $Label..." -ForegroundColor DarkGray
            }
            Start-Sleep -Seconds 3
        }
    }
    return $false
}

function Wait-ForBackend([int]$Seconds = 90) {
    return Wait-ForUrl "http://127.0.0.1:8000/health" $Seconds "API (puerto 8000)"
}

function Wait-ForFrontend([int]$Seconds = 120) {
    return Wait-ForUrl "http://127.0.0.1:3000" $Seconds "panel (puerto 3000)"
}

function Test-PortInUse([int]$Port) {
    $conn = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
    return $null -ne $conn
}

try {
    Clear-Host
    Log-Line "=== Inicio Nexus ISP ==="
    Write-Host "========================================" -ForegroundColor Yellow
    Write-Host "  Plataforma Nexus ISP" -ForegroundColor Yellow
    Write-Host "  Inicio local (sin Docker)" -ForegroundColor Yellow
    Write-Host "========================================" -ForegroundColor Yellow

    Write-Step "Comprobando requisitos"

    $pythonExe = Find-PythonExe
    if (-not $pythonExe) {
        Stop-WithError @"
No se encontro Python 3.12 o superior.
Instale Python desde https://www.python.org/downloads/
Durante la instalacion marque: Add python.exe to PATH
"@
    }
    Write-Ok ("Python: " + $pythonExe)

    if (-not (Test-NodeJs)) {
        Stop-WithError @"
No se encontro Node.js.
Instale Node.js LTS desde https://nodejs.org/
Reinicie el equipo despues de instalar.
"@
    }
    $nodeVersion = node --version 2>$null
    $npmCmd = (Get-Command npm -ErrorAction Stop).Source
    Write-Ok ("Node.js: " + $nodeVersion)

    Write-Step "Configurando variables de entorno"

    $backendEnv = Join-Path $Backend ".env"
    $frontendEnv = Join-Path $Frontend ".env"

    if (-not (Test-Path $backendEnv)) {
        Copy-Item (Join-Path $Templates "backend.env") $backendEnv -Force
        Write-Ok "Creado backend/.env"
    } else {
        Write-Ok "backend/.env ya existe"
    }

    if (-not (Test-Path $frontendEnv)) {
        Copy-Item (Join-Path $Templates "frontend.env") $frontendEnv -Force
        Write-Ok "Creado frontend/.env"
    } else {
        $fe = Get-Content $frontendEnv -Raw
        if ($fe -match "localhost:8000") {
            Copy-Item (Join-Path $Templates "frontend.env") $frontendEnv -Force
            Write-Ok "Actualizado frontend/.env (proxy via Next)"
        } else {
            Write-Ok "frontend/.env ya existe"
        }
    }

    Write-Step "Dependencias del backend"

    $venvDir = Join-Path $Backend ".venv"
    $venvPython = Join-Path $venvDir "Scripts\python.exe"
    $venvPip = Join-Path $venvDir "Scripts\pip.exe"
    $forceInstall = Test-Path (Join-Path $Root "REINSTALAR_DEPS")

    if (-not (Test-Path $venvPython)) {
        & $pythonExe -m venv $venvDir
        if (-not (Test-Path $venvPython)) {
            Stop-WithError "No se pudo crear backend/.venv"
        }
    }

    if ($forceInstall -or -not (Test-BackendDeps $venvPython)) {
        Write-Host "   Descargando paquetes Python (solo si hace falta)..." -ForegroundColor DarkGray
        Push-Location $Backend
        & $venvPip install -r requirements.txt -q
        $pipCode = $LASTEXITCODE
        Pop-Location
        if ($pipCode -ne 0) {
            Stop-WithError "Fallo pip install en backend. Revise internet o el log."
        }
        Write-Ok "Backend instalado"
    } else {
        Write-Ok "Backend ya instalado (sin descargar)"
    }

    Write-Step "Dependencias del frontend"

    if ($forceInstall -or -not (Test-FrontendDeps $Frontend)) {
        Write-Host "   Descargando paquetes npm (solo la primera vez)..." -ForegroundColor DarkGray
        Push-Location $Frontend
        $lockFile = Join-Path $Frontend "package-lock.json"
        if (Test-Path $lockFile) {
            npm ci --no-audit --no-fund
        } else {
            npm install --no-audit --no-fund
        }
        $npmCode = $LASTEXITCODE
        Pop-Location
        if ($npmCode -ne 0) {
            Stop-WithError "Fallo npm en frontend. Revise internet o el log."
        }
        Write-Ok "Frontend instalado"
    } else {
        Write-Ok "Frontend ya instalado (sin descargar)"
    }

    if ($forceInstall -and (Test-Path (Join-Path $Root "REINSTALAR_DEPS"))) {
        Remove-Item (Join-Path $Root "REINSTALAR_DEPS") -Force -ErrorAction SilentlyContinue
    }

    Write-Step "Iniciando servicios"

    $backendScript = Join-Path $LogDir "run-backend.ps1"
    $frontendScript = Join-Path $LogDir "run-frontend.ps1"
    $backendLog = Join-Path $LogDir "backend-error.log"
    $frontendLog = Join-Path $LogDir "frontend-error.log"

    $backendLines = @(
        "`$Host.UI.RawUI.WindowTitle = 'Nexus ISP - Backend'",
        "`$ErrorActionPreference = 'Continue'",
        "Set-Location -LiteralPath '$Backend'",
        "Write-Host 'Iniciando API en http://localhost:8000 ...' -ForegroundColor Cyan",
        "try {",
        "  & '$venvPython' -m uvicorn app.main:app --host 127.0.0.1 --port 8000",
        "} catch {",
        "  `$_ | Out-File -FilePath '$backendLog' -Encoding UTF8",
        "  Write-Host 'ERROR al iniciar backend:' -ForegroundColor Red",
        "  Write-Host `$_ -ForegroundColor Red",
        "}",
        "Read-Host 'Backend detenido. Enter para cerrar'"
    )
    $backendLines | Set-Content -Path $backendScript -Encoding UTF8

    $frontendLines = @(
        "`$Host.UI.RawUI.WindowTitle = 'Nexus ISP - Frontend'",
        "`$ErrorActionPreference = 'Continue'",
        "`$env:Path = '$((Split-Path $npmCmd -Parent));' + `$env:Path",
        "Set-Location -LiteralPath '$Frontend'",
        "Write-Host 'Iniciando panel en http://localhost:3000 ...' -ForegroundColor Cyan",
        "Write-Host 'La primera vez puede tardar 1-2 minutos.' -ForegroundColor DarkGray",
        "try {",
        "  & '$npmCmd' run dev",
        "} catch {",
        "  `$_ | Out-File -FilePath '$frontendLog' -Encoding UTF8",
        "  Write-Host 'ERROR al iniciar frontend:' -ForegroundColor Red",
        "  Write-Host `$_ -ForegroundColor Red",
        "}",
        "Read-Host 'Frontend detenido. Enter para cerrar'"
    )
    $frontendLines | Set-Content -Path $frontendScript -Encoding UTF8

    if (-not (Test-PortInUse 8000)) {
        Start-Process powershell -ArgumentList @(
            "-NoExit",
            "-ExecutionPolicy", "Bypass",
            "-File", $backendScript
        ) | Out-Null
    } else {
        Write-Ok "API ya estaba activa en puerto 8000"
    }

    if (-not (Wait-ForBackend)) {
        Stop-WithError @"
El backend no respondio en http://localhost:8000

Revise la ventana 'Nexus ISP - Backend' o el archivo:
$backendLog
"@
    }
    if (-not (Test-PortInUse 8000)) {
        Write-Ok "API respondiendo en puerto 8000"
    }

    if (-not (Test-PortInUse 3000)) {
        Start-Process powershell -ArgumentList @(
            "-NoExit",
            "-ExecutionPolicy", "Bypass",
            "-File", $frontendScript
        ) | Out-Null
    } else {
        Write-Ok "Panel ya estaba activo en puerto 3000"
    }

    Write-Host "   La primera vez el panel puede tardar hasta 2 minutos..." -ForegroundColor DarkGray
    if (-not (Wait-ForFrontend 120)) {
        Stop-WithError @"
El panel no respondio en http://localhost:3000

Revise la ventana 'Nexus ISP - Frontend'.
Si aparece un error, copielo o revise:
$frontendLog

Espere a ver 'Ready' en esa ventana y abra manualmente:
http://localhost:3000
"@
    }
    Write-Ok "Panel respondiendo en puerto 3000"

    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  Sistema iniciado" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "  Panel:    http://localhost:3000"
    Write-Host "  API:      http://localhost:8000"
    Write-Host "  Usuario:  admin"
    Write-Host "  Password: admin123"
    Write-Host ""
    Write-Host "  Deje abiertas las ventanas Backend y Frontend."
    Write-Host ""

    Log-Line "Servicios iniciados correctamente"

    Start-Process "http://127.0.0.1:3000/login" | Out-Null

    Read-Host "Presione Enter para cerrar esta ventana (los servicios siguen corriendo)"
}
catch {
    $err = $_.Exception.Message
    if ($_.ScriptStackTrace) {
        $err = $err + "`n" + $_.ScriptStackTrace
    }
    Stop-WithError $err
}
