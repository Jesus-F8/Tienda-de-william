"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
// --- CAMBIO AQUÍ ---
// Importamos la función correcta desde el archivo API correcto
import { fetchConfig } from "@/lib/api/config";

// 1. Definir el tipo de moneda
export type Currency = "USD" | "NIO";

// 2. Definir qué valores tendrá nuestro contexto
interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  exchangeRate: number;
  formatPrice: (priceInUsd: number) => string;
}

// 3. Crear el Contexto
const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined
);

// 4. Crear el "Proveedor" (El componente que envuelve la app)
export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("USD"); // Moneda por defecto
  const [exchangeRate, setExchangeRate] = useState<number>(36.62); // Tasa por defecto

  // Cargar la tasa de cambio desde el backend cuando la app inicia
  useEffect(() => {
    async function loadConfig() {
      try {
        // --- CAMBIO AQUÍ ---
        const config = await fetchConfig(); // Llamamos a la nueva función
        const rate = parseFloat(config.exchange_rate_nio);
        if (!isNaN(rate) && rate > 0) {
          setExchangeRate(rate);
        }
      } catch (error) {
        console.error("Failed to load exchange rate from /api/config:", error);
      }
    }
    loadConfig();
  }, []);

  // 5. Crear la función mágica de formato
  const formatPrice = (priceInUsd: number) => {
    if (currency === "NIO") {
      const priceInNio = priceInUsd * exchangeRate;
      // Formato Córdobas
      // (Usamos toLocaleString para los separadores de miles)
      return `C$${priceInNio.toLocaleString("es-NI", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    }
    // Formato Dólares
    return `$${priceInUsd.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // 6. Memorizar los valores para optimizar rendimiento
  const value = useMemo(
    () => ({
      currency,
      setCurrency,
      exchangeRate,
      formatPrice,
    }),
    [currency, exchangeRate]
  );

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

// 7. Crear el "Hook" (La forma fácil de usar el contexto)
export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency debe ser usado dentro de un CurrencyProvider");
  }
  return context;
}
