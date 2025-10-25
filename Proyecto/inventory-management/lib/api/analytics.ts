// API client for analytics endpoints

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export interface DashboardMetrics {
  totalProducts: number;
  lowStock: number;
  salesToday: number;
  salesChange: number;
}

export interface InventoryByMonth {
  month: string;
  quantity: number;
}

async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    throw new Error("Backend not available - expected JSON response");
  }
  return response.json();
}

const MOCK_METRICS: DashboardMetrics = {
  totalProducts: 0,
  lowStock: 0,
  salesToday: 0,
  salesChange: 0,
};

const MOCK_INVENTORY_TRENDS: InventoryByMonth[] = [
  { month: "Ene", quantity: 0 },
  { month: "Feb", quantity: 0 },
  { month: "Mar", quantity: 0 },
  { month: "Abr", quantity: 0 },
  { month: "May", quantity: 0 },
  { month: "Jun", quantity: 0 },
];

// GET /api/analytics/metrics - Fetch dashboard metrics
export async function fetchDashboardMetrics(): Promise<DashboardMetrics> {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/metrics`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch metrics");
    }

    return await parseResponse<DashboardMetrics>(response);
  } catch (error) {
    console.warn("[v0] Backend not available, using mock data:", error);
    return MOCK_METRICS;
  }
}

// GET /api/analytics/inventory-by-month - Fetch inventory trends
export async function fetchInventoryByMonth(): Promise<InventoryByMonth[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/analytics/inventory-by-month`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch inventory trends");
    }

    return await parseResponse<InventoryByMonth[]>(response);
  } catch (error) {
    console.warn("[v0] Backend not available, using mock data:", error);
    return MOCK_INVENTORY_TRENDS;
  }
}
