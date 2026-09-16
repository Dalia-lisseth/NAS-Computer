# NAS Computer

## 📌 Descripción

Frontend de NAS Computer, una tienda de computadores, componentes y accesorios. La aplicación
incluye una experiencia pública de tienda y un panel de administración para gestionar el
catálogo.

Está construido como una SPA (Single Page Application): la navegación entre vistas se gestiona
desde React y no requiere recargar el navegador. El frontend consume la API de NestJS cuando
la funcionalidad ya está conectada al backend y conserva algunos datos locales mientras los
módulos correspondientes todavía están en desarrollo.

## 🛠️ Tecnologías

- **React 19** para construir la interfaz.
- **TypeScript** para la configuración y el punto de entrada de Vite.
- **Vite** como servidor de desarrollo y herramienta de compilación.
- **React DOM** para renderizar la aplicación en el navegador.
- **Lucide React** para los iconos de la interfaz.
- **CSS** organizado en estilos globales, variables, responsive y administración.
- **ESLint** para revisar el código.

## 📁 Estructura

```text
frontend/
├── public/                  # Recursos públicos servidos directamente
├── src/
│   ├── assets/              # Imágenes, logos e iconos importados por la aplicación
│   ├── componentes/
│   │   ├── Administracion/  # Layout, cabecera, barra lateral y modales del admin
│   │   ├── Comunes/         # Botones y componentes reutilizables
│   │   ├── Estructura/      # Encabezado y pie de página de la tienda
│   │   ├── Inicio/          # Componentes de la página de inicio
│   │   ├── Productos/       # Tarjetas y elementos de productos
│   │   └── Seleccion/       # Drawer y componentes de la selección
│   ├── contextos/           # Estado global de autenticación, productos y selección
│   ├── datos/               # Datos locales temporales del catálogo y banners
│   ├── estilos/             # Variables, estilos globales, admin y responsive
│   ├── ganchos/             # Hooks reutilizables
│   ├── paginas/
│   │   ├── cliente/         # Inicio, catálogo, ofertas, contacto y solicitudes
│   │   └── administracion/  # Dashboard y vistas del panel administrativo
│   ├── rutas/               # Navegación y selección de vistas
│   ├── servicios/           # Cliente HTTP y servicios de dominio
│   └── utilidades/          # Formateo, validaciones y mensajes
├── App.tsx                  # Proveedores globales y composición principal
├── index.html               # Documento HTML de entrada
└── vite.config.ts           # Configuración de Vite
```

Cada vista o componente debe respetar esta separación. El estado compartido se mantiene en
`contextos` y las llamadas a la API en `servicios`.

## ⚙️ Instalación

Requisitos:

- Node.js y npm.
- Backend de NAS Computer iniciado si se desea probar la integración con la API.

Desde la carpeta `frontend`:

```bash
npm install
```

El frontend no necesita una base de datos propia. La persistencia del catálogo y de las cuentas
corresponde al backend.

## 🗄️ Configuración de base de datos

El frontend no se conecta directamente a PostgreSQL. Todas las operaciones persistentes deben
pasar por el backend mediante HTTP.

Para trabajar con el sistema completo:

1. Configura y levanta PostgreSQL y el backend siguiendo `backend/README.md`.
2. Verifica que la API esté disponible en `http://localhost:3000/api`.
3. Configura `VITE_API_URL` sólo si la API está en otra dirección.
4. Inicia el frontend con `npm run dev`.

## 🔐 Variables de entorno

La URL de la API se define con `VITE_API_URL`. Si no existe, el cliente usa:

```text
http://localhost:3000/api
```

Para usar otra dirección, crea `frontend/.env.local`:

```env
VITE_API_URL=http://localhost:3000/api
```

Las variables que empiezan por `VITE_` quedan disponibles en el código del navegador. No se
deben colocar contraseñas, tokens privados ni credenciales de base de datos en este archivo.

## ▶️ Ejecutar el proyecto

