const Product = require('../models/Product');
const { Op } = require('sequelize');

/**
 * Data Access Layer - Solo consultas a la base de datos
 * NO contiene validaciones ni lógica de negocio
 */
class ProductDAL {

    /**
     * Configuración común para incluir categoría
     */
    _getIncludeConfig() {
        return [{
            association: 'categoryData',
            attributes: ['name'],
            required: false
        }];
    }

    /**
     * Obtener todos los productos
     */
    async findAll() {
        return await Product.findAll({
            include: this._getIncludeConfig(),
            order: [['updated_at', 'DESC']]
        });
    }

    /**
     * Obtener producto por ID
     */
    async findById(id) {
        return await Product.findByPk(id, {
            include: this._getIncludeConfig()
        });
    }

    /**
     * Buscar producto por SKU
     */
    async findBySku(sku, excludeId = null) {
        const where = { sku };
        if (excludeId) {
            where.id = { [Op.ne]: excludeId };
        }
        return await Product.findOne({ where });
    }

    /**
     * Crear producto
     */
    async create(data) {
        const product = await Product.create(data);
        return await this.findById(product.id); // Recargar con categoría
    }

    /**
     * Actualizar producto
     */
    async update(id, data) {
        const product = await Product.findByPk(id);
        if (!product) return null;

        await product.update(data);
        return await this.findById(id); // Recargar con categoría
    }

    /**
     * Eliminar producto
     */
    async delete(id) {
        const product = await Product.findByPk(id);
        if (!product) return false;

        await product.destroy();
        return true;
    }

    /**
     * Contar productos
     */
    async count() {
        return await Product.count();
    }

    /**
     * Buscar productos por nombre
     */
    async searchByName(searchTerm) {
        return await Product.findAll({
            where: {
                name: { [Op.iLike]: `%${searchTerm}%` }
            },
            include: this._getIncludeConfig()
        });
    }

    /**
     * Contar productos con stock bajo
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
}

module.exports = new ProductDAL();