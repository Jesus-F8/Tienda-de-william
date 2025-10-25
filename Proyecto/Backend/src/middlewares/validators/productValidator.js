const { body, param, validationResult } = require('express-validator');

/**
 * Validaciones para crear/actualizar productos
 */
const validateProduct = [
    body('name')
        .notEmpty().withMessage('El nombre es requerido')
        .trim()
        .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres'),

    body('sku')
        .notEmpty().withMessage('El SKU es requerido')
        .trim()
        .isLength({ min: 3 }).withMessage('El SKU debe tener al menos 3 caracteres'),

    body('stock')
        .optional()
        .isInt({ min: 0 }).withMessage('El stock debe ser un número entero >= 0'),

    body('location')
        .notEmpty().withMessage('La ubicación es requerida')
        .trim(),

    body('price')
        .notEmpty().withMessage('El precio es requerido')
        .isFloat({ min: 0.01 }).withMessage('El precio debe ser mayor a 0'),

    body('category')
        .optional()
        .trim(),

    // Middleware para manejar errores de validación
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array().map(err => ({
                    field: err.path,
                    message: err.msg
                }))
            });
        }
        next();
    }
];

/**
 * Validación para parámetro ID
 */
const validateId = [
    param('id')
        .isUUID().withMessage('ID inválido'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

/**
 * Validación para búsqueda
 */
const validateSearch = [
    body('searchTerm')
        .optional()
        .trim()
        .isLength({ min: 2 }).withMessage('El término de búsqueda debe tener al menos 2 caracteres'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validateProduct,
    validateId,
    validateSearch
};