Desde `frontend`:

```bash
npm run dev
```

Vite mostrará la URL local, normalmente `http://localhost:5173`.

Comandos adicionales:

```bash
npm run build    # Comprueba tipos y genera dist/
npm run lint     # Revisa el código del frontend
npm run preview  # Sirve localmente la compilación de dist/
```

Para una experiencia completa, ejecutar también el backend en `http://localhost:3000` y
mantener `FRONTEND_URL=http://localhost:5173` en su configuración CORS.

## 🔌 Backend - Endpoints disponibles

El cliente HTTP central está en `src/servicios/clienteApi.js`. Envía JSON cuando hay un body,
añade automáticamente el header `Authorization: Bearer <token>` cuando recibe un token y
convierte los errores de la API en excepciones con mensaje y código HTTP.

Actualmente están conectados estos servicios:

| Servicio | Rutas principales | Uso en el frontend |
| --- | --- | --- |
| Autenticación | `/auth/register`, `/auth/login` | Registro, login de clientes y acceso administrativo. |
| Categorías | `/categories` | Consulta y administración del catálogo. |
| Productos | `/products`, `/products/admin` | Catálogo público y gestión administrativa. |

El backend exige JWT para las operaciones administrativas. El frontend guarda la sesión actual
en `sessionStorage` bajo la clave `nas_sesion`; si el token está vencido, la sesión se descarta.
El rol se normaliza para usar `customer` o `admin` en la interfaz.

## 📊 Estado actual del frontend

| Área | Estado | Notas |
| --- | --- | --- |
| Tienda pública | ✅ Implementada | Inicio, catálogo, categorías, ofertas, contacto y selección. |
| Autenticación | ✅ Implementada | Registro, login, logout y control de sesión en el navegador. |
| Catálogo conectado | ✅ Implementado | Productos y categorías usan servicios de la API. |
| Panel administrativo | ✅ Implementado | Dashboard, productos, inventario, categorías, ofertas, solicitudes y banners. |
| Responsive | ✅ Implementado | Estilos específicos para diferentes tamaños de pantalla. |
| Solicitudes de cotización | ⚠️ Parcial | La vista existe; falta completar la integración con el módulo backend. |
| Inventario, ofertas y banners | ⚠️ Parcial | Existen vistas, pero algunas operaciones siguen usando datos o lógica local. |
| Pruebas automatizadas | ⚠️ Pendiente | No hay suite de pruebas configurada actualmente. |

## 🚧 Pendientes

- Conectar completamente solicitudes, inventario, promociones y banners con la API.
- Reemplazar datos locales de `src/datos` cuando el backend de cada dominio esté disponible.
- Añadir manejo común de expiración de sesión y respuestas `401`.
- Incorporar estados de carga, error y vacío consistentes en todas las vistas.
- Añadir pruebas de componentes y flujos principales.
- Añadir documentación de componentes y, si el proyecto crece, separar tipos compartidos.


## 🌿 Flujo de trabajo con Git

1. Actualizar la rama base:

   ```bash
   git pull origin main
   ```

2. Crear una rama descriptiva:

   ```bash
   git switch -c feature/nombre-de-la-funcionalidad
   ```

3. Realizar cambios pequeños y evitar subir `.env`, `.env.local` o credenciales.
4. Probar el flujo visual en móvil y escritorio cuando el cambio afecte estilos o layout.
5. Ejecutar las validaciones:

   ```bash
   npm run lint
   npm run build
   ```

6. Revisar y confirmar los cambios:

   ```bash
   git status
   git diff
   git add .
   git commit -m "feat: conecta solicitudes con la api"
   ```

7. Publicar la rama y abrir un Pull Request hacia `main`:

   ```bash
   git push -u origin feature/nombre-de-la-funcionalidad
   ```

Si un cambio del frontend depende de un endpoint nuevo, coordinarlo con el backend y documentar
el contrato esperado antes de integrar ambas ramas.
