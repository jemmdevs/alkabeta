# AlkaBeta - Red Social

Una aplicación de red social simple desarrollada con Next.js 15, MongoDB y NextAuth.

## Características

- Autenticación de usuarios (registro e inicio de sesión)
- Creación, edición y eliminación de posts
- Sistema de likes en los posts
- Perfiles de usuario
- Búsqueda de usuarios

## Tecnologías utilizadas

- **Frontend**: Next.js 15, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Base de datos**: MongoDB
- **Autenticación**: NextAuth.js

## Requisitos previos

- Node.js (versión 18.x o superior)
- NPM o Yarn
- Cuenta de MongoDB Atlas (o MongoDB local)

## Configuración

1. Clona este repositorio:
   ```bash
   git clone https://github.com/tu-usuario/alkabeta.git
   cd alkabeta
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:
   ```
   MONGODB_URI=tu_url_de_mongodb
   NEXTAUTH_SECRET=tu_secreto_para_nextauth
   NEXTAUTH_URL=http://localhost:3000
   ```

4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

5. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Estructura del proyecto

- `app/` - Directorio principal de la aplicación (Next.js 15 App Router)
  - `api/` - API endpoints
  - `auth/` - Páginas de autenticación
  - `profile/` - Perfiles de usuario
  - `search/` - Búsqueda de usuarios
- `components/` - Componentes reutilizables
- `lib/` - Utilidades y funciones auxiliares
- `models/` - Modelos de datos para MongoDB
- `public/` - Archivos estáticos

## Licencia

Este proyecto está bajo la Licencia MIT.
