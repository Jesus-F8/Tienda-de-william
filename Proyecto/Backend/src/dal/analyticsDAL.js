// Asegúrate de importar TODOS los modelos que vas a usar
const { Product, Order } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Data Access Layer para Analytics
 * Maneja las operaciones de base de datos para obtener métricas y reportes.
 */
class AnalyticsDAL {

    /**
     * Calcula el valor total del inventario (SUM(precio * cantidad)).
     * @returns {Promise<number>} El valor total del inventario.
     */
    async calculateTotalValue() {
        const result = await Product.findOne({
            attributes: [
                [sequelize.fn('SUM', sequelize.literal('price * quantity')), 'totalValue']
            ],
            raw: true
        });
        return parseFloat(result.totalValue) || 0;
    }

    /**
     * Cuenta los productos con stock bajo (cantidad <= 10 y > 0).
     * @param {number} threshold - El umbral para considerar stock bajo.
     * @returns {Promise<number>} El número de productos con stock bajo.
     */
    async countLowStock(threshold = 10) {
        return await Product.count({
            where: {
                quantity: {
                    [Op.lte]: threshold,
                    [Op.gt]: 0
                }
            }
        });
    }

    /**
     * Cuenta los productos sin stock (cantidad = 0).
     * @returns {Promise<number>} El número de productos sin stock.
     */
    async countOutOfStock() {
        return await Product.count({
            where: {
                quantity: 0
            }
        });
    }

    /**
     * [NUEVA FUNCIÓN]
     * Calcula la suma de ventas para un rango de fechas.
     * @param {Date} startDate - Fecha de inicio (inclusive).
     * @param {Date} endDate - Fecha de fin (exclusive).
     * @returns {Promise<number>} El total de ventas en el rango.
     */
    async calculateSales(startDate, endDate) {
        // Usamos 'sequelize.col' para referirnos a columnas de forma segura
        const result = await Order.findOne({
            attributes: [
                // ¡REVISA QUE 'totalAmount' sea tu columna de total!
                // El código (CORRECTO):
                [sequelize.fn('SUM', sequelize.col('total')), 'totalSales']

            ],
            where: {
                // ¡REVISA QUE 'createdAt' sea tu columna de fecha!
                createdAt: {
                    [Op.gte]: startDate, // Mayor o igual (>=)
                    [Op.lt]: endDate     // Menor que (<)
                }
            },
            raw: true // Devuelve un objeto JSON simple
        });
        // Si no hay ventas (result.totalSales es null), devuelve 0
        return parseFloat(result.totalSales) || 0;
    }

} // Fin de la clase AnalyticsDAL

module.exports = new AnalyticsDAL();