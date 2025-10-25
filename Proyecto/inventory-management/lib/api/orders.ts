const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api"

export interface Order {
  id: string
  orderNumber: string
  customer: string
  date: string
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
}

const mockOrders: Order[] = []

/**
 * GET /api/orders
 *
 * Obtiene todos los pedidos del sistema
 *
 * Respuesta esperada del backend:
 * [
 *   {
 *     "id": "uuid-o-string-unico",
 *     "orderNumber": "ORD-001",
 *     "customer": "Juan Pérez",
 *     "date": "2024-01-15T10:30:00Z",
 *     "total": 1250.00,
 *     "status": "pending" | "processing" | "shipped" | "delivered" | "cancelled"
 *   }
 * ]
 *
 * Si no hay pedidos, devolver array vacío: []
 */
export async function getOrders(): Promise<Order[]> {
  try {
    const response = await fetch(`${API_URL}/orders`)

    if (!response.ok) {
      console.warn("Backend not available, using mock data")
      return mockOrders
    }

    const contentType = response.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      console.warn("Invalid response format, using mock data")
      return mockOrders
    }

    return await response.json()
  } catch (error) {
    console.warn("Error fetching orders, using mock data:", error)
    return mockOrders
  }
}

/**
 * POST /api/orders
 *
 * Crea un nuevo pedido
 *
 * Body esperado:
 * {
 *   "orderNumber": "ORD-001",
 *   "customer": "Juan Pérez",
 *   "total": 1250.00,
 *   "status": "pending"
 * }
 *
 * Respuesta esperada:
 * {
 *   "id": "uuid-generado",
 *   "orderNumber": "ORD-001",
 *   "customer": "Juan Pérez",
 *   "date": "2024-01-15T10:30:00Z",
 *   "total": 1250.00,
 *   "status": "pending"
 * }
 */
export async function createOrder(order: Omit<Order, "id" | "date">): Promise<Order> {
  try {
    const response = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    })

    if (!response.ok) {
      throw new Error("Failed to create order")
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating order:", error)
    throw error
  }
}

/**
 * PUT /api/orders/:id
 *
 * Actualiza un pedido existente
 *
 * Body esperado (campos opcionales):
 * {
 *   "customer": "Juan Pérez Actualizado",
 *   "status": "shipped",
 *   "total": 1300.00
 * }
 *
 * Respuesta esperada: objeto Order completo actualizado
 */
export async function updateOrder(id: string, order: Partial<Order>): Promise<Order> {
  try {
    const response = await fetch(`${API_URL}/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    })

    if (!response.ok) {
      throw new Error("Failed to update order")
    }

    return await response.json()
  } catch (error) {
    console.error("Error updating order:", error)
    throw error
  }
}

/**
 * DELETE /api/orders/:id
 *
 * Elimina un pedido
 *
 * Respuesta esperada: 204 No Content o 200 OK sin body
 */
export async function deleteOrder(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/orders/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error("Failed to delete order")
    }
  } catch (error) {
    console.error("Error deleting order:", error)
    throw error
  }
}
