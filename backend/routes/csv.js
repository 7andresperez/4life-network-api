const express = require('express');
const router = express.Router();
const multer = require('multer');
const csvController = require('../controllers/csvController');

// Configurar multer para archivos temporales
const upload = multer({ 
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos CSV'));
    }
  }
});

/**
 * @swagger
 * /api/csv/import:
 *   post:
 *     summary: Importar afiliados desde archivo CSV
 *     tags: [CSV]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: file
 *         type: file
 *         required: true
 *         description: Archivo CSV con afiliados
 *     responses:
 *       200:
 *         description: Importación exitosa
 */
router.post('/import', upload.single('file'), csvController.importCSV);

/**
 * @swagger
 * /api/csv/export:
 *   get:
 *     summary: Exportar afiliados a CSV
 *     tags: [CSV]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         description: ID del afiliado (opcional, exporta jerarquía si se especifica)
 *     responses:
 *       200:
 *         description: Archivo CSV descargado
 */
router.get('/export', csvController.exportCSV);

module.exports = router;

