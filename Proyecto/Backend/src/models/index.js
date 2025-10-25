// En: src/models/index.js

const sequelize = require('../config/database');

// --- 1. IMPORTAR TODOS LOS MODELOS ---
// Nota: Ahora todas las importaciones son simples, sin (sequelize)
const Category = require('./Category');
const Product = require('./Product');
const Order = require('./Order');
const OrderItem = require('./OrderItem');

// --- 2. DEFINIR ASOCIACIONES ---

// Asociación 1:N (Categoría <-> Producto)
Product.belongsTo(Category, {
    foreignKey: 'category_id', // Tu Product.js ya define 'categoryId'
    as: 'categoryData'
});
Category.hasMany(Product, {
    foreignKey: 'category_id',
    as: 'products'
});

// Asociación N:M (Pedido <-> Producto) a través de OrderItem
Order.hasMany(OrderItem, {
    foreignKey: 'order_id',
    as: 'items'
});
OrderItem.belongsTo(Order, {
    foreignKey: 'order_id'
});

Product.hasMany(OrderItem, {
    foreignKey: 'product_id',
    as: 'orderItems'
});
OrderItem.belongsTo(Product, {
    foreignKey: 'product_id'
});

// --- 3. EXPORTAR TODO ---
module.exports = {
    sequelize,
    Category,
    Product,
    Order,
    OrderItem
};