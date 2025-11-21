const express = require('express');
const router = express.Router();
const affiliateController = require('../controllers/affiliateController');

/**
 * @swagger
 * /api/affiliates:
 *   get:
 *     summary: Obtener todos los afiliados
 *     tags: [Affiliates]
 *     responses:
 *       200:
 *         description: Lista de afiliados
 */
router.get('/', affiliateController.getAll);

/**
 * @swagger
 * /api/affiliates/search:
 *   get:
 *     summary: Buscar afiliados por nombre o código
 *     tags: [Affiliates]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Término de búsqueda
 *     responses:
 *       200:
 *         description: Resultados de búsqueda
 */
router.get('/search', affiliateController.search);

/**
 * @swagger
 * /api/affiliates/ranks:
 *   get:
 *     summary: Obtener todos los rangos
 *     tags: [Affiliates]
 *     responses:
 *       200:
 *         description: Lista de rangos
 */
router.get('/ranks', affiliateController.getRanks);

/**
 * @swagger
 * /api/affiliates/{id}:
 *   get:
 *     summary: Obtener afiliado por ID
 *     tags: [Affiliates]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Datos del afiliado
 *       404:
 *         description: Afiliado no encontrado
 */
router.get('/:id', affiliateController.getById);

/**
 * @swagger
 * /api/affiliates/{id}/hierarchy:
 *   get:
 *     summary: Obtener jerarquía de afiliado (hasta 3 niveles)
 *     tags: [Affiliates]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: maxLevel
 *         schema:
 *           type: integer
 *           default: 3
 *     responses:
 *       200:
 *         description: Jerarquía del afiliado
 */
router.get('/:id/hierarchy', affiliateController.getHierarchy);

/**
 * @swagger
 * /api/affiliates/{id}/descendants:
 *   get:
 *     summary: Obtener todos los descendientes de un afiliado
 *     tags: [Affiliates]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de descendientes
 */
router.get('/:id/descendants', affiliateController.getDescendants);

/**
 * @swagger
 * /api/affiliates/{id}/report:
 *   get:
 *     summary: Obtener reporte por niveles
 *     tags: [Affiliates]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reporte por niveles
 */
router.get('/:id/report', affiliateController.getReportByLevels);

/**
 * @swagger
 * /api/affiliates:
 *   post:
 *     summary: Crear nuevo afiliado
 *     tags: [Affiliates]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - name
 *             properties:
 *               code:
 *                 type: string
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               rank_id:
 *                 type: integer
 *               points:
 *                 type: integer
 *               parent_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Afiliado creado
 */
router.post('/', affiliateController.create);

/**
 * @swagger
 * /api/affiliates/{id}:
 *   put:
 *     summary: Actualizar afiliado
 *     tags: [Affiliates]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Afiliado actualizado
 */
router.put('/:id', affiliateController.update);

/**
 * @swagger
 * /api/affiliates/{id}:
 *   delete:
 *     summary: Eliminar afiliado
 *     tags: [Affiliates]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Afiliado eliminado
 */
router.delete('/:id', affiliateController.delete);

module.exports = router;

