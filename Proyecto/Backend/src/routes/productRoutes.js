const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { validateProduct, validateId } = require('../middlewares/validators/productValidator');

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
router.post('/', validateProduct, productController.createProduct);

// PUT /api/products/:id - Actualizar producto
router.put('/:id', validateId, validateProduct, productController.updateProduct);

// DELETE /api/products/:id - Eliminar producto
router.delete('/:id', validateId, productController.deleteProduct);

module.exports = router;
