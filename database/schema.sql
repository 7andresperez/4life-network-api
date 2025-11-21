-- Base de datos para visualización de redes de networking en 4Life
-- Modelo jerárquico de afiliados

-- Tabla de Rangos
CREATE TABLE IF NOT EXISTS ranks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    level INTEGER NOT NULL,
    min_points INTEGER NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Afiliados
CREATE TABLE IF NOT EXISTS affiliates (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    rank_id INTEGER REFERENCES ranks(id),
    points INTEGER DEFAULT 0,
    parent_id INTEGER REFERENCES affiliates(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar rendimiento en consultas jerárquicas
CREATE INDEX IF NOT EXISTS idx_affiliates_parent_id ON affiliates(parent_id);
CREATE INDEX IF NOT EXISTS idx_affiliates_rank_id ON affiliates(rank_id);
CREATE INDEX IF NOT EXISTS idx_affiliates_code ON affiliates(code);
CREATE INDEX IF NOT EXISTS idx_affiliates_name ON affiliates(name);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at
CREATE TRIGGER update_affiliates_updated_at BEFORE UPDATE ON affiliates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Vista materializada para consultas jerárquicas optimizadas
CREATE MATERIALIZED VIEW IF NOT EXISTS affiliate_hierarchy AS
WITH RECURSIVE hierarchy AS (
    -- Nodos raíz (sin padre)
    SELECT 
        id,
        code,
        name,
        rank_id,
        points,
        parent_id,
        0 as level,
        ARRAY[id] as path,
        name as full_path
    FROM affiliates
    WHERE parent_id IS NULL
    
    UNION ALL
    
    -- Nodos hijos
    SELECT 
        a.id,
        a.code,
        a.name,
        a.rank_id,
        a.points,
        a.parent_id,
        h.level + 1,
        h.path || a.id,
        h.full_path || ' > ' || a.name
    FROM affiliates a
    INNER JOIN hierarchy h ON a.parent_id = h.id
    WHERE h.level < 10  -- Limitar profundidad para evitar loops infinitos
)
SELECT * FROM hierarchy;

-- Índice para la vista materializada
CREATE INDEX IF NOT EXISTS idx_hierarchy_parent_id ON affiliate_hierarchy(parent_id);
CREATE INDEX IF NOT EXISTS idx_hierarchy_level ON affiliate_hierarchy(level);

-- Función para refrescar la vista materializada
CREATE OR REPLACE FUNCTION refresh_affiliate_hierarchy()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY affiliate_hierarchy;
END;
$$ LANGUAGE plpgsql;

