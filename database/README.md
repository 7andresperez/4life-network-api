# Scripts de Base de Datos

Este directorio contiene los scripts SQL necesarios para configurar la base de datos del proyecto.

## Archivos

### schema.sql
Contiene la definición del esquema de la base de datos:
- Tabla `ranks`: Almacena los rangos de afiliados
- Tabla `affiliates`: Almacena la información de los afiliados con relaciones jerárquicas
- Vista materializada `affiliate_hierarchy`: Optimiza las consultas jerárquicas
- Índices para mejorar el rendimiento
- Triggers para actualización automática de timestamps

### seed.sql
Contiene datos de ejemplo para pruebas:
- Rangos predefinidos de 4Life
- Afiliados de ejemplo con estructura jerárquica de 4 niveles
- Datos que permiten probar todas las funcionalidades

## Uso

### Ejecutar esquema completo:

```bash
psql -U postgres -d 4life_network -f database/schema.sql
```

### Ejecutar datos de ejemplo:

```bash
psql -U postgres -d 4life_network -f database/seed.sql
```

### Ejecutar ambos:

```bash
psql -U postgres -d 4life_network -f database/schema.sql
psql -U postgres -d 4life_network -f database/seed.sql
```

## Estructura de Datos

### Rangos (ranks)
- `id`: Identificador único
- `name`: Nombre del rango (Distribuidor, Bronce, Plata, Oro, Platino, Diamante, Doble Diamante)
- `level`: Nivel jerárquico del rango
- `min_points`: Puntos mínimos requeridos
- `description`: Descripción del rango

### Afiliados (affiliates)
- `id`: Identificador único
- `code`: Código único del afiliado
- `name`: Nombre completo
- `email`: Correo electrónico
- `phone`: Teléfono
- `rank_id`: Referencia al rango
- `points`: Puntos acumulados
- `parent_id`: Referencia al afiliado padre (NULL para raíz)
- `created_at`: Fecha de creación
- `updated_at`: Fecha de última actualización

## Consultas Útiles

### Ver todos los afiliados:

```sql
SELECT a.*, r.name as rank_name 
FROM affiliates a 
LEFT JOIN ranks r ON a.rank_id = r.id 
ORDER BY a.name;
```

### Ver jerarquía de un afiliado:

```sql
WITH RECURSIVE hierarchy AS (
  SELECT id, code, name, parent_id, 0 as level
  FROM affiliates
  WHERE id = 1
  
  UNION ALL
  
  SELECT a.id, a.code, a.name, a.parent_id, h.level + 1
  FROM affiliates a
  INNER JOIN hierarchy h ON a.parent_id = h.id
  WHERE h.level < 3
)
SELECT * FROM hierarchy ORDER BY level, name;
```

### Refrescar vista materializada:

```sql
REFRESH MATERIALIZED VIEW CONCURRENTLY affiliate_hierarchy;
```

