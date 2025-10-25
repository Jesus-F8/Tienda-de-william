// En: src/models/OrderItem.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // <-- Importamos sequelize

// Definimos el modelo directamente
const OrderItem = sequelize.define('OrderItem', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'created_at'
    }
}, {
    tableName: 'order_items',
    timestamps: true,
    updatedAt: false, // Tu schema SQL solo tiene 'created_at'
    createdAt: 'created_at'
});

// Exportamos el modelo
module.exports = OrderItem;