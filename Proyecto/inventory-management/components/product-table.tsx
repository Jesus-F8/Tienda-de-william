"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/lib/api/products";
import { deleteProduct } from "@/lib/api/products";
import { DeleteConfirmationModal } from "./delete-confirmation-modal";
import { useToast } from "@/hooks/use-toast";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: () => void;
  isLoading?: boolean;
}

export function ProductTable({
  products,
  onEdit,
  onDelete,
  isLoading,
}: ProductTableProps) {
  const { toast } = useToast();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    setIsDeleting(true);
    try {
      await deleteProduct(productToDelete.id);
      toast({
        title: "Producto eliminado",
        description: "El producto se ha eliminado correctamente.",
      });
      setDeleteModalOpen(false);
      setProductToDelete(null);
      onDelete();
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un error al eliminar el producto.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadge = (status: Product["status"]) => {
    const variants = {
      in_stock: "default",
      low_stock: "secondary",
      out_of_stock: "destructive",
    } as const;

    const labels = {
      in_stock: "Disponible",
      low_stock: "Stock Bajo",
      out_of_stock: "Agotado",
    };

    return (
      <Badge variant={variants[status]} className="font-medium">
        {labels[status]}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-muted-foreground">Cargando productos...</div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">No hay productos disponibles</p>
          <p className="text-sm text-muted-foreground">
            Agrega tu primer producto para comenzar
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 pl-6 text-left text-sm font-medium text-muted-foreground">
                Producto
              </th>
              <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                SKU
              </th>
              <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                Categoría
              </th>
              <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                Cantidad
              </th>
              <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                Precio
              </th>
              <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                Estado
              </th>
              <th className="pb-3 pr-6 text-right text-sm font-medium text-muted-foreground">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-b border-border/50 last:border-0"
              >
                <td className="py-4 pl-6 text-sm font-medium text-foreground">
                  {product.name}
                </td>
                <td className="py-4 text-sm text-muted-foreground">
                  {product.sku}
                </td>
                <td className="py-4 text-sm text-muted-foreground">
                  {product.category}
                </td>
                <td className="py-4 text-sm text-foreground">
                  {product.quantity}
                </td>
                <td className="py-4 text-sm text-foreground">
                  ${product.price.toFixed(2)}
                </td>
                <td className="py-4">{getStatusBadge(product.status)}</td>
                <td className="py-4 pr-6 text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(product)}
                      className="h-8 w-8 p-0 hover:bg-accent"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(product)}
                      className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setProductToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Eliminar Producto"
        description={`¿Estás seguro de que deseas eliminar "${productToDelete?.name}"? Esta acción no se puede deshacer.`}
        isLoading={isDeleting}
      />
    </>
  );
}
