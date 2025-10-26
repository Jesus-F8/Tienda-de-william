"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  Tag,
  PackagePlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
// --- 1. IMPORTAR COMPONENTES ---
import { useCurrency } from "@/app/contexts/CurrencyContext";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Inventario", href: "/inventory", icon: Package },
  { name: "Categorías", href: "/categories", icon: Tag },
  { name: "Entradas", href: "/entries", icon: PackagePlus },
  { name: "Pedidos", href: "/orders", icon: ShoppingCart },
  { name: "Reportes", href: "/reports", icon: BarChart3 },
  { name: "Configuración", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  // --- 2. LLAMAR AL HOOK DE MONEDA ---
  const { currency, setCurrency } = useCurrency();

  // --- 3. CREAR EL MANEJADOR DEL SWITCH ---
  const handleCurrencyChange = (isNio: boolean) => {
    setCurrency(isNio ? "NIO" : "USD");
  };

  return (
    <aside className="h-screen w-64 border-r border-sidebar-border bg-sidebar">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-primary to-chart-3">
            <span className="font-mono text-lg font-bold text-primary-foreground">
              CM
            </span>
          </div>
          <span className="text-lg font-semibold text-sidebar-foreground">
            Cematlix
          </span>
        </div>

        {/* --- 4. ACTUALIZAR NAVEGACIÓN (para que scrollee si es necesario) --- */}
        <div className="flex-1 overflow-y-auto">
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* --- 5. AÑADIR EL SWITCH DE MONEDA --- */}
        {/* Este div se ancla al final gracias al 'flex-1' del div anterior */}
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="currency-switch"
              className="text-sm font-medium text-sidebar-foreground"
            >
              Moneda (USD / NIO)
            </Label>
            <Switch
              id="currency-switch"
              checked={currency === "NIO"}
              onCheckedChange={handleCurrencyChange}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
