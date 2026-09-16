# NAS Computer

## 📌 Descripción

Backend de NAS Computer construido con NestJS. Su objetivo es centralizar la autenticación,
el catálogo, el inventario y las futuras operaciones de la tienda, reemplazando la lógica
temporal del frontend.

La API utiliza PostgreSQL mediante Prisma y todas sus rutas tienen el prefijo `/api`.

## 🛠️ Tecnologías

- **NestJS 11** y **TypeScript** para la API.
- **Prisma 6** y **PostgreSQL** para persistencia.
- **JWT** y Passport para autenticación.
- **bcrypt** para almacenar contraseñas como hashes.
- **class-validator** y **class-transformer** para validar y transformar solicitudes.
- **Helmet**, CORS y throttling para protecciones HTTP básicas.
- **ESLint** y **Prettier** para mantener la calidad del código.

## 📁 Estructura

```text
backend/
├── prisma/
│   ├── schema.prisma       # Modelo de datos
│   ├── migrations/         # Historial versionado de cambios
│   └── seed.cjs            # Administrador y datos iniciales
└── src/
	 ├── common/             # Decoradores, guards y utilidades compartidas
	 ├── database/           # PrismaService y módulo de base de datos
	 ├── modules/
	 │   ├── auth/           # Registro, login, JWT y perfil
	 │   ├── categories/     # CRUD de categorías
	 │   └── products/       # Consulta y CRUD del catálogo
	 ├── app.module.ts       # Configuración principal y módulos registrados
	 ├── main.ts             # Prefijo, CORS, Helmet y validación global
	 └── ...
```

Cada módulo agrupa su controller, service y DTO. El modelo actual incluye `User`, `Category`
y `Product`, con roles `CUSTOMER` y `ADMIN`.

## ⚙️ Instalación

Ejecuta los comandos desde la carpeta `backend`:

```bash
npm install
copy .env.example .env
```

En PowerShell, el segundo comando equivalente es:

```powershell
Copy-Item .env.example .env
```

Antes de arrancar, completa el archivo `.env` y asegúrate de que PostgreSQL esté disponible.

## 🗄️ Configuración de base de datos

Se necesitan dos bases PostgreSQL: una principal y otra para el shadow database de Prisma.
El usuario configurado en las URLs debe tener permisos suficientes para conectarse y crear
la base shadow.

El repositorio ya contiene migraciones versionadas. Para preparar un entorno local:

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

`prisma:migrate` aplica migraciones pendientes y, si se modificó el esquema, puede crear una
nueva migración. Para desplegar únicamente migraciones existentes usa:

```bash
npx prisma migrate deploy
```

El seed crea o actualiza el administrador definido en `ADMIN_EMAIL` y `ADMIN_PASSWORD`, y
carga las categorías y productos iniciales. No se deben subir credenciales reales al repositorio.

## 🔐 Variables de entorno

El archivo `.env.example` contiene la plantilla oficial:

```env
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5173
DATABASE_URL="postgresql://nas_user:change_me@localhost:5432/nas_computer?schema=public"
SHADOW_DATABASE_URL="postgresql://nas_user:change_me@localhost:5432/nas_computer_shadow?schema=public"
JWT_ACCESS_SECRET="genera-un-secreto-aleatorio-de-al-menos-32-caracteres"
JWT_ACCESS_EXPIRES_IN=15m
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD="UnaClaveSegura123"
```

| Variable | Uso |
| --- | --- |
| `NODE_ENV` | Entorno: `development`, `test` o `production`. |
| `PORT` | Puerto HTTP de la API; por defecto `3000`. |
| `FRONTEND_URL` | Origen permitido por CORS; por defecto `http://localhost:5173`. |
| `DATABASE_URL` | Conexión a la base principal. Es obligatoria. |
| `SHADOW_DATABASE_URL` | Conexión usada por Prisma en migraciones. Es obligatoria. |
| `JWT_ACCESS_SECRET` | Secreto para firmar tokens; mínimo 32 caracteres. |
| `JWT_ACCESS_EXPIRES_IN` | Duración del token; por defecto `15m`. |
| `ADMIN_EMAIL` | Correo del administrador creado por el seed. |
| `ADMIN_PASSWORD` | Contraseña del administrador creado por el seed. |

La aplicación valida las variables obligatorias al iniciar. `FRONTEND_URL` debe coincidir
con el origen desde el que se ejecuta el frontend.

## ▶️ Ejecutar el proyecto

Para desarrollo, con recarga automática:

```bash
npm run start:dev
```

La API estará disponible en `http://localhost:3000/api`.

Comandos adicionales:

```bash
npm run build  # Compila el backend en dist/
npm run start  # Ejecuta la compilación de dist/
npm run lint   # Revisa src/**/*.ts
```

## 🔌 Backend - Endpoints disponibles

Las rutas de administración requieren `Authorization: Bearer <accessToken>` y el rol `ADMIN`.
Todas las respuestas y errores se envían en JSON.

### Autenticación

