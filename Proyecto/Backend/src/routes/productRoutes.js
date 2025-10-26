const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// --- CAMBIO AQUÍ ---
// Importamos los nuevos validadores específicos
const {
    validateProductCreation,
    validateProductUpdate,
    validateId,
    validateStockAddition
} = require('../middlewares/validators/productValidator');

/**
 * Rutas para productos
 */

// GET /api/products - Obtener todos los productos
router.get('/', productController.getAllProducts);

// GET /api/products/search - Buscar productos
router.get('/search', productController.searchProducts);

// GET /api/products/:id - Obtener producto por ID
router.get('/:id', validateId, productController.getProductById);

// POST /api/products - Crear nuevo producto
// --- CAMBIO AQUÍ ---
// Usamos el validador de CREACIÓN
router.post('/', validateProductCreation, productController.createProduct);

// PUT /api/products/:id - Actualizar producto
// --- CAMBIO AQUÍ ---
// Usamos el validador de ACTUALIZACIÓN (que no valida 'quantity')
router.put('/:id', validateId, validateProductUpdate, productController.updateProduct);

// DELETE /api/products/:id - Eliminar producto
router.delete('/:id', validateId, productController.deleteProduct);

// POST /api/products/:id/add-stock - Añadir stock a un producto
router.post('/:id/add-stock', validateId, validateStockAddition, productController.addStock);

// GET /api/products/:id/inventory-history - Obtener historial de inventario
router.get('/:id/inventory-history', validateId, productController.getInventoryHistory);

// GET /api/products/inventory-stats - Obtener estadísticas de inventario
router.get('/inventory-stats', productController.getInventoryStats);

module.exports = router;