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

## Ejecucion local con Docker

```bash
docker compose up --build
```

Servicios:

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
