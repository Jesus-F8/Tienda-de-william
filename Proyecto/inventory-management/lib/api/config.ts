// En: lib/api/config.ts

// Usamos la misma URL base
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

// Esta es la respuesta que esperamos de GET /api/config
export interface AppConfig {
  exchange_rate_nio: string;
  // ... otras configuraciones globales
}

/**
 * Parsea la respuesta JSON
 */
async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    throw new Error("Backend not available - expected JSON response");
  }
  return response.json();
}

/**
 * GET /api/config - Obtiene todas las configuraciones de la app
 */
export async function fetchConfig(): Promise<AppConfig> {
  try {
    // --- CAMBIO AQUÍ ---
    // Apuntamos al nuevo endpoint /config
    const response = await fetch(`${API_BASE_URL}/config`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.errors
          ? errorData.errors[0].message
          : errorData.error || "Falló al cargar la configuración"
      );
    }

    return await parseResponse<AppConfig>(response);
  } catch (error) {
    console.error("Error fetching config:", error);
    // Valor de fallback
    return {
      exchange_rate_nio: "36.62",
    };
  }
}
