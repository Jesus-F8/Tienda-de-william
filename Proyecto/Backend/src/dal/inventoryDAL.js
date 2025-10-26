const InventoryHistory = require('../models/InventoryHistory');
const { Op } = require('sequelize');

/**
 * Data Access Layer para Inventory History
 * Maneja las operaciones de base de datos para el historial de inventario
 */
class InventoryDAL {

    /**
     * Registrar una entrada en el historial de inventario
     * @param {Object} data - Datos del registro
     * @param {string} data.productId - ID del producto
     * @param {number} data.quantity - Cantidad añadida/quita
     * @param {string} data.changeType - Tipo de cambio ('addition' o 'subtraction')
     * @param {number} data.previousStock - Stock anterior
     * @param {number} data.newStock - Stock nuevo
     * @param {string} [data.notes] - Notas opcionales
     * @param {string} [data.userId] - ID del usuario (opcional)
     * @param {Object} transaction - Transacción de Sequelize
     * @returns {Promise<Object>} El registro creado
     */
    async logEntry(data, transaction) {
        const entryData = {
            productId: data.productId,
            quantity: data.quantity,
            changeType: data.changeType,
            previousStock: data.previousStock,
            newStock: data.newStock,
            notes: data.notes || null,
            userId: data.userId || null
        };

        return await InventoryHistory.create(entryData, { transaction });
    }

    /**
     * Obtener el historial de un producto específico
     * @param {string} productId - ID del producto
     * @param {Object} [options] - Opciones de consulta
     * @param {number} [options.limit=50] - Límite de registros
     * @param {number} [options.offset=0] - Offset para paginación
     * @param {string} [options.changeType] - Filtrar por tipo de cambio
     * @returns {Promise<Array>} Array de registros del historial
     */
    async getProductHistory(productId, options = {}) {
        const {
            limit = 50,
            offset = 0,
            changeType
        } = options;

        const whereClause = { productId };

        if (changeType) {
            whereClause.changeType = changeType;
        }

        return await InventoryHistory.findAll({
            where: whereClause,
            order: [['created_at', 'DESC']],
            limit,
            offset,
            include: [{
                association: 'product',
                attributes: ['name', 'sku']
            }]
        });
    }

    /**
     * Obtener estadísticas del historial de inventario
     * @param {string} [productId] - ID del producto (opcional)
     * @param {Date} [startDate] - Fecha de inicio (opcional)
     * @param {Date} [endDate] - Fecha de fin (opcional)
     * @returns {Promise<Object>} Estadísticas del historial
     */
    async getHistoryStats(productId, startDate, endDate) {
        const whereClause = {};

        if (productId) {
            whereClause.productId = productId;
        }

        if (startDate && endDate) {
            whereClause.created_at = {
                [Op.between]: [startDate, endDate]
            };
        }

        const [totalEntries, additions, subtractions] = await Promise.all([
            InventoryHistory.count({ where: whereClause }),
            InventoryHistory.count({
                where: { ...whereClause, changeType: 'addition' }
            }),
            InventoryHistory.count({
                where: { ...whereClause, changeType: 'subtraction' }
            })
        ]);

        return {
            totalEntries,
            additions,
            subtractions
        };
    }

    /**
     * Obtener el último registro de un producto
     * @param {string} productId - ID del producto
     * @returns {Promise<Object|null>} El último registro o null
     */
    async getLastEntry(productId) {
        return await InventoryHistory.findOne({
            where: { productId },
            order: [['created_at', 'DESC']]
        });
    }

    /**
     * Contar registros de historial por producto
     * @param {string} productId - ID del producto
     * @returns {Promise<number>} Número de registros
     */
    async countByProduct(productId) {
        return await InventoryHistory.count({
            where: { productId }
        });
    }
}

module.exports = new InventoryDAL();
