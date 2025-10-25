# Documentación de Endpoints del Backend

Esta documentación describe todos los endpoints que necesitas implementar en tu backend para conectar con el frontend de la plataforma de gestión de inventario.

## URL Base

El frontend está configurado para usar: `process.env.NEXT_PUBLIC_API_URL`

Por defecto, si no está configurada, usa: `http://localhost:4000/api`

## Endpoints Requeridos

### 1. Products API

#### GET `/api/products`
Obtener todos los productos del inventario.

**Respuesta esperada:**
\`\`\`json
[
  {
    "id": "1",
    "name": "Camisa Polo Azul",
    "sku": "CAM-001",
    "category": "Camisas",
    "price": 29.99,
    "stock": 45,
    "status": "in_stock" // "in_stock" | "low_stock" | "out_of_stock"
  }
]
\`\`\`

#### GET `/api/products/:id`
Obtener un producto específico por ID.

**Respuesta esperada:**
\`\`\`json
{
  "id": "1",
  "name": "Camisa Polo Azul",
  "sku": "CAM-001",
  "category": "Camisas",
  "price": 29.99,
  "stock": 45,
  "status": "in_stock"
}
\`\`\`

#### POST `/api/products`
Crear un nuevo producto.

**Body esperado:**
\`\`\`json
{
  "name": "Camisa Polo Azul",
  "sku": "CAM-001",
  "category": "Camisas",
  "price": 29.99,
  "stock": 45
}
\`\`\`

**Respuesta esperada:**
\`\`\`json
{
  "id": "1",
  "name": "Camisa Polo Azul",
  "sku": "CAM-001",
  "category": "Camisas",
  "price": 29.99,
  "stock": 45,
  "status": "in_stock"
}
\`\`\`

#### PUT `/api/products/:id`
Actualizar un producto existente.

**Body esperado:**
\`\`\`json
{
  "name": "Camisa Polo Azul",
  "sku": "CAM-001",
  "category": "Camisas",
  "price": 29.99,
  "stock": 45
}
\`\`\`

**Respuesta esperada:**
\`\`\`json
{
  "id": "1",
  "name": "Camisa Polo Azul",
  "sku": "CAM-001",
  "category": "Camisas",
  "price": 29.99,
  "stock": 45,
  "status": "in_stock"
}
\`\`\`

#### DELETE `/api/products/:id`
Eliminar un producto.

**Respuesta esperada:**
\`\`\`json
{
  "success": true,
  "message": "Producto eliminado exitosamente"
}
\`\`\`

---

### 2. Analytics API

#### GET `/api/analytics/metrics`
Obtener las métricas principales del dashboard.

**Respuesta esperada:**
\`\`\`json
{
  "totalProducts": 0,
  "totalValue": 0,
  "lowStock": 0,
  "outOfStock": 0
}
\`\`\`

#### GET `/api/analytics/inventory-by-month`
Obtener datos de inventario por mes para el gráfico.

**Respuesta esperada:**
\`\`\`json
[
  {
    "month": "Ene",
    "value": 0
  },
  {
    "month": "Feb",
    "value": 0
  }
  // ... más meses
]
\`\`\`

---

### 3. Categories API

#### GET `/api/categories`
Obtener todas las categorías.

**Respuesta esperada:**
\`\`\`json
[
  {
    "id": "1",
    "name": "Camisas",
    "description": "Camisas y polos",
    "productCount": 0
  }
]
\`\`\`

#### POST `/api/categories`
Crear una nueva categoría.

**Body esperado:**
\`\`\`json
{
  "name": "Camisas",
  "description": "Camisas y polos"
}
\`\`\`

**Respuesta esperada:**
\`\`\`json
{
  "id": "1",
  "name": "Camisas",
  "description": "Camisas y polos",
  "productCount": 0
}
\`\`\`

#### PUT `/api/categories/:id`
Actualizar una categoría existente.

**Body esperado:**
\`\`\`json
{
  "name": "Camisas",
  "description": "Camisas y polos"
}
\`\`\`

**Respuesta esperada:**
\`\`\`json
{
  "id": "1",
  "name": "Camisas",
  "description": "Camisas y polos",
  "productCount": 0
}
\`\`\`

#### DELETE `/api/categories/:id`
Eliminar una categoría.

**Respuesta esperada:**
\`\`\`json
{
  "success": true,
  "message": "Categoría eliminada exitosamente"
}
\`\`\`

---

### 4. Orders API

#### GET `/api/orders`
Obtener todos los pedidos.

**Respuesta esperada:**
\`\`\`json
[
  {
    "id": "1",
    "orderNumber": "ORD-001",
    "customer": "Juan Pérez",
    "date": "2024-01-15",
    "total": 150.00,
    "status": "pending" // "pending" | "processing" | "completed" | "cancelled"
  }
]
\`\`\`

#### POST `/api/orders`
Crear un nuevo pedido.

**Body esperado:**
\`\`\`json
{
  "customer": "Juan Pérez",
  "items": [
    {
      "productId": "1",
      "quantity": 2,
      "price": 29.99
    }
  ],
  "total": 59.98
}
\`\`\`

**Respuesta esperada:**
\`\`\`json
{
  "id": "1",
  "orderNumber": "ORD-001",
  "customer": "Juan Pérez",
  "date": "2024-01-15",
  "total": 59.98,
  "status": "pending"
}
\`\`\`

#### PUT `/api/orders/:id`
Actualizar el estado de un pedido.

**Body esperado:**
\`\`\`json
{
  "status": "completed"
}
\`\`\`

**Respuesta esperada:**
\`\`\`json
{
  "id": "1",
  "orderNumber": "ORD-001",
  "customer": "Juan Pérez",
  "date": "2024-01-15",
  "total": 59.98,
  "status": "completed"
}
\`\`\`

---

## Configuración del Frontend

Para conectar el frontend con tu backend, configura la variable de entorno:

\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
\`\`\`

O la URL de tu servidor en producción.

## Notas Importantes

1. **CORS**: Asegúrate de configurar CORS en tu backend para permitir peticiones desde el frontend
2. **Validación**: Implementa validación de datos en el backend
3. **Autenticación**: Considera agregar autenticación JWT si es necesario
4. **Manejo de Errores**: Devuelve códigos de estado HTTP apropiados (200, 201, 400, 404, 500, etc.)
5. **Status del Producto**: El status se calcula automáticamente:
   - `in_stock`: stock > 10
   - `low_stock`: stock > 0 && stock <= 10
   - `out_of_stock`: stock === 0

## Estructura de Archivos del Frontend

Los archivos que hacen las peticiones al backend están en:
- `lib/api/products.ts` - Funciones para productos
- `lib/api/analytics.ts` - Funciones para analytics
- `lib/api/categories.ts` - Funciones para categorías
- `lib/api/orders.ts` - Funciones para pedidos

Cada archivo contiene funciones que hacen fetch a los endpoints correspondientes.
\`\`\`

```typescriptreact file="backend-endpoints/products.js" isDeleted="true"
...deleted...
