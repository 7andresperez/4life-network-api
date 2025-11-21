-- Datos iniciales para pruebas
-- Rangos de 4Life

INSERT INTO ranks (name, level, min_points, description) VALUES
('Distribuidor', 1, 0, 'Nivel inicial de afiliado'),
('Bronce', 2, 1000, 'Rango bronce'),
('Plata', 3, 5000, 'Rango plata'),
('Oro', 4, 15000, 'Rango oro'),
('Platino', 5, 30000, 'Rango platino'),
('Diamante', 6, 60000, 'Rango diamante'),
('Doble Diamante', 7, 120000, 'Rango doble diamante')
ON CONFLICT (name) DO NOTHING;

-- Afiliados de ejemplo (estructura jerárquica)
-- Nivel 1 (Raíz)
INSERT INTO affiliates (code, name, email, phone, rank_id, points, parent_id) VALUES
('A001', 'Juan Pérez', 'juan.perez@example.com', '3001234567', 6, 65000, NULL)
ON CONFLICT (code) DO NOTHING;

-- Nivel 2
INSERT INTO affiliates (code, name, email, phone, rank_id, points, parent_id) VALUES
('A002', 'María González', 'maria.gonzalez@example.com', '3002345678', 5, 35000, (SELECT id FROM affiliates WHERE code = 'A001')),
('A003', 'Carlos Rodríguez', 'carlos.rodriguez@example.com', '3003456789', 4, 20000, (SELECT id FROM affiliates WHERE code = 'A001')),
('A004', 'Ana Martínez', 'ana.martinez@example.com', '3004567890', 4, 18000, (SELECT id FROM affiliates WHERE code = 'A001'))
ON CONFLICT (code) DO NOTHING;

-- Nivel 3
INSERT INTO affiliates (code, name, email, phone, rank_id, points, parent_id) VALUES
('A005', 'Luis Sánchez', 'luis.sanchez@example.com', '3005678901', 3, 8000, (SELECT id FROM affiliates WHERE code = 'A002')),
('A006', 'Patricia López', 'patricia.lopez@example.com', '3006789012', 3, 7500, (SELECT id FROM affiliates WHERE code = 'A002')),
('A007', 'Roberto Torres', 'roberto.torres@example.com', '3007890123', 2, 3000, (SELECT id FROM affiliates WHERE code = 'A003')),
('A008', 'Laura Ramírez', 'laura.ramirez@example.com', '3008901234', 2, 2500, (SELECT id FROM affiliates WHERE code = 'A003')),
('A009', 'Diego Morales', 'diego.morales@example.com', '3009012345', 2, 2000, (SELECT id FROM affiliates WHERE code = 'A004'))
ON CONFLICT (code) DO NOTHING;

-- Nivel 4
INSERT INTO affiliates (code, name, email, phone, rank_id, points, parent_id) VALUES
('A010', 'Sofía Herrera', 'sofia.herrera@example.com', '3010123456', 1, 800, (SELECT id FROM affiliates WHERE code = 'A005')),
('A011', 'Andrés Castro', 'andres.castro@example.com', '3011234567', 1, 600, (SELECT id FROM affiliates WHERE code = 'A005')),
('A012', 'Carmen Vargas', 'carmen.vargas@example.com', '3012345678', 1, 500, (SELECT id FROM affiliates WHERE code = 'A006'))
ON CONFLICT (code) DO NOTHING;

-- Refrescar vista materializada
SELECT refresh_affiliate_hierarchy();

