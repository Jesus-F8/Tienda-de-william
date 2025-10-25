"use client"

import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getCategories, type Category } from "@/lib/api/categories"
import { CategoryModal } from "@/components/category-modal"
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal"
import { deleteCategory } from "@/lib/api/categories"
import { useToast } from "@/hooks/use-toast"

export default function CategoriesPage() {
  const { toast } = useToast()
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>()
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setIsLoading(true)
      const data = await getCategories()
      setCategories(data)
    } catch (error) {
      console.error("Error loading categories:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (category: Category) => {
    setSelectedCategory(category)
    setIsModalOpen(true)
  }

  const handleAdd = () => {
    setSelectedCategory(undefined)
    setIsModalOpen(true)
  }

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return

    setIsDeleting(true)
    try {
      await deleteCategory(categoryToDelete.id)
      toast({
        title: "Categoría eliminada",
        description: "La categoría se ha eliminado correctamente.",
      })
      setDeleteModalOpen(false)
      setCategoryToDelete(null)
      loadCategories()
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un error al eliminar la categoría.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedCategory(undefined)
    loadCategories()
  }

  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Categorías</h1>
          <p className="text-sm text-muted-foreground">Gestiona las categorías de tus productos</p>
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          Nueva Categoría
        </Button>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="text-muted-foreground">Cargando categorías...</div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Card key={category.id} className="border-border/50">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </div>
                  <Badge variant="secondary" className="ml-2">
                    {category.productCount} productos
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(category)}
                    className="h-8 w-8 p-0 hover:bg-accent"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteClick(category)}
                    className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CategoryModal isOpen={isModalOpen} onClose={handleModalClose} category={selectedCategory} />

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false)
          setCategoryToDelete(null)
        }}
        onConfirm={handleConfirmDelete}
        title="Eliminar Categoría"
        description={`¿Estás seguro de que deseas eliminar la categoría "${categoryToDelete?.name}"? Los productos asociados no se eliminarán.`}
        isLoading={isDeleting}
      />
    </div>
  )
}
