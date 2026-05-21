# Plataforma Nexus ISP

Sistema base para gestion de clientes, pagos y estado de servicio para un ISP con Starlink.

## Stack implementado

- Frontend: `Next.js` + `TypeScript` + `Tailwind CSS`
- Backend: `FastAPI` + `SQLModel` + `Pydantic`
- Base de datos: `PostgreSQL`
- Cache/infra: `Redis`
- Orquestacion local: `Docker Compose`

## Modulos disponibles (MVP)

- Login administrativo por JWT
- Registro y listado de clientes
- Registro de pagos
- Control de vencimiento y suspension automatica por impago
- Dashboard con metricas:
  - clientes activos
  - clientes suspendidos
  - pagos pendientes
  - total cobrado del mes

## Estructura del proyecto

```txt
backend/
  app/
    routers/
frontend/
docker-compose.yml
```

## Variables de entorno

1. Copiar `backend/.env.example` a `backend/.env`
2. Copiar `frontend/.env.example` a `frontend/.env`

## Ejecucion local sin Docker (laptop del cliente)

**Inicio rapido:** doble clic en `INICIAR.bat` en la raiz del proyecto.

Requisitos en la maquina:

- **Python 3.12+** (con “Add to PATH”)
- **Node.js 20+** LTS
- Internet solo la primera vez (instala dependencias)

No requiere Docker ni PostgreSQL: usa SQLite en `backend/data/nexus.db`.

Guia detallada para el cliente: [INSTALACION_CLIENTE.md](INSTALACION_CLIENTE.md)

Credenciales del panel: usuario `admin`, password `admin123`.

URLs:

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:8000](http://localhost:8000)
- Docs API: [http://localhost:8000/docs](http://localhost:8000/docs)

### Inicio manual (opcional)

```powershell
powershell -ExecutionPolicy Bypass -File scripts\iniciar.ps1
```

### PostgreSQL local (opcional)

Si prefiere PostgreSQL en lugar de SQLite, en `backend/.env`:

```env
DATABASE_URL="postgresql+psycopg://postgres:postgres@localhost:5432/nexus_isp"
```

Cree la base `nexus_isp` antes de iniciar.

## Ejecucion local con Docker

```bash
docker compose up --build
```

Con Docker, el host de la base de datos es `db`, no `localhost`. Use en `backend/.env`:

```env
DATABASE_URL="postgresql+psycopg://postgres:postgres@db:5432/nexus_isp"
```

Servicios (mismas URLs que arriba):

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:8000](http://localhost:8000)
- Docs API: [http://localhost:8000/docs](http://localhost:8000/docs)

## Credenciales iniciales

- Usuario: `admin`
- Password: `admin123`

> Cambie estas credenciales en `backend/.env` antes de usar en produccion.

## Endpoints principales

- `POST /api/auth/login`
- `GET /api/clients`
- `POST /api/clients`
- `GET /api/payments`
- `POST /api/payments`
- `GET /api/payments/pending`
- `GET /api/dashboard/stats`

## Proximos pasos recomendados

- Agregar Alembic para migraciones versionadas
- Implementar usuarios multiples y roles
- Integrar notificaciones de vencimiento (WhatsApp/Email)
- Separar frontend en modulos y agregar UI con shadcn/ui
- Crear pruebas automatizadas (backend + frontend)
