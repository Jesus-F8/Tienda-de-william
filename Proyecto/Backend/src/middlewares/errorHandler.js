/**
 * Middleware de manejo de errores centralizado
 * Debe ir al final de la cadena de middlewares
 */

const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Error de validación de Sequelize
    if (err.name === 'SequelizeValidationError') {
        const errors = err.errors.map(error => ({
            field: error.path,
            message: error.message
        }));
        return res.status(400).json({
            error: 'Error de validación',
            details: errors
        });
    }

    // Error de restricción única de Sequelize
    if (err.name === 'SequelizeUniqueConstraintError') {
        const field = err.errors[0]?.path || 'campo';
        return res.status(409).json({
            error: 'Conflicto de datos',
            message: `El ${field} ya existe`
        });
    }

    // Error de clave foránea de Sequelize
    if (err.name === 'SequelizeForeignKeyConstraintError') {
        return res.status(400).json({
            error: 'Error de referencia',
            message: 'Referencia inválida a otro registro'
        });
    }

    // Error de conexión a la base de datos
    if (err.name === 'SequelizeConnectionError') {
        return res.status(503).json({
            error: 'Error de conexión',
            message: 'No se pudo conectar con la base de datos'
        });
    }

    // Error personalizado con mensaje
    if (err.message) {
        const statusCode = err.statusCode || 500;
        return res.status(statusCode).json({
            error: err.message,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        });
    }

    // Error genérico
    res.status(500).json({
        error: 'Error interno del servidor',
        ...(process.env.NODE_ENV === 'development' && {
            message: err.message,
            stack: err.stack
        })
    });
};

module.exports = errorHandler;
