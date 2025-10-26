const { body, param, validationResult } = require('express-validator');

/**
 * Middleware genérico para manejar los errores de validación.
 * Esto evita repetir el mismo código en cada validador.
 */
const handleValidationErrors = (req, res, next) => {
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
};

/**
 * Validaciones para CREAR un producto (POST)
 * Aquí, 'quantity' es requerido.
 */
const validateProductCreation = [
    body('name')
        .notEmpty().withMessage('El nombre es requerido')
        .trim()
        .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres'),

    body('sku')
        .notEmpty().withMessage('El SKU es requerido')
        .trim()
        .isLength({ min: 3 }).withMessage('El SKU debe tener al menos 3 caracteres'),

    // --- CAMBIO AQUÍ ---
    // El campo se llama 'quantity' (no 'stock') y es REQUERIDO al crear.
    body('quantity')
        .notEmpty().withMessage('La cantidad es requerida')
        .isInt({ min: 0 }).withMessage('La cantidad debe ser un número entero >= 0'),

    body('location')
        .notEmpty().withMessage('La ubicación es requerida')
        .trim(),

    body('price')
        .notEmpty().withMessage('El precio es requerido')
        .isFloat({ min: 0.01 }).withMessage('El precio debe ser mayor a 0'),

    // El ID de categoría es opcional al crear un producto
    body('categoryId')
        .optional({ checkFalsy: true }) // Permite null o ""
        .isUUID().withMessage('El ID de categoría debe ser un UUID válido')
        .trim(),

    handleValidationErrors // Llama al manejador de errores
];

/**
 * Validaciones para ACTUALIZAR un producto (PUT)
 * Es idéntico a la creación, pero SIN 'quantity'.
 */
const validateProductUpdate = [
    body('name')
        .notEmpty().withMessage('El nombre es requerido')
        .trim()
        .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres'),

    body('sku')
        .notEmpty().withMessage('El SKU es requerido')
        .trim()
        .isLength({ min: 3 }).withMessage('El SKU debe tener al menos 3 caracteres'),

    // --- 'quantity' SE ELIMINÓ DE AQUÍ ---

    body('location')
        .notEmpty().withMessage('La ubicación es requerida')
        .trim(),

    body('price')
        .notEmpty().withMessage('El precio es requerido')
        .isFloat({ min: 0.01 }).withMessage('El precio debe ser mayor a 0'),

    body('categoryId')
        .optional({ checkFalsy: true })
        .isUUID().withMessage('El ID de categoría debe ser un UUID válido')
        .trim(),

    handleValidationErrors // Llama al manejador de errores
];


/**
 * Validación para parámetro ID
 */
const validateId = [
    param('id')
        .isUUID(4).withMessage('ID de producto inválido'), // Especificamos UUID v4

    handleValidationErrors
];

/**
 * Validación para búsqueda (No se usa por ahora, pero se queda)
 */
const validateSearch = [
    body('searchTerm')
        .optional()
        .trim()
        .isLength({ min: 2 }).withMessage('El término de búsqueda debe tener al menos 2 caracteres'),

    handleValidationErrors
];

/**
 * Validaciones para añadir stock a un producto
 */
const validateStockAddition = [
    body('quantity')
        .notEmpty().withMessage('La cantidad es requerida')
        .isInt({ min: 1 }).withMessage('La cantidad debe ser un número entero mayor a 0')
        .custom((value) => {
            // Validación adicional para asegurar que es un entero positivo
            if (!Number.isInteger(Number(value)) || Number(value) <= 0) {
                throw new Error('La cantidad debe ser un número entero positivo');
            }
            return true;
        }),

    body('notes')
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage('Las notas no pueden exceder 500 caracteres'),

    body('userId')
        .optional()
        .isUUID().withMessage('El ID de usuario debe ser un UUID válido'),

    handleValidationErrors
];

module.exports = {
    validateProductCreation, // <-- Cambiado
    validateProductUpdate,   // <-- Nuevo
    validateId,
    validateSearch,
    validateStockAddition    // <-- Nuevo
};