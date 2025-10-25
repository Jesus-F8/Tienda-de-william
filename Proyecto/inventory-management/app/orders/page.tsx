"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { OrdersTable } from "@/components/orders-table"
import { OrderModal } from "@/components/order-modal"
import { getOrders, type Order } from "@/lib/api/orders"

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | undefined>()
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadOrders()
  }, [])

  useEffect(() => {
    if (searchQuery) {
      const filtered = orders.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.customer.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredOrders(filtered)
    } else {
      setFilteredOrders(orders)
    }
  }, [searchQuery, orders])

  const loadOrders = async () => {
    try {
      setIsLoading(true)
      const data = await getOrders()
      setOrders(data)
      setFilteredOrders(data)
    } catch (error) {
      console.error("Error loading orders:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (order: Order) => {
    setSelectedOrder(order)
    setIsModalOpen(true)
  }

  const handleAdd = () => {
    setSelectedOrder(undefined)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedOrder(undefined)
    loadOrders()
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex-1 space-y-6 p-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Pedidos</h1>
            <p className="text-sm text-muted-foreground">Gestiona y rastrea todos tus pedidos</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
            <Button onClick={handleAdd} className="gap-2">
              <Plus className="h-4 w-4" />
              Nuevo Pedido
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por número de pedido o cliente..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Orders Table */}
        <div className="rounded-lg border border-border bg-card">
          <OrdersTable orders={filteredOrders} onEdit={handleEdit} onDelete={loadOrders} isLoading={isLoading} />
        </div>
      </div>

      {/* Order Modal */}
      <OrderModal isOpen={isModalOpen} onClose={handleModalClose} order={selectedOrder} />
    </div>
  )
}
