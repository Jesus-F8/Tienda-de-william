const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define('Category', {
    // ID único de la categoría (UUID)
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },

    // Nombre de la categoría
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: {
            msg: 'El nombre de la categoría ya existe'
        },
        validate: {
            notEmpty: { msg: 'El nombre no puede estar vacío' },
            len: { args: [2, 100], msg: 'El nombre debe tener entre 2 y 100 caracteres' }
        }
    },

    // Descripción opcional
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
            len: { args: [0, 500], msg: 'La descripción no puede exceder 500 caracteres' }
        }
    }
}, {
    // Configuración de la tabla
    tableName: 'categories',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Category;
