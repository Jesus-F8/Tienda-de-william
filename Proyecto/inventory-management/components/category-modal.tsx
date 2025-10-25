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
import { Textarea } from "@/components/ui/textarea"
import { type Category, createCategory, updateCategory } from "@/lib/api/categories"
import { useToast } from "@/hooks/use-toast"

interface CategoryModalProps {
  isOpen: boolean
  onClose: () => void
  category?: Category
}

export function CategoryModal({ isOpen, onClose, category }: CategoryModalProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description || "",
      })
    } else {
      setFormData({
        name: "",
        description: "",
      })
    }
  }, [category, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (category) {
        await updateCategory({ ...category, ...formData })
        toast({
          title: "Categoría actualizada",
          description: "La categoría se ha actualizado correctamente.",
        })
      } else {
        await createCategory(formData)
        toast({
          title: "Categoría creada",
          description: "La categoría se ha creado correctamente.",
        })
      }
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un error al guardar la categoría.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-foreground">{category ? "Editar Categoría" : "Nueva Categoría"}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {category ? "Actualiza la información de la categoría." : "Crea una nueva categoría para tus productos."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-foreground">
                Nombre de la Categoría
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej: Camisas"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description" className="text-foreground">
                Descripción
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descripción de la categoría..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Guardando..." : category ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
