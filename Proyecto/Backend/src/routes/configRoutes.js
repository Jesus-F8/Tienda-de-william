// En: src/routes/configRoutes.js

const express = require('express');
const router = express.Router();
// --- CAMBIO AQUÍ ---
const configController = require('../controllers/configController');

// (Podríamos añadir un validador simple si quisiéramos)

// GET /api/config - Obtener todas las configuraciones
router.get('/', configController.getSettings);

// PUT /api/config/:key - Actualizar una configuración
router.put('/:key', configController.updateSetting);

console.log("Exporting configRoutes:", typeof router, router);

module.exports = router;