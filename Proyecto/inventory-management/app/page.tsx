"use client"

import { useEffect, useState } from "react"
import { MetricCard } from "@/components/metric-card"
import { InventoryChart } from "@/components/inventory-chart"
import { ProductTable } from "@/components/product-table"
import { Package, TrendingDown, DollarSign } from "lucide-react"
import { fetchProducts } from "@/lib/api/products"
import { fetchDashboardMetrics, fetchInventoryByMonth } from "@/lib/api/analytics"
import type { Product } from "@/lib/api/products"
import type { DashboardMetrics, InventoryByMonth } from "@/lib/api/analytics"

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [chartData, setChartData] = useState<InventoryByMonth[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadData = async () => {
    setIsLoading(true)
    const [productsData, metricsData, chartDataResponse] = await Promise.all([
      fetchProducts(),
      fetchDashboardMetrics(),
      fetchInventoryByMonth(),
    ])
    setProducts(productsData)
    setMetrics(metricsData)
    setChartData(chartDataResponse)
    setIsLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-balance text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="mt-1 text-pretty text-sm text-muted-foreground">Resumen general de tu inventario</p>
        </div>

        {/* Metrics */}
        <div className="grid gap-6 md:grid-cols-3">
          <MetricCard title="Productos Totales" value={metrics?.totalProducts || 0} icon={Package} />
          <MetricCard title="Stock Bajo" value={metrics?.lowStock || 0} icon={TrendingDown} />
          <MetricCard
            title="Ventas Hoy"
            value={`$${metrics?.salesToday.toLocaleString() || 0}`}
            icon={DollarSign}
            trend={{
              value: metrics?.salesChange || 0,
              isPositive: (metrics?.salesChange || 0) > 0,
            }}
          />
        </div>

        {/* Chart */}
        <InventoryChart data={chartData} />

        {/* Products Table */}
        <ProductTable products={products} onProductUpdate={loadData} />
      </div>
    </div>
  )
}
