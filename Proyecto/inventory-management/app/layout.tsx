import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { AppLayout } from "@/components/app-layout";
import { Toaster } from "@/components/ui/toaster";
import { CurrencyProvider } from "@/app/contexts/CurrencyContext";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cematlix - Gestión de Inventario",
  description: "Sistema de gestión de inventario para tienda de ropa",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  // --- CAMBIO AQUÍ ---
  children: React.ReactNode; // El tipo correcto es ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`font-sans antialiased`}>
        <CurrencyProvider>
          <AppLayout>{children}</AppLayout>
        </CurrencyProvider>

        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
