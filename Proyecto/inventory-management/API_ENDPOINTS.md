# Endpoints del Backend - Sistema de Gestión de Inventario

Este documento describe todos los endpoints que necesitas implementar en tu backend.

## Base URL
\`\`\`
http://localhost:4000/api
\`\`\`

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

### PUT /api/products/:id
Actualiza un producto existente.

**Request Body:**
\`\`\`json
{
  "name": "string (optional)",
  "sku": "string (optional)",
  "quantity": number (optional),
  "location": "string (optional)",
  "category": "string (optional)",
  "price": number (optional)
}
\`\`\`

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

### DELETE /api/products/:id
Elimina un producto.

**Response:**
\`\`\`json
{
  "message": "Product deleted successfully"
}
\`\`\`

## Analytics

### GET /api/analytics/metrics
Obtiene las métricas del dashboard.

**Response:**
\`\`\`json
{
  "totalProducts": number,
  "lowStock": number,
  "salesToday": number,
  "salesChange": number
}
\`\`\`

### GET /api/analytics/inventory-by-month
Obtiene los datos de inventario por mes para el gráfico.

**Response:**
\`\`\`json
[
  {
    "month": "string",
    "quantity": number
  }
]
\`\`\`

## Notas de Implementación

1. **Status del Producto**: El campo `status` debe calcularse automáticamente:
   - `available`: quantity > 20
   - `low`: quantity > 0 && quantity <= 20
   - `out_of_stock`: quantity === 0

2. **Validaciones Recomendadas**:
   - SKU debe ser único
   - Quantity no puede ser negativo
   - Price debe ser mayor a 0
   - Name, SKU, location y category son campos requeridos

3. **CORS**: Asegúrate de configurar CORS para permitir peticiones desde `http://localhost:3000`

4. **Variables de Entorno**: 
   - El frontend espera la URL del backend en `NEXT_PUBLIC_API_URL`
   - Por defecto usa `http://localhost:4000/api`
