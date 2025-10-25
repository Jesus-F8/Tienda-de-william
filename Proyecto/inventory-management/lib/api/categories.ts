const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api"

export interface Category {
  id: string
  name: string
  description?: string
  productCount: number
  createdAt: string
}

const mockCategories: Category[] = []

/**
 * GET /api/categories
 *
 * Obtiene todas las categorías del sistema
 *
 * Respuesta esperada del backend:
 * [
 *   {
 *     "id": "uuid-o-string-unico",
 *     "name": "Camisas",
 *     "description": "Camisas y blusas de todo tipo",
 *     "productCount": 45,
 *     "createdAt": "2024-01-15T10:30:00Z"
 *   }
 * ]
 *
 * Si no hay categorías, devolver array vacío: []
 */
export async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`)

    if (!response.ok) {
      console.log("[v0] Backend not available, using mock categories")
      return mockCategories
    }

    const contentType = response.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      console.log("[v0] Invalid response type, using mock categories")
      return mockCategories
    }

    return await response.json()
  } catch (error) {
    console.log("[v0] Error fetching categories, using mock data:", error)
    return mockCategories
  }
}

/**
 * POST /api/categories
 *
 * Crea una nueva categoría
 *
 * Body esperado:
 * {
 *   "name": "Camisas",
 *   "description": "Camisas y blusas de todo tipo"
 * }
 *
 * Respuesta esperada:
 * {
 *   "id": "uuid-generado",
 *   "name": "Camisas",
 *   "description": "Camisas y blusas de todo tipo",
 *   "productCount": 0,
 *   "createdAt": "2024-01-15T10:30:00Z"
 * }
 */
export async function createCategory(category: Omit<Category, "id" | "productCount" | "createdAt">): Promise<Category> {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(category),
    })

    if (!response.ok) {
      throw new Error("Failed to create category")
    }

    return await response.json()
  } catch (error) {
    console.error("[v0] Error creating category:", error)
    throw error
  }
}

/**
 * PUT /api/categories/:id
 *
 * Actualiza una categoría existente
 *
 * Body esperado:
 * {
 *   "id": "uuid-de-la-categoria",
 *   "name": "Camisas Actualizadas",
 *   "description": "Nueva descripción",
 *   "productCount": 50,
 *   "createdAt": "2024-01-15T10:30:00Z"
 * }
 *
 * Respuesta esperada: objeto Category completo actualizado
 */
export async function updateCategory(category: Category): Promise<Category> {
  try {
    const response = await fetch(`${API_BASE_URL}/categories/${category.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(category),
    })

    if (!response.ok) {
      throw new Error("Failed to update category")
    }

    return await response.json()
  } catch (error) {
    console.error("[v0] Error updating category:", error)
    throw error
  }
}

/**
 * DELETE /api/categories/:id
 *
 * Elimina una categoría
 *
 * Respuesta esperada: 204 No Content o 200 OK sin body
 */
export async function deleteCategory(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error("Failed to delete category")
    }
  } catch (error) {
    console.error("[v0] Error deleting category:", error)
    throw error
  }
}
