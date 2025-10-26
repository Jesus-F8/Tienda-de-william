// En: src/routes/index.js

const express = require('express');
const router = express.Router();

// --- 1. IMPORTAR TODAS LAS RUTAS ---
const productRoutes = require('./productRoutes');
const categoryRoutes = require('./categoryRoutes'); // <-- COMENTADO HASTA QUE EL ARCHIVO EXISTA
const analyticsRoutes = require('./analyticsRoutes');
// const orderRoutes = require('./orderRoutes'); // <-- Sigue comentado
const configRoutes = require('./configRoutes');

// Quitamos el console.log que ya no necesitamos
// console.log("Imported configRoutes in index.js:", typeof configRoutes, configRoutes); 

/**
 * Agrupar todas las rutas bajo /api
 */

// Rutas de salud del servidor
router.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Servidor funcionando correctamente',
        timestamp: new Date().toISOString()
    });
});

// --- 2. USAR LAS RUTAS ACTIVAS ---
router.use('/products', productRoutes);
// router.use('/categories', categoryRoutes);   // <-- COMENTADO HASTA QUE EL ARCHIVO EXISTA
router.use('/analytics', analyticsRoutes);
// router.use('/orders', orderRoutes);          // <-- Sigue comentado
router.use('/config', configRoutes);

module.exports = router;