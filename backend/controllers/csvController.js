const csv = require('csv-parser');
const fs = require('fs');
const pool = require('../config/database');

// Importar afiliados desde CSV
exports.importCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Archivo CSV requerido'
      });
    }

    const results = [];
    const errors = [];
    const filePath = req.file.path;

    // Leer y procesar CSV
    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => {
          results.push(data);
        })
        .on('end', resolve)
        .on('error', reject);
    });

    // Validar y procesar cada fila
    for (let i = 0; i < results.length; i++) {
      const row = results[i];
      try {
        // Validar campos requeridos
        if (!row.code || !row.name) {
          errors.push({
            row: i + 2, // +2 porque CSV tiene header y es base 1
            error: 'Código y nombre son requeridos'
          });
          continue;
        }

        // Buscar o crear rango
        let rankId = null;
        if (row.rank) {
          const rankQuery = 'SELECT id FROM ranks WHERE name ILIKE $1';
          const rankResult = await pool.query(rankQuery, [row.rank.trim()]);
          if (rankResult.rows.length > 0) {
            rankId = rankResult.rows[0].id;
          }
        }

        // Buscar parent si existe
        let parentId = null;
        if (row.parent_code) {
          const parentQuery = 'SELECT id FROM affiliates WHERE code = $1';
          const parentResult = await pool.query(parentQuery, [row.parent_code.trim()]);
          if (parentResult.rows.length > 0) {
            parentId = parentResult.rows[0].id;
          }
        }

        // Insertar o actualizar afiliado
        const insertQuery = `
          INSERT INTO affiliates (code, name, email, phone, rank_id, points, parent_id)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          ON CONFLICT (code) 
          DO UPDATE SET
            name = EXCLUDED.name,
            email = EXCLUDED.email,
            phone = EXCLUDED.phone,
            rank_id = EXCLUDED.rank_id,
            points = EXCLUDED.points,
            parent_id = EXCLUDED.parent_id,
            updated_at = CURRENT_TIMESTAMP
          RETURNING *
        `;

        await pool.query(insertQuery, [
          row.code.trim(),
          row.name.trim(),
          row.email || null,
          row.phone || null,
          rankId,
          parseInt(row.points) || 0,
          parentId
        ]);

      } catch (error) {
        errors.push({
          row: i + 2,
          error: error.message
        });
      }
    }

    // Eliminar archivo temporal
    fs.unlinkSync(filePath);

    // Refrescar vista materializada
    try {
      await pool.query('REFRESH MATERIALIZED VIEW CONCURRENTLY affiliate_hierarchy');
    } catch (error) {
      console.error('Error al refrescar vista materializada:', error);
    }

    res.json({
      success: true,
      message: `Procesados ${results.length} registros`,
      imported: results.length - errors.length,
      errors: errors.length,
      errorDetails: errors
    });

  } catch (error) {
    // Eliminar archivo temporal en caso de error
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {
        console.error('Error al eliminar archivo temporal:', e);
      }
    }

    res.status(500).json({
      success: false,
      message: 'Error al importar CSV',
      error: error.message
    });
  }
};

// Exportar afiliados a CSV
exports.exportCSV = async (req, res) => {
  try {
    const { id } = req.params;
    let query;
    let params = [];

    if (id) {
      // Exportar jerarquía de un afiliado específico
      query = `
        WITH RECURSIVE hierarchy AS (
          SELECT 
            a.id, a.code, a.name, a.email, a.phone, 
            a.rank_id, a.points, a.parent_id,
            r.name as rank_name,
            0 as level
          FROM affiliates a
          LEFT JOIN ranks r ON a.rank_id = r.id
          WHERE a.id = $1
          
          UNION ALL
          
          SELECT 
            a.id, a.code, a.name, a.email, a.phone,
            a.rank_id, a.points, a.parent_id,
            r.name as rank_name,
            h.level + 1
          FROM affiliates a
          INNER JOIN hierarchy h ON a.parent_id = h.id
          LEFT JOIN ranks r ON a.rank_id = r.id
          WHERE h.level < 10
        )
        SELECT * FROM hierarchy ORDER BY level, name
      `;
      params = [id];
    } else {
      // Exportar todos los afiliados
      query = `
        SELECT 
          a.id, a.code, a.name, a.email, a.phone,
          a.rank_id, a.points, a.parent_id,
          r.name as rank_name,
          p.code as parent_code
        FROM affiliates a
        LEFT JOIN ranks r ON a.rank_id = r.id
        LEFT JOIN affiliates p ON a.parent_id = p.id
        ORDER BY a.name
      `;
    }

    const result = await pool.query(query, params);
    const affiliates = result.rows;

    // Generar CSV
    const csvHeader = 'Código,Nombre,Email,Teléfono,Rango,Puntos,Código Padre\n';
    const csvRows = affiliates.map(aff => {
      return [
        aff.code || '',
        aff.name || '',
        aff.email || '',
        aff.phone || '',
        aff.rank_name || '',
        aff.points || 0,
        aff.parent_code || ''
      ].join(',');
    }).join('\n');

    const csvContent = csvHeader + csvRows;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename=affiliates_${id || 'all'}_${Date.now()}.csv`);
    res.send('\ufeff' + csvContent); // BOM para Excel

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al exportar CSV',
      error: error.message
    });
  }
};