| Método | Ruta | Acceso | Descripción |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Público | Crea una cuenta `CUSTOMER`. |
| `POST` | `/api/auth/login` | Público | Devuelve un `accessToken`. |
| `GET` | `/api/auth/me` | JWT | Devuelve el perfil autenticado. |

El registro exige nombre, correo válido y una contraseña de mínimo 12 caracteres con minúscula,
mayúscula y número. Los administradores sólo se crean mediante el seed.

### Categorías

| Método | Ruta | Acceso | Descripción |
| --- | --- | --- | --- |
| `GET` | `/api/categories` | Público | Lista categorías. |
| `POST` | `/api/categories` | ADMIN | Crea una categoría. |
| `PATCH` | `/api/categories/:id` | ADMIN | Actualiza una categoría. |
| `DELETE` | `/api/categories/:id` | ADMIN | Elimina una categoría; responde `204`. |

`name` es obligatorio. `slug`, `icon` y `description` son opcionales; el slug se genera a
partir del nombre cuando no se envía.

### Productos

| Método | Ruta | Acceso | Descripción |
| --- | --- | --- | --- |
| `GET` | `/api/products` | Público | Lista productos activos. Acepta `search` y `category` por slug. |
| `GET` | `/api/products/:idOrSlug` | Público | Busca por ID o slug. |
| `GET` | `/api/products/admin` | ADMIN | Lista también productos inactivos. |
| `POST` | `/api/products` | ADMIN | Crea un producto. |
| `PATCH` | `/api/products/:id` | ADMIN | Actualiza un producto. |
| `DELETE` | `/api/products/:id` | ADMIN | Elimina un producto; responde `204`. |

Para crear un producto son obligatorios `name`, `price` y `categoryId`. El precio, el stock y
el stock mínimo no pueden ser negativos. La categoría indicada debe existir.

Ejemplo mínimo:

```json
{
  "name": "Teclado mecánico",
  "price": 79.99,
  "categoryId": "id-de-la-categoria",
  "stock": 10,
  "minimumStock": 2
}
```

## 📊 Estado actual del backend

| Área | Estado | Notas |
| --- | --- | --- |
| Configuración NestJS | ✅ Implementada | Prefijo `/api`, CORS, Helmet y validación global. |
| Usuarios y autenticación | ✅ Implementada | Registro CUSTOMER, login, perfil JWT y roles. |
| Categorías | ✅ Implementada | Consulta pública y CRUD protegido para ADMIN. |
| Productos | ✅ Implementada | Consulta pública, filtros, CRUD ADMIN y productos activos/inactivos. |
| Base de datos | ✅ Implementada | Prisma, PostgreSQL, migraciones y seed inicial. |
| Pruebas automatizadas | ⚠️ Pendiente | No hay suite de pruebas configurada actualmente. |
| Documentación OpenAPI | ⚠️ Pendiente | Todavía no se ha integrado Swagger. |

## 🚧 Pendientes

Los siguientes módulos están previstos, pero todavía no están implementados en la API:

- `users`: administración de usuarios y activación/desactivación.
- `inventory`: movimientos, ajustes y alertas de stock mínimo.
- `promotions`: descuentos y reglas de ofertas.
- `banners`: gestión de banners del inicio.
- `quotes`: solicitudes y seguimiento de cotizaciones.
- `uploads`: carga y almacenamiento de imágenes.
- Pruebas unitarias, pruebas e2e y documentación Swagger.

## 👨‍💻 Guía para continuar el desarrollo

1. Crear el módulo en `src/modules/<dominio>` con DTO, controller, service y módulo propio.
2. Añadir el módulo a `src/app.module.ts`.
3. Añadir o actualizar los modelos en `prisma/schema.prisma` cuando corresponda.
4. Crear la migración con `npm run prisma:migrate -- --name descripcion-del-cambio`.
5. Proteger operaciones administrativas con `JwtAuthGuard`, `RolesGuard` y
	`@Roles(Role.ADMIN)`.
6. Mantener la validación de DTO; la aplicación rechaza campos no declarados.
7. Ejecutar `npm run lint` y `npm run build` antes de entregar el cambio.

El frontend no debe ser la fuente de verdad para permisos, usuarios ni stock. Las reglas de
negocio deben vivir en los services del backend y validarse también en la base de datos cuando
sea posible.

## 🌿 Flujo de trabajo con Git

1. Actualizar la rama base antes de empezar:

	```bash
	git pull origin main
	```

2. Crear una rama descriptiva:

	```bash
	git switch -c feature/nombre-del-modulo
	```

3. Trabajar en cambios pequeños y no subir `.env`, contraseñas ni secretos.
4. Ejecutar `npm run lint`, `npm run build` y las pruebas disponibles.
5. Revisar los cambios y crear un commit claro:

	```bash
	git status
	git diff
	git add .
	git commit -m "feat: agrega modulo de inventario"
	```

6. Publicar la rama y abrir un Pull Request hacia `main`:

	```bash
	git push -u origin feature/nombre-del-modulo
	```

Si el cambio modifica Prisma, el commit debe incluir `schema.prisma` y la nueva carpeta de
migración. Nunca se deben editar o eliminar migraciones ya aplicadas en otros entornos.
