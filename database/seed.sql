-- Datos iniciales para pruebas
-- Rangos de 4Life según estructura oficial

INSERT INTO ranks (name, level, min_points, description) VALUES
('Asociado', 1, 100, 'Nivel inicial de afiliado - 100 VP mensual'),
('Constructor', 2, 100, 'Constructor - 3 consumidores preferentes o afiliados'),
('Constructor Elite', 3, 1000, 'Constructor Elite - 1,000 VP en tres primeros niveles'),
('Diamante', 4, 3000, 'Diamante - 3,000 VP en tres primeros niveles'),
('Diamante Elite', 5, 5000, 'Diamante Elite - 5,000 VP en tres primeros niveles'),
('Presidencial', 6, 10000, 'Presidencial - 10,000 VP en tres primeros niveles'),
('Presidencial Elite', 7, 15000, 'Presidencial Elite - 15,000 VP en tres primeros niveles')
ON CONFLICT (name) DO NOTHING;

-- Afiliados de ejemplo (estructura jerárquica)
-- Nivel 1 (Raíz) - Presidencial Elite
INSERT INTO affiliates (code, name, email, phone, rank_id, points, parent_id) VALUES
('A001', 'Juan Pérez', 'juan.perez@example.com', '3001234567', (SELECT id FROM ranks WHERE name = 'Presidencial Elite'), 15000, NULL)
ON CONFLICT (code) DO NOTHING;

-- Nivel 2 - Diamante Elite y Presidencial
INSERT INTO affiliates (code, name, email, phone, rank_id, points, parent_id) VALUES
('A002', 'María González', 'maria.gonzalez@example.com', '3002345678', (SELECT id FROM ranks WHERE name = 'Presidencial'), 10000, (SELECT id FROM affiliates WHERE code = 'A001')),
('A003', 'Carlos Rodríguez', 'carlos.rodriguez@example.com', '3003456789', (SELECT id FROM ranks WHERE name = 'Diamante Elite'), 5000, (SELECT id FROM affiliates WHERE code = 'A001')),
('A004', 'Ana Martínez', 'ana.martinez@example.com', '3004567890', (SELECT id FROM ranks WHERE name = 'Diamante Elite'), 5000, (SELECT id FROM affiliates WHERE code = 'A001')),
('A005', 'Roberto Silva', 'roberto.silva@example.com', '3005678901', (SELECT id FROM ranks WHERE name = 'Diamante'), 3000, (SELECT id FROM affiliates WHERE code = 'A001'))
ON CONFLICT (code) DO NOTHING;

-- Nivel 3 - Constructor Elite y Diamante
INSERT INTO affiliates (code, name, email, phone, rank_id, points, parent_id) VALUES
('A006', 'Luis Sánchez', 'luis.sanchez@example.com', '3006789012', (SELECT id FROM ranks WHERE name = 'Diamante'), 3000, (SELECT id FROM affiliates WHERE code = 'A002')),
('A007', 'Patricia López', 'patricia.lopez@example.com', '3007890123', (SELECT id FROM ranks WHERE name = 'Constructor Elite'), 1000, (SELECT id FROM affiliates WHERE code = 'A002')),
('A008', 'Diego Morales', 'diego.morales@example.com', '3008901234', (SELECT id FROM ranks WHERE name = 'Constructor Elite'), 1000, (SELECT id FROM affiliates WHERE code = 'A003')),
('A009', 'Laura Ramírez', 'laura.ramirez@example.com', '3009012345', (SELECT id FROM ranks WHERE name = 'Diamante'), 3000, (SELECT id FROM affiliates WHERE code = 'A003')),
('A010', 'Sofía Herrera', 'sofia.herrera@example.com', '3010123456', (SELECT id FROM ranks WHERE name = 'Constructor Elite'), 1000, (SELECT id FROM affiliates WHERE code = 'A004')),
('A011', 'Andrés Castro', 'andres.castro@example.com', '3011234567', (SELECT id FROM ranks WHERE name = 'Diamante'), 3000, (SELECT id FROM affiliates WHERE code = 'A004')),
('A012', 'Carmen Vargas', 'carmen.vargas@example.com', '3012345678', (SELECT id FROM ranks WHERE name = 'Constructor Elite'), 1000, (SELECT id FROM affiliates WHERE code = 'A005'))
ON CONFLICT (code) DO NOTHING;

-- Nivel 4 - Constructor y Constructor Elite
INSERT INTO affiliates (code, name, email, phone, rank_id, points, parent_id) VALUES
('A013', 'Fernando Torres', 'fernando.torres@example.com', '3013456789', (SELECT id FROM ranks WHERE name = 'Constructor'), 100, (SELECT id FROM affiliates WHERE code = 'A006')),
('A014', 'Gabriela Méndez', 'gabriela.mendez@example.com', '3014567890', (SELECT id FROM ranks WHERE name = 'Constructor'), 100, (SELECT id FROM affiliates WHERE code = 'A006')),
('A015', 'Ricardo Gómez', 'ricardo.gomez@example.com', '3015678901', (SELECT id FROM ranks WHERE name = 'Constructor Elite'), 1000, (SELECT id FROM affiliates WHERE code = 'A007')),
('A016', 'Valentina Ruiz', 'valentina.ruiz@example.com', '3016789012', (SELECT id FROM ranks WHERE name = 'Constructor'), 100, (SELECT id FROM affiliates WHERE code = 'A008')),
('A017', 'Daniel Jiménez', 'daniel.jimenez@example.com', '3017890123', (SELECT id FROM ranks WHERE name = 'Constructor Elite'), 1000, (SELECT id FROM affiliates WHERE code = 'A009')),
('A018', 'Isabella Moreno', 'isabella.moreno@example.com', '3018901234', (SELECT id FROM ranks WHERE name = 'Constructor'), 100, (SELECT id FROM affiliates WHERE code = 'A010')),
('A019', 'Sebastián Rojas', 'sebastian.rojas@example.com', '3019012345', (SELECT id FROM ranks WHERE name = 'Constructor'), 100, (SELECT id FROM affiliates WHERE code = 'A011')),
('A020', 'Camila Díaz', 'camila.diaz@example.com', '3020123456', (SELECT id FROM ranks WHERE name = 'Constructor Elite'), 1000, (SELECT id FROM affiliates WHERE code = 'A012'))
ON CONFLICT (code) DO NOTHING;

-- Nivel 5 - Asociado y Constructor
INSERT INTO affiliates (code, name, email, phone, rank_id, points, parent_id) VALUES
('A021', 'Mateo Vega', 'mateo.vega@example.com', '3021234567', (SELECT id FROM ranks WHERE name = 'Asociado'), 100, (SELECT id FROM affiliates WHERE code = 'A013')),
('A022', 'Lucía Campos', 'lucia.campos@example.com', '3022345678', (SELECT id FROM ranks WHERE name = 'Asociado'), 100, (SELECT id FROM affiliates WHERE code = 'A014')),
('A023', 'Nicolás Peña', 'nicolas.pena@example.com', '3023456789', (SELECT id FROM ranks WHERE name = 'Constructor'), 100, (SELECT id FROM affiliates WHERE code = 'A015')),
('A024', 'Emma Soto', 'emma.soto@example.com', '3024567890', (SELECT id FROM ranks WHERE name = 'Asociado'), 100, (SELECT id FROM affiliates WHERE code = 'A016'))
ON CONFLICT (code) DO NOTHING;

-- Refrescar vista materializada
REFRESH MATERIALIZED VIEW affiliate_hierarchy;
