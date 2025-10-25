// En: src/models/Order.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // <-- Importamos sequelize

// Definimos el modelo directamente
const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    orderNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        field: 'order_number'
    },
    customer: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'total'
    },
    status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'pending'
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'created_at'
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'updated_at'
    }
}, {
    tableName: 'orders',
    timestamps: true
});

// Exportamos el modelo, no una función
module.exports = Order;