# API Endpoints Documentation

Esta documentación describe todos los endpoints que necesitas implementar en tu backend para la plataforma de gestión de inventario.

**Base URL:** Configurable mediante la variable de entorno `NEXT_PUBLIC_API_URL` (por defecto: `http://localhost:4000/api`)

---

## Productos

### GET /api/products
Obtiene todos los productos del inventario.

**Response:**
\`\`\`json
[
  {
    "id": "string",
    "name": "string",
    "sku": "string",
    "quantity": number,
    "location": "string",
    "status": "available" | "low" | "out_of_stock",
    "category": "string",
    "price": number,
    "lastUpdated": "ISO 8601 date string"
  }
]
\`\`\`

### GET /api/products/:id
Obtiene un producto específico por ID.

**Response:**
\`\`\`json
{
  "id": "string",
  "name": "string",
  "sku": "string",
  "quantity": number,
  "location": "string",
  "status": "available" | "low" | "out_of_stock",
  "category": "string",
  "price": number,
  "lastUpdated": "ISO 8601 date string"
}
\`\`\`

### POST /api/products
Crea un nuevo producto.

**Request Body:**
\`\`\`json
{
  "name": "string",
  "sku": "string",
  "quantity": number,
  "location": "string",
  "category": "string",
  "price": number
}
\`\`\`

**Response:** Mismo formato que GET /api/products/:id

### PUT /api/products/:id
Actualiza un producto existente.

**Request Body:**
\`\`\`json
{
  "name": "string (opcional)",
  "sku": "string (opcional)",
  "quantity": number (opcional),
  "location": "string (opcional)",
  "category": "string (opcional)",
  "price": number (opcional)
}
\`\`\`

**Response:** Mismo formato que GET /api/products/:id

### DELETE /api/products/:id
Elimina un producto.

**Response:** 204 No Content

---

## Categorías

### GET /api/categories
Obtiene todas las categorías.

**Response:**
\`\`\`json
[
  {
    "id": "string",
    "name": "string",
    "description": "string (opcional)",
    "productCount": number,
    "createdAt": "ISO 8601 date string"
  }
]
\`\`\`

### POST /api/categories
Crea una nueva categoría.

**Request Body:**
\`\`\`json
{
  "name": "string",
  "description": "string (opcional)"
}
\`\`\`

**Response:** Mismo formato que GET /api/categories (elemento individual)

### PUT /api/categories/:id
Actualiza una categoría existente.

**Request Body:**
\`\`\`json
{
  "name": "string (opcional)",
  "description": "string (opcional)"
}
\`\`\`

**Response:** Mismo formato que GET /api/categories (elemento individual)

### DELETE /api/categories/:id
Elimina una categoría.

**Response:** 204 No Content

---

## Pedidos

### GET /api/orders
Obtiene todos los pedidos.

**Response:**
\`\`\`json
[
  {
    "id": "string",
    "orderNumber": "string",
    "customer": "string",
    "items": number,
    "total": number,
    "status": "pending" | "processing" | "shipped" | "delivered" | "cancelled",
    "date": "ISO 8601 date string"
  }
]
\`\`\`

### GET /api/orders/:id
Obtiene un pedido específico por ID.

**Response:**
\`\`\`json
{
  "id": "string",
  "orderNumber": "string",
  "customer": "string",
  "items": [
    {
      "productId": "string",
      "productName": "string",
      "quantity": number,
      "price": number
    }
  ],
  "total": number,
  "status": "pending" | "processing" | "shipped" | "delivered" | "cancelled",
  "date": "ISO 8601 date string",
  "shippingAddress": "string (opcional)",
  "notes": "string (opcional)"
}
\`\`\`

### POST /api/orders
Crea un nuevo pedido.

**Request Body:**
\`\`\`json
{
  "customer": "string",
  "items": [
    {
      "productId": "string",
      "quantity": number,
      "price": number
    }
  ],
  "shippingAddress": "string (opcional)",
  "notes": "string (opcional)"
}
\`\`\`

**Response:** Mismo formato que GET /api/orders/:id

### PUT /api/orders/:id
Actualiza un pedido existente.

**Request Body:**
\`\`\`json
{
  "status": "pending" | "processing" | "shipped" | "delivered" | "cancelled",
  "notes": "string (opcional)"
}
\`\`\`

**Response:** Mismo formato que GET /api/orders/:id

### DELETE /api/orders/:id
Elimina un pedido.

**Response:** 204 No Content

---

## Analytics

### GET /api/analytics/dashboard
Obtiene las métricas del dashboard.

**Response:**
\`\`\`json
{
  "totalProducts": number,
  "lowStock": number,
  "totalValue": number,
  "recentActivity": number
}
\`\`\`

### GET /api/analytics/inventory-trend
Obtiene los datos de tendencia del inventario para gráficos.

**Response:**
\`\`\`json
[
  {
    "month": "string",
    "stock": number
  }
]
\`\`\`

### GET /api/analytics/sales
Obtiene los datos de ventas para reportes.

**Response:**
\`\`\`json
[
  {
    "date": "string",
    "sales": number,
    "revenue": number
  }
]
\`\`\`

### GET /api/analytics/category-distribution
Obtiene la distribución de productos por categoría.

**Response:**
\`\`\`json
[
  {
    "category": "string",
    "count": number,
    "percentage": number
  }
]
\`\`\`

---

## Configuración

### GET /api/settings
Obtiene la configuración de la aplicación.

**Response:**
\`\`\`json
{
  "storeName": "string",
  "storeEmail": "string",
  "storePhone": "string",
  "currency": "string",
  "language": "string",
  "lowStockThreshold": number,
  "notifications": {
    "email": boolean,
    "lowStock": boolean,
    "newOrders": boolean
  }
}
\`\`\`

### PUT /api/settings
Actualiza la configuración de la aplicación.

**Request Body:** Mismo formato que GET /api/settings

**Response:** Mismo formato que GET /api/settings

---

## Notas de Implementación

1. **Autenticación:** Considera implementar autenticación JWT o similar para proteger los endpoints.

2. **Validación:** Valida todos los datos de entrada en el backend antes de procesarlos.

3. **Paginación:** Para endpoints que devuelven listas grandes (productos, pedidos), considera implementar paginación:
   \`\`\`
   GET /api/products?page=1&limit=20
   \`\`\`

4. **Filtros:** Implementa filtros para búsquedas más específicas:
   \`\`\`
   GET /api/products?category=Camisas&status=available
   \`\`\`

5. **CORS:** Configura CORS apropiadamente para permitir peticiones desde tu frontend.

6. **Manejo de Errores:** Devuelve códigos de estado HTTP apropiados:
   - 200: Éxito
   - 201: Creado
   - 204: Sin contenido (para DELETE exitoso)
   - 400: Petición inválida
   - 404: No encontrado
   - 500: Error del servidor

7. **Formato de Fecha:** Usa formato ISO 8601 para todas las fechas.

8. **Cálculo de Status:** El status del producto debe calcularse automáticamente:
   - `out_of_stock`: quantity === 0
   - `low`: quantity < lowStockThreshold (por defecto 10)
   - `available`: quantity >= lowStockThreshold
