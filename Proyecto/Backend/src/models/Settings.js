// En: src/models/Settings.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Settings = sequelize.define('Settings', {
    // La clave principal (ej: 'exchange_rate_nio')
    key: {
        type: DataTypes.STRING(50),
        primaryKey: true,
        allowNull: false
    },

    // El valor (ej: '36.62')
    value: {
        type: DataTypes.STRING(255),
        allowNull: false
    },

    description: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    // Configuración de la tabla
    tableName: 'settings',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Settings;