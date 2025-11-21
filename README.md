# API para Visualización Interactiva de Redes de Networking en 4Life

## Descripción del Proyecto

Este proyecto desarrolla una API REST acompañada de una interfaz web interactiva que permite a los distribuidores de la red de mercadeo multinivel 4Life visualizar de forma clara y dinámica la estructura de su red de afiliados.

## Tecnologías Utilizadas

### Backend
- **Node.js** - Entorno de ejecución
- **Express.js** - Framework web
- **PostgreSQL** - Base de datos relacional
- **Swagger/OpenAPI** - Documentación de API

### Frontend
- **React.js** - Biblioteca de interfaz de usuario
- **D3.js** - Visualización de datos y gráficos de red
- **Axios** - Cliente HTTP

## Estructura del Proyecto

```
sergio/
├── backend/          # API REST con Node.js y Express
├── frontend/         # Aplicación React.js
├── database/         # Scripts SQL para PostgreSQL
└── README.md         # Este archivo
```

## Requisitos Previos

- Node.js (v16 o superior)
- PostgreSQL (v12 o superior)
- npm o yarn

## Instalación

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

## Configuración

1. Crear base de datos PostgreSQL:
```bash
createdb 4life_network
```

2. Ejecutar scripts de base de datos:
```bash
psql -d 4life_network -f database/schema.sql
psql -d 4life_network -f database/seed.sql
```

3. Configurar variables de entorno en `backend/.env`:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=4life_network
DB_USER=postgres
DB_PASSWORD=tu_password
PORT=3001
```

## Ejecución

### Backend

```bash
cd backend
npm start
```

La API estará disponible en `http://localhost:3001`

### Frontend

```bash
cd frontend
npm start
```

La aplicación estará disponible en `http://localhost:3000`

## Documentación de API

Una vez iniciado el backend, la documentación Swagger estará disponible en:
`http://localhost:3001/api-docs`

## Funcionalidades Principales

### Historias de Usuario Implementadas

- **HU01**: Visualizar la jerarquía de red hasta tres niveles
- **HU02**: Buscar afiliado por nombre o rango
- **HU03**: Importar afiliados desde archivo CSV
- **HU04**: Generar reportes por niveles
- **HU05**: Exportar visualización en formato PDF o CSV

## Nivel de Maduración Tecnológica

Este prototipo cumple con el nivel **TRL5** (Technology Readiness Level 5), demostrando la validación del componente en un entorno relevante.

## Autores

- Sergio Andrés Pérez Riaño
- Monica Alejandra Vasquez Sandoval
- Brandon Mauricio Ramírez Cortes

## Tutor

Ruben Dario Ordoñez

## Licencia

Este proyecto es parte del trabajo de grado del programa de Ingeniería de Sistemas de la Universidad Nacional Abierta y a Distancia (UNAD).
