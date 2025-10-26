const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const InventoryHistory = sequelize.define('InventoryHistory', {
    // ID único del registro (UUID)
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },

    // ID del producto relacionado
    productId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'product_id',
        references: {
            model: 'products',
            key: 'id'
        }
    },

    // Cantidad que se añadió/quita del stock
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notNull: { msg: 'La cantidad es requerida' },
            isInt: { msg: 'La cantidad debe ser un número entero' }
        }
    },

    // Tipo de cambio: 'addition' (entrada) o 'subtraction' (salida)
    changeType: {
        type: DataTypes.ENUM('addition', 'subtraction'),
        allowNull: false,
        field: 'change_type',
        defaultValue: 'addition',
        validate: {
            isIn: {
                args: [['addition', 'subtraction']],
                msg: 'El tipo de cambio debe ser addition o subtraction'
            }
        }
    },

    // Stock anterior antes del cambio
    previousStock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'previous_stock',
        validate: {
            min: { args: [0], msg: 'El stock anterior no puede ser negativo' }
        }
    },

    // Stock posterior después del cambio
    newStock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'new_stock',
        validate: {
            min: { args: [0], msg: 'El nuevo stock no puede ser negativo' }
        }
    },

    // Notas opcionales sobre la operación
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
            len: {
                args: [0, 500],
                msg: 'Las notas no pueden exceder 500 caracteres'
            }
        }
    },

    // Usuario que realizó la operación (opcional para futuras implementaciones)
    userId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'user_id'
    }
}, {
    // Configuración de la tabla
    tableName: 'inventory_history',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',

    // Índices para mejorar performance
    indexes: [
        {
            fields: ['product_id']
        },
        {
            fields: ['created_at']
        },
        {
            fields: ['change_type']
        }
    ]
});

module.exports = InventoryHistory;
