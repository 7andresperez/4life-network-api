const Affiliate = require('../models/Affiliate');

// Obtener todos los afiliados
exports.getAll = async (req, res) => {
  try {
    const affiliates = await Affiliate.getAll();
    res.json({
      success: true,
      data: affiliates,
      count: affiliates.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener afiliados',
      error: error.message
    });
  }
};

// Obtener afiliado por ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const affiliate = await Affiliate.getById(id);
    
    if (!affiliate) {
      return res.status(404).json({
        success: false,
        message: 'Afiliado no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: affiliate
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener afiliado',
      error: error.message
    });
  }
};

// Buscar afiliados
exports.search = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Parámetro de búsqueda requerido'
      });
    }
    
    const results = await Affiliate.search(q);
    res.json({
      success: true,
      data: results,
      count: results.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error en la búsqueda',
      error: error.message
    });
  }
};

// Obtener jerarquía de afiliado
exports.getHierarchy = async (req, res) => {
  try {
    const { id } = req.params;
    const { maxLevel } = req.query;
    
    const hierarchy = await Affiliate.getHierarchy(id, maxLevel ? parseInt(maxLevel) : 3);
    
    if (hierarchy.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Afiliado no encontrado'
      });
    }
    
    // Organizar jerarquía en estructura de árbol
    const tree = buildTree(hierarchy);
    
    res.json({
      success: true,
      data: {
        hierarchy: hierarchy,
        tree: tree
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener jerarquía',
      error: error.message
    });
  }
};

// Obtener descendientes
exports.getDescendants = async (req, res) => {
  try {
    const { id } = req.params;
    const descendants = await Affiliate.getDescendants(id);
    
    res.json({
      success: true,
      data: descendants,
      count: descendants.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener descendientes',
      error: error.message
    });
  }
};

// Obtener reporte por niveles
exports.getReportByLevels = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await Affiliate.getReportByLevels(id);
    
    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al generar reporte',
      error: error.message
    });
  }
};

// Crear nuevo afiliado
exports.create = async (req, res) => {
  try {
    const affiliate = await Affiliate.create(req.body);
    res.status(201).json({
      success: true,
      data: affiliate,
      message: 'Afiliado creado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear afiliado',
      error: error.message
    });
  }
};

// Actualizar afiliado
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const affiliate = await Affiliate.update(id, req.body);
    
    if (!affiliate) {
      return res.status(404).json({
        success: false,
        message: 'Afiliado no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: affiliate,
      message: 'Afiliado actualizado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar afiliado',
      error: error.message
    });
  }
};

// Eliminar afiliado
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const affiliate = await Affiliate.delete(id);
    
    if (!affiliate) {
      return res.status(404).json({
        success: false,
        message: 'Afiliado no encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Afiliado eliminado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar afiliado',
      error: error.message
    });
  }
};

// Obtener rangos
exports.getRanks = async (req, res) => {
  try {
    const ranks = await Affiliate.getRanks();
    res.json({
      success: true,
      data: ranks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener rangos',
      error: error.message
    });
  }
};

// Función auxiliar para construir árbol
function buildTree(hierarchy) {
  const map = new Map();
  const roots = [];
  
  // Crear mapa de nodos
  hierarchy.forEach(node => {
    map.set(node.id, { ...node, children: [] });
  });
  
  // Construir árbol
  hierarchy.forEach(node => {
    const nodeWithChildren = map.get(node.id);
    if (node.parent_id === null) {
      roots.push(nodeWithChildren);
    } else {
      const parent = map.get(node.parent_id);
      if (parent) {
        parent.children.push(nodeWithChildren);
      }
    }
  });
  
  return roots;
}

