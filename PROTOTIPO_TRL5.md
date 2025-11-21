# Prototipo Funcional TRL5 - API para Visualización Interactiva de Redes de Networking en 4Life

## Resumen del Prototipo

Este documento describe el prototipo funcional desarrollado según las especificaciones del proyecto de grado "API para visualización interactiva de redes de networking en 4Life", cumpliendo con el nivel de maduración tecnológica TRL5 (Technology Readiness Level 5).

## Componentes Implementados

### 1. Backend - API REST

**Tecnologías:**
- Node.js v16+
- Express.js
- PostgreSQL
- Swagger/OpenAPI para documentación

**Endpoints Implementados:**

#### Afiliados
- `GET /api/affiliates` - Obtener todos los afiliados
- `GET /api/affiliates/:id` - Obtener afiliado por ID
- `GET /api/affiliates/search?q=termino` - Buscar afiliados
- `GET /api/affiliates/:id/hierarchy?maxLevel=3` - Obtener jerarquía (HU01)
- `GET /api/affiliates/:id/descendants` - Obtener descendientes
- `GET /api/affiliates/:id/report` - Reporte por niveles (HU04)
- `GET /api/affiliates/ranks` - Obtener rangos
- `POST /api/affiliates` - Crear afiliado
- `PUT /api/affiliates/:id` - Actualizar afiliado
- `DELETE /api/affiliates/:id` - Eliminar afiliado

#### CSV
- `POST /api/csv/import` - Importar afiliados desde CSV (HU03)
- `GET /api/csv/export?id=123` - Exportar a CSV (HU05)

**Características:**
- Consultas jerárquicas optimizadas usando CTE recursivas
- Vista materializada para mejorar rendimiento
- Validación de datos
- Manejo de errores robusto
- Documentación Swagger completa

### 2. Base de Datos PostgreSQL

**Modelo de Datos:**
- Tabla `ranks`: Rangos jerárquicos
- Tabla `affiliates`: Afiliados con relaciones padre-hijo
- Vista materializada `affiliate_hierarchy`: Optimización de consultas
- Índices para mejorar rendimiento
- Triggers para actualización automática

**Características:**
- Modelo jerárquico eficiente
- Soporte para consultas recursivas
- Integridad referencial
- Datos de ejemplo incluidos

### 3. Frontend - Aplicación React.js

**Tecnologías:**
- React.js 18
- React Router
- D3.js para visualización
- Axios para comunicación con API

**Páginas Implementadas:**

#### Dashboard
- Vista general del sistema
- Estadísticas de afiliados
- Accesos rápidos a funcionalidades principales

#### Visualización de Red (NetworkView)
- Visualización jerárquica interactiva usando D3.js (HU01)
- Control de niveles máximos (1-5)
- Información detallada de cada nodo
- Exportación a PDF y CSV (HU05)

#### Búsqueda (Search)
- Búsqueda por nombre, código o rango (HU02)
- Resultados en tabla
- Acceso rápido a visualización de red

#### Importación (Import)
- Importación de afiliados desde CSV (HU03)
- Validación de datos
- Plantilla descargable
- Reporte de errores

#### Reportes (Reports)
- Reportes por niveles (HU04)
- Estadísticas agregadas
- Exportación a PDF

**Características:**
- Interfaz moderna y responsive
- Visualización interactiva con D3.js
- Manejo de estados y errores
- Diseño intuitivo

## Historias de Usuario Implementadas

### HU01: Visualizar jerarquía de red hasta tres niveles ✅
- Implementado en `/network/:id`
- Visualización interactiva con D3.js
- Control de niveles máximos (configurable)

### HU02: Buscar afiliado por nombre o rango ✅
- Implementado en `/search`
- Búsqueda por nombre, código o rango
- Resultados con información completa

### HU03: Importar afiliados desde CSV ✅
- Implementado en `/import`
- Validación de datos
- Manejo de errores detallado
- Plantilla disponible

### HU04: Generar reportes por niveles ✅
- Implementado en `/reports/:id`
- Estadísticas por nivel
- Resumen agregado

### HU05: Exportar visualización en PDF o CSV ✅
- Exportación CSV implementada
- Exportación PDF preparada (estructura lista)

## Nivel TRL5 - Validación en Entorno Relevante

Este prototipo cumple con TRL5 porque:

1. **Componentes validados**: Todos los componentes principales (API, BD, Frontend) están implementados y funcionando
2. **Entorno relevante**: Utiliza tecnologías de producción (PostgreSQL, Node.js, React)
3. **Integración completa**: Backend y frontend integrados y comunicándose correctamente
4. **Funcionalidad básica**: Todas las historias de usuario principales están implementadas
5. **Documentación**: Incluye documentación Swagger y guías de instalación

## Arquitectura

```
┌─────────────────┐
│   Frontend      │
│   React.js      │
│   D3.js         │
└────────┬────────┘
         │ HTTP/REST
         │
┌────────▼────────┐
│   Backend       │
│   Node.js       │
│   Express.js    │
└────────┬────────┘
         │ SQL
         │
┌────────▼────────┐
│   PostgreSQL    │
│   Database      │
└─────────────────┘
```

## Próximos Pasos para TRL6

Para alcanzar TRL6 (Sistema validado en entorno operacional), se recomienda:

1. Pruebas de carga y rendimiento
2. Implementación completa de exportación PDF
3. Autenticación y autorización
4. Logging y monitoreo
5. Despliegue en producción
6. Pruebas con usuarios reales

## Instalación y Uso

Ver `INSTALLATION.md` para instrucciones detalladas de instalación.

## Documentación

- API: `http://localhost:3001/api-docs` (cuando el backend está corriendo)
- README principal: `README.md`
- Guía de instalación: `INSTALLATION.md`

## Autores

- Sergio Andrés Pérez Riaño
- Monica Alejandra Vasquez Sandoval
- Brandon Mauricio Ramírez Cortes

## Tutor

Ruben Dario Ordoñez

## Fecha

Noviembre 2024

