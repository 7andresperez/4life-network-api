const pool = require('../config/database');

class Affiliate {
  // Obtener todos los afiliados
  static async getAll() {
    const query = 'SELECT * FROM affiliates ORDER BY name';
    const result = await pool.query(query);
    return result.rows;
  }

  // Obtener afiliado por ID
  static async getById(id) {
    const query = 'SELECT * FROM affiliates WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // Obtener afiliado por código
  static async getByCode(code) {
    const query = 'SELECT * FROM affiliates WHERE code = $1';
    const result = await pool.query(query, [code]);
    return result.rows[0];
  }

  // Buscar afiliados por nombre o código
  static async search(searchTerm) {
    const query = `
      SELECT a.*, r.name as rank_name, r.level as rank_level
      FROM affiliates a
      LEFT JOIN ranks r ON a.rank_id = r.id
      WHERE a.name ILIKE $1 OR a.code ILIKE $1
      ORDER BY a.name
    `;
    const result = await pool.query(query, [`%${searchTerm}%`]);
    return result.rows;
  }

  // Obtener jerarquía de un afiliado (hasta 3 niveles)
  static async getHierarchy(affiliateId, maxLevel = 3) {
    const query = `
      WITH RECURSIVE hierarchy AS (
        -- Nodo raíz
        SELECT 
          a.id,
          a.code,
          a.name,
          a.email,
          a.phone,
          a.rank_id,
          a.points,
          a.parent_id,
          r.name as rank_name,
          r.level as rank_level,
          0 as level,
          ARRAY[a.id] as path
        FROM affiliates a
        LEFT JOIN ranks r ON a.rank_id = r.id
        WHERE a.id = $1
        
        UNION ALL
        
        -- Nodos hijos
        SELECT 
          a.id,
          a.code,
          a.name,
          a.email,
          a.phone,
          a.rank_id,
          a.points,
          a.parent_id,
          r.name as rank_name,
          r.level as rank_level,
          h.level + 1,
          h.path || a.id
        FROM affiliates a
        INNER JOIN hierarchy h ON a.parent_id = h.id
        LEFT JOIN ranks r ON a.rank_id = r.id
        WHERE h.level < $2 AND NOT (a.id = ANY(h.path))
      )
      SELECT * FROM hierarchy ORDER BY level, name
    `;
    const result = await pool.query(query, [affiliateId, maxLevel]);
    return result.rows;
  }

  // Obtener descendientes de un afiliado
  static async getDescendants(affiliateId) {
    const query = `
      WITH RECURSIVE descendants AS (
        SELECT id, code, name, rank_id, points, parent_id, 0 as level
        FROM affiliates
        WHERE parent_id = $1
        
        UNION ALL
        
        SELECT a.id, a.code, a.name, a.rank_id, a.points, a.parent_id, d.level + 1
        FROM affiliates a
        INNER JOIN descendants d ON a.parent_id = d.id
      )
      SELECT d.*, r.name as rank_name, r.level as rank_level
      FROM descendants d
      LEFT JOIN ranks r ON d.rank_id = r.id
      ORDER BY level, name
    `;
    const result = await pool.query(query, [affiliateId]);
    return result.rows;
  }

  // Obtener reporte por niveles
  static async getReportByLevels(affiliateId) {
    const query = `
      WITH RECURSIVE hierarchy AS (
        SELECT 
          id, code, name, rank_id, points, parent_id, 0 as level
        FROM affiliates
        WHERE id = $1
        
        UNION ALL
        
        SELECT 
          a.id, a.code, a.name, a.rank_id, a.points, a.parent_id, h.level + 1
        FROM affiliates a
        INNER JOIN hierarchy h ON a.parent_id = h.id
        WHERE h.level < 10
      )
      SELECT 
        level,
        COUNT(*) as total_affiliates,
        SUM(points) as total_points,
        AVG(points) as avg_points,
        COUNT(DISTINCT rank_id) as distinct_ranks
      FROM hierarchy
      GROUP BY level
      ORDER BY level
    `;
    const result = await pool.query(query, [affiliateId]);
    return result.rows;
  }

  // Crear nuevo afiliado
  static async create(data) {
    const { code, name, email, phone, rank_id, points, parent_id } = data;
    const query = `
      INSERT INTO affiliates (code, name, email, phone, rank_id, points, parent_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const result = await pool.query(query, [code, name, email, phone, rank_id, points, parent_id]);
    return result.rows[0];
  }

  // Actualizar afiliado
  static async update(id, data) {
    const { name, email, phone, rank_id, points, parent_id } = data;
    const query = `
      UPDATE affiliates
      SET name = $1, email = $2, phone = $3, rank_id = $4, points = $5, parent_id = $6, updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING *
    `;
    const result = await pool.query(query, [name, email, phone, rank_id, points, parent_id, id]);
    return result.rows[0];
  }

  // Eliminar afiliado
  static async delete(id) {
    const query = 'DELETE FROM affiliates WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // Obtener todos los rangos
  static async getRanks() {
    const query = 'SELECT * FROM ranks ORDER BY level';
    const result = await pool.query(query);
    return result.rows;
  }
}

module.exports = Affiliate;

