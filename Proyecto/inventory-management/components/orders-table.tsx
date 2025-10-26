"use client";

import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Order } from "@/lib/api/orders";
// --- 1. IMPORTAR EL HOOK DE MONEDA ---
import { useCurrency } from "@/app/contexts/CurrencyContext";

interface OrdersTableProps {
  orders: Order[];
  onEdit: (order: Order) => void;
  onDelete: () => void;
  isLoading?: boolean;
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  processing: "bg-blue-100 text-blue-800 border-blue-200",
  shipped: "bg-purple-100 text-purple-800 border-purple-200",
  delivered: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
};

export function OrdersTable({
  orders,
  onEdit,
  onDelete,
  isLoading,
}: OrdersTableProps) {
  // --- 2. LLAMAR AL HOOK ---
  // Obtenemos la función 'formatPrice' del contexto
  const { formatPrice } = useCurrency();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">Cargando pedidos...</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Número de Pedido</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium">{order.orderNumber}</TableCell>
            <TableCell>{order.customer}</TableCell>
            <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>

            {/* --- 3. USAR LA FUNCIÓN --- */}
            {/* Reemplazamos el formato manual por nuestra función global */}
            <TableCell>{formatPrice(order.total)}</TableCell>

            <TableCell>
              <Badge variant="outline" className={statusColors[order.status]}>
                {order.status === "pending" && "Pendiente"}
                {order.status === "processing" && "Procesando"}
                {order.status === "shipped" && "Enviado"}
                {order.status === "delivered" && "Entregado"}
                {order.status === "cancelled" && "Cancelado"}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Eye className="mr-2 h-4 w-4" />
                    Ver Detalles
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit(order)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
