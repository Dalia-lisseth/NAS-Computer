# NAS Computer API

Backend inicial en NestJS para reemplazar la lógica temporal del frontend.

## Primer arranque

1. Copia `.env.example` como `.env` y define `DATABASE_URL` y un secreto JWT aleatorio de al menos 32 caracteres.
2. Instala dependencias con `npm install`.
3. Crea la base PostgreSQL y ejecuta `npm run prisma:migrate -- --name init`.
4. Define `ADMIN_EMAIL` y `ADMIN_PASSWORD` (mínimo 12 caracteres) y ejecuta `npm run prisma:seed`.
5. Inicia la API con `npm run start:dev`.

La API queda en `http://localhost:3000/api`.

## Endpoints iniciales

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` con `Authorization: Bearer <accessToken>`

El registro público crea sólo cuentas `CUSTOMER`. Los administradores se crean por el seed,
nunca desde un endpoint público. El siguiente paso es crear los módulos de catálogo, inventario,
promociones, banners y cotizaciones sobre este mismo patrón.
