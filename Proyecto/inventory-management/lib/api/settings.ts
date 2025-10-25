const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api"

export interface Settings {
  company?: {
    name: string
    taxId: string
    address: string
    phone: string
    email: string
    website: string
  }
  user?: {
    name: string
    firstName: string
    lastName: string
    email: string
    phone: string
    position: string
    avatar?: string
  }
  notifications?: {
    inventoryAlerts: boolean
    newOrders: boolean
    weeklyReports: boolean
    pushEnabled: boolean
  }
  security?: {
    twoFactorEnabled: boolean
  }
  appearance?: {
    theme: "light" | "dark" | "system"
    language: "es" | "en"
    dateFormat: "dd/mm/yyyy" | "mm/dd/yyyy" | "yyyy-mm-dd"
  }
}

// Mock data for development
const mockSettings: Settings = {
  company: {
    name: "Cematlix",
    taxId: "RFC123456789",
    address: "Av. Principal 123, Ciudad, Estado, CP 12345",
    phone: "+52 123 456 7890",
    email: "contacto@cematlix.com",
    website: "https://www.cematlix.com",
  },
  user: {
    name: "Admin",
    firstName: "Juan",
    lastName: "Pérez",
    email: "admin@cematlix.com",
    phone: "+52 123 456 7890",
    position: "Administrador",
  },
  notifications: {
    inventoryAlerts: true,
    newOrders: true,
    weeklyReports: false,
    pushEnabled: false,
  },
  security: {
    twoFactorEnabled: false,
  },
  appearance: {
    theme: "light",
    language: "es",
    dateFormat: "dd/mm/yyyy",
  },
}

export async function getSettings(): Promise<Settings> {
  try {
    const response = await fetch(`${API_URL}/settings`)

    if (!response.ok) {
      console.warn("Backend not available, using mock data")
      return mockSettings
    }

    const contentType = response.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      console.warn("Invalid response format, using mock data")
      return mockSettings
    }

    return await response.json()
  } catch (error) {
    console.warn("Error fetching settings, using mock data:", error)
    return mockSettings
  }
}

export async function updateSettings(settings: Partial<Settings>): Promise<Settings> {
  try {
    const response = await fetch(`${API_URL}/settings`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    })

    if (!response.ok) {
      throw new Error("Failed to update settings")
    }

    return await response.json()
  } catch (error) {
    console.error("Error updating settings:", error)
    throw error
  }
}
