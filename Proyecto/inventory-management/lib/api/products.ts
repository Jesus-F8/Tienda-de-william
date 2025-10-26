// API client for product endpoints
// Base URL should be configured in environment variables

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

// --- INTERFAZ DE PRODUCTO (Lo que RECIBIMOS) ---
// Esta interfaz está bien, 'category' es el nombre que nos da el backend.
export interface Product {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  location: string;
  status: "in_stock" | "low_stock" | "out_of_stock";
  category: string;
  price: number;
  lastUpdated: string;
}

// --- INTERFAZ DE CREACIÓN (Lo que ENVIAMOS) ---
export interface ProductCreateInput {
  name: string;
  sku: string;
  quantity: number;
  location: string;
  // --- CAMBIO 1 ---
  // El backend espera el ID de la categoría, no el nombre.
  categoryId: string | null;
  price: number;
}

// --- INTERFAZ DE ACTUALIZACIÓN (Lo que ENVIAMOS) ---
// --- CAMBIO 2 ---
// Redefinida para excluir 'quantity' y usar 'categoryId'
export interface ProductUpdateInput {
  id: string; // Necesario para la URL
  name: string;
  sku: string;
  location: string;
  categoryId: string | null;
  price: number;
  // 'quantity' se omite intencionalmente
}

// --- INTERFAZ PARA AÑADIR STOCK ---
export interface StockAdditionInput {
  quantity: number;
  notes?: string;
  userId?: string;
}

// --- INTERFAZ PARA RESPUESTA DE AÑADIR STOCK ---
export interface StockAdditionResponse {
  message: string;
  product: Product;
}

async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    throw new Error("Backend not available - expected JSON response");
  }
  return response.json();
}

const MOCK_PRODUCTS: Product[] = [];

// GET /api/products - Fetch all products
export async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    return await parseResponse<Product[]>(response);
  } catch (error) {
    console.warn("[v0] Backend not available, using mock data:", error);
    return MOCK_PRODUCTS;
  }
}

// GET /api/products/:id - Fetch single product
export async function fetchProductById(id: string): Promise<Product> {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch product");
    }

    return await parseResponse<Product>(response);
  } catch (error) {
    console.warn("[v0] Backend not available, using mock data:", error);
    const product = MOCK_PRODUCTS.find((p) => p.id === id);
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  }
}

// POST /api/products - Create new product
export async function createProduct(
  data: ProductCreateInput
): Promise<Product> {
  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    // --- CAMBIO 3: Manejo de errores mejorado ---
    if (!response.ok) {
      const errorData = await response.json();
      // Lanza el error del validador (errors[0].message) o el error del servicio (error)
      throw new Error(
        errorData.errors
          ? errorData.errors[0].message
          : errorData.error || "Falló al crear el producto"
      );
    }

    return await parseResponse<Product>(response);
  } catch (error) {
    console.error("Error en createProduct:", error);
    throw error; // Re-lanza para que el modal lo atrape
  }
}

// PUT /api/products/:id - Update product
export async function updateProduct(
  data: ProductUpdateInput
): Promise<Product> {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${data.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    // --- CAMBIO 3: Manejo de errores mejorado ---
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.errors
          ? errorData.errors[0].message
          : errorData.error || "Falló al actualizar el producto"
      );
    }

    return await parseResponse<Product>(response);
  } catch (error) {
    console.error("Error en updateProduct:", error);
    throw error; // Re-lanza para que el modal lo atrape
  }
}

// DELETE /api/products/:id - Delete product
export async function deleteProduct(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // --- CAMBIO 3: Manejo de errores mejorado ---
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.errors
          ? errorData.errors[0].message
          : errorData.error || "Falló al eliminar el producto"
      );
    }
  } catch (error) {
    console.error("Error en deleteProduct:", error);
    throw error; // Re-lanza para que el modal lo atrape
  }
}

// POST /api/products/:id/add-stock - Add stock to product
export async function addStock(
  productId: string,
  data: StockAdditionInput
): Promise<StockAdditionResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/products/${productId}/add-stock`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.errors
          ? errorData.errors[0].message
          : errorData.error || "Falló al añadir stock al producto"
      );
    }

    return await parseResponse<StockAdditionResponse>(response);
  } catch (error) {
    console.error("Error en addStock:", error);
    throw error;
  }
}

// GET /api/products/:id/inventory-history - Get inventory history
export async function getInventoryHistory(
  productId: string,
  options: {
    limit?: number;
    offset?: number;
    changeType?: "addition" | "subtraction";
  } = {}
): Promise<any[]> {
  try {
    const params = new URLSearchParams();
    if (options.limit) params.append("limit", options.limit.toString());
    if (options.offset) params.append("offset", options.offset.toString());
    if (options.changeType) params.append("changeType", options.changeType);

    const response = await fetch(
      `${API_BASE_URL}/products/${productId}/inventory-history?${params}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch inventory history");
    }

    return await parseResponse<any[]>(response);
  } catch (error) {
    console.error("Error en getInventoryHistory:", error);
    throw error;
  }
}

export { fetchProducts as getProducts };
