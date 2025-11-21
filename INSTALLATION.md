# Guía de Instalación - Prototipo 4Life Network

## Requisitos Previos

### Software Necesario

1. **Node.js** (v16 o superior)
   - Descargar desde: https://nodejs.org/
   - Verificar instalación: `node --version`

2. **PostgreSQL** (v12 o superior)
   - Descargar desde: https://www.postgresql.org/download/
   - Verificar instalación: `psql --version`

3. **Git** (opcional, para clonar el repositorio)
   - Descargar desde: https://git-scm.com/

## Instalación Paso a Paso

### 1. Configuración de la Base de Datos

#### Crear la base de datos:

```bash
# Conectar a PostgreSQL
psql -U postgres

# Crear base de datos
CREATE DATABASE 4life_network;

# Salir de psql
\q
```

#### Ejecutar scripts SQL:

```bash
# Ejecutar esquema
psql -U postgres -d 4life_network -f database/schema.sql

# Ejecutar datos de ejemplo
psql -U postgres -d 4life_network -f database/seed.sql
```

### 2. Configuración del Backend

#### Navegar al directorio backend:

```bash
cd backend
```

#### Instalar dependencias:

```bash
npm install
```

#### Configurar variables de entorno:

Crear archivo `.env` en el directorio `backend/`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=4life_network
DB_USER=postgres
DB_PASSWORD=tu_password_aqui
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

**Nota:** Reemplazar `tu_password_aqui` con tu contraseña de PostgreSQL.

#### Crear directorio para uploads:

```bash
mkdir uploads
```

### 3. Configuración del Frontend

#### Navegar al directorio frontend:

```bash
cd ../frontend
```

#### Instalar dependencias:

```bash
npm install
```

#### Configurar variables de entorno (opcional):

Crear archivo `.env` en el directorio `frontend/`:

```env
REACT_APP_API_URL=http://localhost:3001/api
```

## Ejecución del Prototipo

### Terminal 1 - Backend

```bash
cd backend
npm start
```

El backend estará disponible en: `http://localhost:3001`
Documentación Swagger: `http://localhost:3001/api-docs`

### Terminal 2 - Frontend

```bash
cd frontend
npm start
```

El frontend se abrirá automáticamente en: `http://localhost:3000`

## Verificación

### Verificar que el backend funciona:

1. Abrir navegador en: `http://localhost:3001/health`
2. Debería mostrar: `{"status":"OK","message":"API funcionando correctamente",...}`

### Verificar que el frontend funciona:

1. Abrir navegador en: `http://localhost:3000`
2. Debería mostrar el Dashboard con datos de ejemplo

### Verificar la base de datos:

```bash
psql -U postgres -d 4life_network -c "SELECT COUNT(*) FROM affiliates;"
```

Debería mostrar el número de afiliados insertados.

## Solución de Problemas

### Error de conexión a la base de datos

- Verificar que PostgreSQL esté corriendo
- Verificar credenciales en `.env`
- Verificar que la base de datos existe

### Error al instalar dependencias

- Limpiar caché: `npm cache clean --force`
- Eliminar `node_modules` y `package-lock.json`
- Reinstalar: `npm install`

### Puerto ya en uso

- Cambiar el puerto en `.env` (backend) o en `package.json` (frontend)
- O detener el proceso que está usando el puerto

### Error CORS

- Verificar que `CORS_ORIGIN` en `.env` del backend coincida con la URL del frontend

## Estructura de Archivos CSV para Importación

El archivo CSV debe tener el siguiente formato:

```csv
Código,Nombre,Email,Teléfono,Rango,Puntos,Código Padre
A001,Juan Pérez,juan@example.com,3001234567,Platino,35000,
A002,María González,maria@example.com,3002345678,Oro,20000,A001
```

**Notas:**
- La primera fila debe contener los encabezados
- El código debe ser único
- El código padre debe corresponder a un afiliado existente (vacío para raíz)
- Los rangos deben existir en la base de datos

## Próximos Pasos

1. Revisar la documentación de la API en Swagger
2. Explorar las funcionalidades del frontend
3. Importar datos reales usando CSV
4. Personalizar según necesidades específicas

