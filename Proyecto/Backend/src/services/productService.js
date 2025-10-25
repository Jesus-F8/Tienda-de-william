const productDAL = require('../dal/productDAL');
const { productToFrontend, productToDB } = require('../utils/transformers');

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
        const dataToCreate = productToDB(productData);
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
        const dataToUpdate = productToDB(productData);
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
}

module.exports = new ProductService();
