const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api"

export interface ReportData {
  totalSales: number
  productsSold: number
  averageTicket: number
  profitMargin: number
  salesTrend: Array<{ month: string; sales: number }>
  categoryDistribution: Array<{ category: string; sales: number }>
  topProducts: Array<{
    name: string
    category: string
    unitsSold: number
    revenue: number
  }>
}

const mockReportData: ReportData = {
  totalSales: 0,
  productsSold: 0,
  averageTicket: 0,
  profitMargin: 0,
  salesTrend: [],
  categoryDistribution: [],
  topProducts: [],
}

/**
 * GET /api/reports
 *
 * Obtiene los datos de reportes y análisis del sistema
 *
 * Respuesta esperada del backend:
 * {
 *   "totalSales": 125000.50,
 *   "productsSold": 1250,
 *   "averageTicket": 100.00,
 *   "profitMargin": 35.5,
 *   "salesTrend": [
 *     { "month": "Ene", "sales": 18000 },
 *     { "month": "Feb", "sales": 22000 },
 *     { "month": "Mar", "sales": 19500 }
 *   ],
 *   "categoryDistribution": [
 *     { "category": "Camisas", "sales": 45000 },
 *     { "category": "Pantalones", "sales": 32000 },
 *     { "category": "Gorras", "sales": 28000 }
 *   ],
 *   "topProducts": [
 *     {
 *       "name": "Camisa Polo Azul",
 *       "category": "Camisas",
 *       "unitsSold": 125,
 *       "revenue": 6250.00
 *     }
 *   ]
 * }
 *
 * Si no hay datos, devolver estructura con valores en 0 y arrays vacíos
 */
export async function getReports(): Promise<ReportData> {
  try {
    const response = await fetch(`${API_URL}/reports`)

    if (!response.ok) {
      console.warn("Backend not available, using mock data")
      return mockReportData
    }

    const contentType = response.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      console.warn("Invalid response format, using mock data")
      return mockReportData
    }

    return await response.json()
  } catch (error) {
    console.warn("Error fetching reports, using mock data:", error)
    return mockReportData
  }
}
