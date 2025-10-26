// API client for product endpoints
// Base URL should be configured in environment variables

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

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

export interface ProductCreateInput {
  name: string;
  sku: string;
  quantity: number;
  location: string;
  category: string;
  price: number;
}

export interface ProductUpdateInput extends Partial<ProductCreateInput> {
  id: string;
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

    console.log("EL ERROR FEO ES: ", response);

    if (!response.ok) {
      throw new Error("Failed to create product");
    }

    return await parseResponse<Product>(response);
  } catch (error) {
    console.error("Error en createProduct:", error);
    throw error;
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

    if (!response.ok) {
      throw new Error("Failed to update product");
    }

    return await parseResponse<Product>(response);
  } catch (error) {
    console.error("Error en updateProduct:", error);
    throw error;
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

    if (!response.ok) {
      throw new Error("Failed to delete product");
    }
  } catch (error) {
    console.error("Error en deleteProduct:", error);
    throw error;
  }
}

export { fetchProducts as getProducts };
