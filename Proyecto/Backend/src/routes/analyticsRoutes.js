const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

/**
 * Rutas para Analytics
 * Define los endpoints relacionados con las métricas y reportes.
 */

// GET /api/analytics/metrics - Obtener las métricas del dashboard
router.get('/metrics', analyticsController.getMetrics);

module.exports = router;