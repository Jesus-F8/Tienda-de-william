"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type Product, createProduct, updateProduct } from "@/lib/api/products"
import { getCategories } from "@/lib/api/categories"
import { useToast } from "@/hooks/use-toast"

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  product?: Product
  onSuccess?: () => void
}

export function ProductModal({ isOpen, onClose, product, onSuccess }: ProductModalProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([])
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    quantity: 0,
    location: "",
    category: "",
    price: 0,
  })

  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        sku: product.sku,
        quantity: product.quantity,
        location: product.location,
        category: product.category,
        price: product.price,
      })
    } else {
      setFormData({
        name: "",
        sku: "",
        quantity: 0,
        location: "",
        category: "",
        price: 0,
      })
    }
  }, [product, isOpen])

  const loadCategories = async () => {
    try {
      const data = await getCategories()
      setCategories(data)
    } catch (error) {
      console.error("Error loading categories:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (product) {
        await updateProduct({ ...formData, id: product.id })
        toast({
          title: "Producto actualizado",
          description: "El producto se ha actualizado correctamente.",
        })
      } else {
        await createProduct(formData)
        toast({
          title: "Producto creado",
          description: "El producto se ha creado correctamente.",
        })
      }
      onSuccess?.()
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un error al guardar el producto.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-foreground">{product ? "Editar Producto" : "Agregar Producto"}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {product ? "Actualiza la información del producto." : "Completa los datos del nuevo producto."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-foreground">
                Nombre del Producto
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej: Camisa Polo Azul"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="sku" className="text-foreground">
                  SKU
                </Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  placeholder="Ej: CAM-001"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="quantity" className="text-foreground">
                  Cantidad
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: Number.parseInt(e.target.value) || 0 })}
                  placeholder="0"
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category" className="text-foreground">
                Categoría
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="location" className="text-foreground">
                  Ubicación
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Ej: Estante A-12"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price" className="text-foreground">
                  Precio
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Guardando..." : product ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
