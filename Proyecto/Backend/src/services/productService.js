const productDAL = require('../dal/productDAL');
const inventoryDAL = require('../dal/inventoryDAL');
const { sequelize } = require('../models');

// --- CAMBIO AQUÍ ---
// Importamos los dos transformadores específicos en lugar del genérico
const {
    productToFrontend,
    productToDB_Create,
    productToDB_Update
} = require('../utils/transformers');

/**
 * Service Layer - Lógica de negocio
 * Coordina operaciones y aplica reglas de negocio
 */
class ProductService {

    /**
     * Obtener todos los productos
     */
    async getAllProducts() {
        const products = await productDAL.findAll();
        return products.map(productToFrontend);
    }

    /**
     * Obtener producto por ID
     */
    async getProductById(id) {
        const product = await productDAL.findById(id);

        if (!product) {
            throw new Error('Producto no encontrado');
        }

        return productToFrontend(product);
    }

    /**
     * Crear nuevo producto
     * Valida que el SKU sea único
     */
    async createProduct(productData) {
        // Validar SKU único
        const existingSku = await productDAL.findBySku(productData.sku);
        if (existingSku) {
            throw new Error('El SKU ya existe');
        }

        // Transformar y crear
        // --- CAMBIO AQUÍ ---
        // Usamos el transformador de CREACIÓN (que SÍ incluye la cantidad)
        const dataToCreate = productToDB_Create(productData);
        const product = await productDAL.create(dataToCreate);

        return productToFrontend(product);
    }

    /**
     * Actualizar producto
     * Valida que el SKU sea único (si se está cambiando)
     */
    async updateProduct(id, productData) {
        // Verificar que existe
        const existingProduct = await productDAL.findById(id);
        if (!existingProduct) {
            throw new Error('Producto no encontrado');
        }

        // Validar SKU único si se está cambiando
        if (productData.sku && productData.sku !== existingProduct.sku) {
            const existingSku = await productDAL.findBySku(productData.sku, id);
            if (existingSku) {
                throw new Error('El SKU ya existe');
            }
        }

        // Transformar y actualizar
        // --- CAMBIO AQUÍ ---
        // Usamos el transformador de ACTUALIZACIÓN (que OMITE la cantidad)
        const dataToUpdate = productToDB_Update(productData);
        const product = await productDAL.update(id, dataToUpdate);

        return productToFrontend(product);
    }

    /**
     * Eliminar producto
     */
    async deleteProduct(id) {
        const deleted = await productDAL.delete(id);

        if (!deleted) {
            throw new Error('Producto no encontrado');
        }

        return {
            success: true,
            message: 'Producto eliminado exitosamente'
        };
    }

    /**
     * Buscar productos por nombre
     */
    async searchProducts(searchTerm) {
        const products = await productDAL.searchByName(searchTerm);
        return products.map(productToFrontend);
    }

    /**
     * Obtener estadísticas de productos
     */
    async getProductStats() {
        const totalProducts = await productDAL.count();
        const lowStockCount = await productDAL.countLowStock();

        return {
            totalProducts,
            lowStock: lowStockCount,
            outOfStock: 0 // TODO: implementar cuando sea necesario
        };
    }

    /**
     * Añadir stock a un producto de forma transaccional
     * @param {string} productId - ID del producto
     * @param {Object} data - Datos de la entrada
     * @param {number} data.quantity - Cantidad a añadir
     * @param {string} [data.notes] - Notas opcionales
     * @param {string} [data.userId] - ID del usuario (opcional)
     * @returns {Promise<Object>} El producto actualizado
     */
    async addStockToProduct(productId, data) {
        const { quantity, notes, userId } = data;

        // Validaciones básicas
        if (!quantity || quantity <= 0) {
            throw new Error('La cantidad debe ser mayor a 0');
        }

        if (!Number.isInteger(quantity)) {
            throw new Error('La cantidad debe ser un número entero');
        }

        // Iniciar transacción
        const transaction = await sequelize.transaction();

        try {
            // 1. Obtener el stock actual del producto
            const currentStock = await productDAL.getCurrentStock(productId, transaction);

            // 2. Calcular el nuevo stock
            const newStock = currentStock + quantity;

            // 3. Actualizar el stock del producto
            const updatedProduct = await productDAL.addStock(productId, quantity, transaction);

            // 4. Registrar la entrada en el historial
            await inventoryDAL.logEntry({
                productId,
                quantity,
                changeType: 'addition',
                previousStock: currentStock,
                newStock: newStock,
                notes,
                userId
            }, transaction);

            // 5. Confirmar la transacción
            await transaction.commit();

            // 6. Retornar el producto actualizado
            return productToFrontend(updatedProduct);

        } catch (error) {
            // 6. Revertir la transacción en caso de error
            await transaction.rollback();
            throw error;
        }
    }

    /**
     * Obtener el historial de inventario de un producto
     * @param {string} productId - ID del producto
     * @param {Object} [options] - Opciones de consulta
     * @returns {Promise<Array>} Historial del producto
     */
    async getProductInventoryHistory(productId, options = {}) {
        return await inventoryDAL.getProductHistory(productId, options);
    }

    /**
     * Obtener estadísticas del historial de inventario
     * @param {string} [productId] - ID del producto (opcional)
     * @param {Date} [startDate] - Fecha de inicio (opcional)
     * @param {Date} [endDate] - Fecha de fin (opcional)
     * @returns {Promise<Object>} Estadísticas del historial
     */
    async getInventoryHistoryStats(productId, startDate, endDate) {
        return await inventoryDAL.getHistoryStats(productId, startDate, endDate);
    }
}

module.exports = new ProductService();