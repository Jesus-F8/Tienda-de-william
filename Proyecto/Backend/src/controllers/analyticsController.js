const analyticsService = require('../services/analyticsService');

/**
 * Controller para Analytics
 * Maneja las peticiones HTTP y las respuestas para los endpoints de analíticas.
 */
class AnalyticsController {

    /**
     * Maneja la petición GET /api/analytics/metrics.
     * Obtiene las métricas del dashboard y las envía como respuesta JSON.
     * @param {object} req - Objeto de solicitud de Express.
     * @param {object} res - Objeto de respuesta de Express.
     * @param {function} next - Función para pasar al siguiente middleware.
     */
    async getMetrics(req, res, next) {
        try {
            const metrics = await analyticsService.getDashboardMetrics();
            res.status(200).json(metrics);
        } catch (error) {
            next(error); // Pasa el error al manejador de errores centralizado
        }
    }
}

module.exports = new AnalyticsController();