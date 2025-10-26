"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Package,
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  ShoppingCart,
  Users,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  CheckCircle,
} from "lucide-react";
import {
  fetchProducts,
  fetchCategories,
  type Product,
} from "@/lib/api/products";
import {
  fetchDashboardMetrics,
  fetchInventoryByMonth,
} from "@/lib/api/analytics";
import { useCurrency } from "@/app/contexts/CurrencyContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Tipos para los datos del dashboard
interface DashboardMetrics {
  totalProducts: number;
  lowStock: number;
  salesToday: number;
  salesChange: number;
  totalValue: number;
  categoriesCount: number;
}

interface InventoryByMonth {
  month: string;
  quantity: number;
}

interface CategoryData {
  id: string;
  name: string;
  count: number;
  percentage: number;
}

interface SalesTrend {
  day: string;
  amount: number;
}

interface AlertItem {
  id: string;
  type: "low_stock" | "out_of_stock" | "high_value";
  message: string;
  product: string;
  action: string;
  severity: "low" | "medium" | "high";
}

export default function DashboardPage() {
  const { currency, formatPrice } = useCurrency();
  const { toast } = useToast();

  // Estados principales
  const [products, setProducts] = useState<Product[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [chartData, setChartData] = useState<InventoryByMonth[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTimeframe, setSelectedTimeframe] = useState("7d");

  // Datos calculados
  const categoriesData = useMemo(() => {
    const categoryMap = new Map<string, number>();
    let totalProducts = products.length;

    products.forEach((product) => {
      const categoryName = product.category || "Sin categoría";
      categoryMap.set(categoryName, (categoryMap.get(categoryName) || 0) + 1);
    });

    return Array.from(categoryMap.entries()).map(([name, count]) => ({
      id: name,
      name,
      count,
      percentage:
        totalProducts > 0 ? Math.round((count / totalProducts) * 100) : 0,
    }));
  }, [products]);

  const salesTrendData: SalesTrend[] = useMemo(() => {
    // Datos mockeados para las tendencias de ventas
    const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
    return days.map((day) => ({
      day,
      amount: Math.floor(Math.random() * 1000) + 200,
    }));
  }, []);

  const alerts: AlertItem[] = useMemo(() => {
    return products
      .filter((product) => product.quantity <= 10)
      .slice(0, 5)
      .map((product) => ({
        id: product.id,
        type: product.quantity === 0 ? "out_of_stock" : "low_stock",
        message:
          product.quantity === 0
            ? `Sin stock: ${product.name}`
            : `Stock bajo: ${product.name} (${product.quantity} unidades)`,
        product: product.name,
        action: "Reordenar",
        severity: product.quantity === 0 ? "high" : "medium",
      }));
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  // Cargar datos
  const loadData = async () => {
    setIsLoading(true);
    try {
    const [productsData, metricsData, chartDataResponse] = await Promise.all([
      fetchProducts(),
      fetchDashboardMetrics(),
      fetchInventoryByMonth(),
      ]);

      setProducts(productsData);
      setMetrics(metricsData);
      setChartData(chartDataResponse);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos del dashboard",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Componente de Card de Métrica Mejorada
  const MetricCard = ({
    title,
    value,
    icon: Icon,
    trend,
    description,
    color = "default",
  }: {
    title: string;
    value: string | number;
    icon: React.ComponentType<{ className?: string }>;
    trend?: { value: number; isPositive: boolean };
    description?: string;
    color?: "default" | "success" | "warning" | "danger";
  }) => {
    const colorClasses = {
      default: "bg-linear-to-br from-teal-50 to-emerald-50 border-teal-200",
      success: "bg-linear-to-br from-emerald-50 to-green-50 border-emerald-200",
      warning: "bg-linear-to-br from-amber-50 to-orange-50 border-amber-200",
      danger: "bg-linear-to-br from-rose-50 to-red-50 border-rose-200",
    };

    const iconClasses = {
      default: "text-teal-600",
      success: "text-emerald-600",
      warning: "text-amber-600",
      danger: "text-rose-600",
    };

    return (
      <Card
        className={cn(
          "group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02]",
          colorClasses[color]
        )}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                {title}
              </p>
              <p className="text-3xl font-bold text-foreground">{value}</p>
              {description && (
                <p className="text-xs text-muted-foreground">{description}</p>
              )}
              {trend && (
                <div className="flex items-center gap-1">
                  {trend.isPositive ? (
                    <ArrowUpRight className="h-3 w-3 text-emerald-600" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-rose-600" />
                  )}
                  <span
                    className={cn(
                      "text-xs font-medium",
                      trend.isPositive ? "text-emerald-600" : "text-rose-600"
                    )}
                  >
                    {Math.abs(trend.value)}%
                  </span>
                  <span className="text-xs text-muted-foreground">vs ayer</span>
                </div>
              )}
            </div>
            <div
              className={cn(
                "rounded-full p-3 transition-colors",
                iconClasses[color]
              )}
            >
              <Icon className="h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Componente de Gráfico de Categorías (Pie Chart)
  const CategoryChart = () => {
    const colors = [
      "hsl(190, 70%, 50%)",
      "hsl(200, 70%, 50%)",
      "hsl(210, 70%, 50%)",
      "hsl(220, 70%, 50%)",
      "hsl(230, 70%, 50%)",
    ];

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Distribución por Categorías
          </CardTitle>
          <CardDescription>Productos agrupados por categoría</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categoriesData.map((category, index) => (
              <div
                key={category.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  />
                  <span className="text-sm font-medium">{category.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {category.count} productos
                  </span>
                  <Badge variant="secondary">{category.percentage}%</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  // Componente de Tendencias de Ventas
  const SalesTrendChart = () => {
    const maxAmount = Math.max(...salesTrendData.map((d) => d.amount));

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Tendencias de Ventas
          </CardTitle>
          <CardDescription>Últimos 7 días</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {salesTrendData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{item.day}</span>
                  <span className="text-muted-foreground">
                    {formatPrice(item.amount)}
                  </span>
                </div>
                <Progress
                  value={(item.amount / maxAmount) * 100}
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  // Componente de Alertas
  const AlertsSection = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Alertas Rápidas
        </CardTitle>
        <CardDescription>Acciones requeridas</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No hay alertas pendientes</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg border transition-colors",
                  alert.severity === "high"
                    ? "bg-rose-50 border-rose-200"
                    : "bg-amber-50 border-amber-200"
                )}
              >
                <div className="flex items-center gap-3">
                  <AlertCircle
                    className={cn(
                      "h-4 w-4",
                      alert.severity === "high"
                        ? "text-rose-600"
                        : "text-amber-600"
                    )}
                  />
                  <div>
                    <p className="text-sm font-medium">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {alert.product}
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  {alert.action}
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );

  // Componente de Tabla de Productos Mejorada
  const ProductsTable = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Productos Recientes
            </CardTitle>
            <CardDescription>
              Últimos productos agregados al inventario
            </CardDescription>
          </div>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Agregar Producto
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Barra de búsqueda */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Tabla */}
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Producto
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      SKU
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Categoría
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Stock
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Precio
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Estado
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.slice(0, 10).map((product) => (
                    <tr
                      key={product.id}
                      className="border-t hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-linear-to-br from-teal-100 to-emerald-100 flex items-center justify-center">
                            <Package className="h-4 w-4 text-teal-600" />
                          </div>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {product.location}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm font-mono">
                        {product.sku}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {product.category || "Sin categoría"}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">
                        {product.quantity}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">
                        {formatPrice(product.price)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            product.status === "in_stock"
                              ? "default"
                              : product.status === "low_stock"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {product.status === "in_stock"
                            ? "Disponible"
                            : product.status === "low_stock"
                            ? "Stock Bajo"
                            : "Sin Stock"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filteredProducts.length > 10 && (
            <div className="text-center">
              <Button variant="outline" size="sm">
                Ver todos los productos ({filteredProducts.length})
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="text-center space-y-4">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
        {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Resumen general de tu inventario
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={loadData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Agregar Producto
          </Button>
        </div>
        </div>

      {/* Métricas Principales */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Productos Totales"
          value={metrics?.totalProducts || 0}
          icon={Package}
          description="En inventario"
          color="default"
        />
        <MetricCard
          title="Stock Bajo"
          value={metrics?.lowStock || 0}
          icon={AlertCircle}
          description="Requieren atención"
          color="warning"
        />
          <MetricCard
            title="Ventas Hoy"
          value={formatPrice(metrics?.salesToday || 0)}
            icon={DollarSign}
            trend={{
              value: metrics?.salesChange || 0,
              isPositive: (metrics?.salesChange || 0) > 0,
            }}
          color="success"
        />
        <MetricCard
          title="Valor Total"
          value={formatPrice(metrics?.totalValue || 0)}
          icon={TrendingUp}
          description="Inventario actual"
          color="default"
        />
      </div>

      {/* Contenido Principal */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Columna Izquierda - Gráficos */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs para diferentes vistas */}
          <Tabs defaultValue="inventory" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="inventory">Inventario</TabsTrigger>
              <TabsTrigger value="sales">Ventas</TabsTrigger>
              <TabsTrigger value="trends">Tendencias</TabsTrigger>
            </TabsList>

            <TabsContent value="inventory" className="space-y-6">
              <CategoryChart />
            </TabsContent>

            <TabsContent value="sales" className="space-y-6">
              <SalesTrendChart />
            </TabsContent>

            <TabsContent value="trends" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Actividad Reciente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Próximamente: Gráfico de actividad</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Tabla de Productos */}
          <ProductsTable />
        </div>

        {/* Columna Derecha - Alertas y Acciones */}
        <div className="space-y-6">
          <AlertsSection />

          {/* Acciones Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Acciones Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start gap-2" variant="outline">
                <Plus className="h-4 w-4" />
                Nueva Entrada de Stock
              </Button>
              <Button className="w-full justify-start gap-2" variant="outline">
                <Package className="h-4 w-4" />
                Agregar Producto
              </Button>
              <Button className="w-full justify-start gap-2" variant="outline">
                <Users className="h-4 w-4" />
                Nuevo Cliente
              </Button>
              <Button className="w-full justify-start gap-2" variant="outline">
                <BarChart3 className="h-4 w-4" />
                Generar Reporte
              </Button>
            </CardContent>
          </Card>

          {/* Resumen de Categorías */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Resumen por Categoría
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categoriesData.slice(0, 5).map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm font-medium">{category.name}</span>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={category.percentage}
                        className="w-16 h-2"
                      />
                      <span className="text-xs text-muted-foreground w-8">
                        {category.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground py-4 border-t">
        <p>© 2024 Cematlix - Sistema de Gestión de Inventario</p>
      </div>
    </div>
  );
}
