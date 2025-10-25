// En: services/analyticsService.js

const analyticsDAL = require('../dal/analyticsDAL');
const productDAL = require('../dal/productDAL');

class AnalyticsService {

    /**
     * Obtiene todas las métricas consolidadas para el dashboard.
     * (¡Versión actualizada!)
     */
    async getDashboardMetrics() {
        try {
            // --- 1. Definir los rangos de fechas ---
            const todayStart = new Date();
            todayStart.setHours(0, 0, 0, 0); // Inicio de hoy

            const tomorrowStart = new Date(todayStart);
            tomorrowStart.setDate(todayStart.getDate() + 1); // Inicio de mañana (para el límite)

            const yesterdayStart = new Date(todayStart);
            yesterdayStart.setDate(todayStart.getDate() - 1); // Inicio de ayer

            // --- 2. Ejecutar TODAS las consultas (las viejas y las nuevas) ---
            const [
                totalProducts,
                totalValue,
                lowStock,
                outOfStock,
                salesToday,       // <--- NUEVO
                salesYesterday    // <--- NUEVO
            ] = await Promise.all([
                productDAL.count(),
                analyticsDAL.calculateTotalValue(),
                analyticsDAL.countLowStock(),
                analyticsDAL.countOutOfStock(),

                // --- 3. Llamar a la nueva función del DAL ---
                //    (Asegúrate de haberla añadido a analyticsDAL.js)
                analyticsDAL.calculateSales(todayStart, tomorrowStart), // Ventas de hoy
                analyticsDAL.calculateSales(yesterdayStart, todayStart)  // Ventas de ayer
            ]);

            // --- 4. Calcular el cambio en porcentaje ---
            let salesChange = 0;
            if (salesYesterday > 0) {
                // ( (Hoy - Ayer) / Ayer ) * 100
                salesChange = ((salesToday - salesYesterday) / salesYesterday) * 100;
            } else if (salesToday > 0) {
                salesChange = 100; // Si ayer fue 0 y hoy no, es 100% de aumento
            }

            // --- 5. Devolver el objeto COMPLETO ---
            return {
                totalProducts,
                totalValue,
                lowStock,
                outOfStock,
                salesToday,     // <--- AÑADIDO
                salesChange     // <--- AÑADIDO
            };
        } catch (error) {
            // Lanza un error para que sea manejado por el errorHandler
            throw new Error(`Error al calcular las métricas del dashboard: ${error.message}`);
        }
    }
}

module.exports = new AnalyticsService();