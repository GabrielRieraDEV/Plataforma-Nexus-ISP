# Instalación en laptop del cliente (sin Docker)

Guía para dejar la plataforma funcionando en Windows con un solo clic.

## Requisitos (instalar una sola vez)

1. **Python 3.12 o superior**  
   https://www.python.org/downloads/  
   Durante la instalación, marque **“Add python.exe to PATH”**.

2. **Node.js LTS (20 o superior)**  
   https://nodejs.org/  
   Instale la versión LTS recomendada.

3. **Conexión a internet** (solo la primera vez, para descargar dependencias).

No hace falta Docker ni PostgreSQL: la base de datos se guarda en `backend/data/nexus.db`.

## Cómo iniciar la plataforma

1. Copie la carpeta completa del proyecto a la laptop.
2. Haga doble clic en **`INICIAR.bat`** (en la raíz del proyecto).
3. Espere a que termine la instalación (la primera vez puede tardar varios minutos).
4. Se abrirán dos ventanas (Backend y Frontend) y el navegador en el panel.

## Acceso al panel

| Campo    | Valor      |
|----------|------------|
| URL      | http://localhost:3000 |
| Usuario  | `admin`    |
| Contraseña | `admin123` |

## Detener el sistema

Cierre las ventanas de PowerShell tituladas **“Nexus ISP - Backend”** y **“Nexus ISP - Frontend”**, o pulse `Ctrl+C` en cada una.

## Problemas frecuentes

**“No se encontró Python”**  
Reinstale Python marcando “Add to PATH” y reinicie el equipo.

**“No se encontró Node.js”**  
Instale Node.js LTS y reinicie el equipo.

**El navegador no abre o muestra error**  
Espere 30–60 segundos tras el primer inicio y abra manualmente: http://localhost:3000

**Puerto en uso (3000 o 8000)**  
Cierre otras aplicaciones que usen esos puertos o reinicie el equipo.

## Datos

Los clientes y pagos quedan guardados en:

`backend/data/nexus.db`

Copie ese archivo para respaldar la información antes de mover la laptop.

## Credenciales en producción

Antes de uso real, cambie en `backend/.env`:

- `ADMIN_PASSWORD`
- `JWT_SECRET`
