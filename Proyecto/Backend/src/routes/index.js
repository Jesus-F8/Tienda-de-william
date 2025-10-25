const express = require('express');
const router = express.Router();

// Importar rutas
const productRoutes = require('./productRoutes');
const analyticsRoutes = require('./analyticsRoutes'); // <-- AÑADIR ESTA LÍNEA

/**
 * Agrupar todas las rutas bajo /api
 */

// Rutas de productos
router.use('/products', productRoutes);


// Rutas de analíticas
router.use('/analytics', analyticsRoutes); // <-- AÑADIR ESTA LÍNEA

// Ruta de salud del servidor
router.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Servidor funcionando correctamente',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;