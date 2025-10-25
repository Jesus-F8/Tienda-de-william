const productService = require('../services/productService');

/**
 * Controller - Maneja HTTP requests/responses
 * NO contiene lógica de negocio
 */

/**
 * GET /api/products
 */
exports.getAllProducts = async (req, res, next) => {
    try {
        const products = await productService.getAllProducts();
        res.json(products);
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/products/:id
 */
exports.getProductById = async (req, res, next) => {
    try {
        const product = await productService.getProductById(req.params.id);
        res.json(product);
    } catch (error) {
        next(error);
    }
};

/**
 * POST /api/products
 */
exports.createProduct = async (req, res, next) => {
    try {
        const product = await productService.createProduct(req.body);
        res.status(201).json(product);
    } catch (error) {
        next(error);
    }
};

/**
 * PUT /api/products/:id
 */
exports.updateProduct = async (req, res, next) => {
    try {
        const product = await productService.updateProduct(req.params.id, req.body);
        res.json(product);
    } catch (error) {
        next(error);
    }
};

/**
 * DELETE /api/products/:id
 */
exports.deleteProduct = async (req, res, next) => {
    try {
        const result = await productService.deleteProduct(req.params.id);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/products/search
 */
exports.searchProducts = async (req, res, next) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ error: 'Parámetro de búsqueda requerido' });
        }

        const products = await productService.searchProducts(q);
        res.json(products);
    } catch (error) {
        next(error);
    }
};
