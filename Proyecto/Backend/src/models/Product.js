const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
    // ID único del producto (UUID)
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },

    // Nombre del producto
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: { msg: 'El nombre no puede estar vacío' }
        }
    },

    // SKU único del producto
    sku: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: {
            msg: 'El SKU ya existe'
        },
        validate: {
            notEmpty: { msg: 'El SKU no puede estar vacío' }
        }
    },

    // Cantidad en stock (quantity en DB, pero lo expondremos como stock)
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: { args: [0], msg: 'La cantidad no puede ser negativa' }
        }
    },

    // Ubicación física en el almacén
    location: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: { msg: 'La ubicación no puede estar vacía' }
        }
    },

    // Relación con la tabla categories (Foreign Key)
    categoryId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'category_id', // Nombre real en la DB
        references: {
            model: 'categories',
            key: 'id'
        }
    },

    // Precio del producto
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: { args: [0.01], msg: 'El precio debe ser mayor a 0' }
        }
    },

    // Campo VIRTUAL: se calcula dinámicamente, no existe en la DB
    status: {
        type: DataTypes.VIRTUAL,
        get() {
            const qty = this.getDataValue('quantity');
            if (qty === 0) return 'out_of_stock';
            if (qty <= 10) return 'low_stock';
            return 'in_stock';
        }
    }
}, {
    // Configuración de la tabla
    tableName: 'products',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Product;