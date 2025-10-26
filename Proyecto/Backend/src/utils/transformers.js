/**
 * Transformadores de datos entre Base de Datos y Frontend
 * Centraliza la lógica de conversión de formatos
 */

/**
 * Transforma un producto de DB a formato Frontend
 */
function productToFrontend(product) {
    const data = product.toJSON ? product.toJSON() : product;

    return {
        id: data.id,
        name: data.name,
        sku: data.sku,
        quantity: data.quantity,
        location: data.location,
        category: data.categoryData?.name || 'Sin categoría',
        price: parseFloat(data.price),
        status: data.status,
        lastUpdated: data.updated_at || data.lastUpdated
    };
}

/**
 * Transforma datos del Frontend a formato DB para CREAR
 * (Incluye la cantidad)
 */
function productToDB_Create(frontendData) {
    return {
        name: frontendData.name,
        sku: frontendData.sku,
        quantity: frontendData.quantity, // <-- La cantidad SÍ está aquí
        location: frontendData.location,
        price: frontendData.price,
        categoryId: frontendData.categoryId || null
    };
}

/**
 * Transforma datos del Frontend a formato DB para ACTUALIZAR
 * (Omite la cantidad)
 */
function productToDB_Update(frontendData) {
    return {
        name: frontendData.name,
        sku: frontendData.sku,
        // <-- 'quantity' se omite intencionalmente
        location: frontendData.location,
        price: frontendData.price,
        categoryId: frontendData.categoryId || null
    };
}

/**
 * Transforma una categoría de DB a formato Frontend
 */
function categoryToFrontend(category) {
    const data = category.toJSON ? category.toJSON() : category;

    return {
        id: data.id,
        name: data.name,
        description: data.description,
        productCount: data.productCount || data.products?.length || 0,
        createdAt: data.created_at
    };
}

/**
 * Transforma datos de categoría del Frontend a formato DB
 */
function categoryToDB(frontendData) {
    return {
        name: frontendData.name,
        description: frontendData.description
    };
}

module.exports = {
    productToFrontend,
    productToDB_Create, // <-- Nuevo
    productToDB_Update, // <-- Renombrado
    categoryToFrontend,
    categoryToDB
};