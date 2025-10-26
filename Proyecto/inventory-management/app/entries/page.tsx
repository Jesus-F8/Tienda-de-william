"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, PackagePlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  fetchProducts,
  addStock,
  type Product,
  type StockAdditionInput,
} from "@/lib/api/products";

export default function EntriesPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductOpen, setIsProductOpen] = useState(false);
  const [formData, setFormData] = useState({
    quantity: "",
    notes: "",
  });

  // Cargar productos al montar el componente
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const productsData = await fetchProducts();
      setProducts(productsData);
    } catch (error) {
      console.error("Error loading products:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los productos",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProduct) {
      toast({
        title: "Error",
        description: "Por favor selecciona un producto",
        variant: "destructive",
      });
      return;
    }

    const quantity = parseInt(formData.quantity);
    if (!quantity || quantity <= 0) {
      toast({
        title: "Error",
        description: "La cantidad debe ser un número mayor a 0",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const stockData: StockAdditionInput = {
        quantity,
        notes: formData.notes.trim() || undefined,
      };

      const response = await addStock(selectedProduct.id, stockData);

      toast({
        title: "Éxito",
        description: `Se añadieron ${quantity} unidades al producto "${selectedProduct.name}"`,
      });

      // Limpiar el formulario
      setFormData({ quantity: "", notes: "" });
      setSelectedProduct(null);

      // Recargar productos para mostrar el stock actualizado
      await loadProducts();
    } catch (error) {
      console.error("Error adding stock:", error);
      toast({
        title: "Error",
        description: (error as Error).message || "No se pudo añadir el stock",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <PackagePlus className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">
            Registrar Entrada de Inventario
          </h1>
        </div>
        <p className="text-muted-foreground">
          Añade stock a productos existentes y registra cada entrada en el
          historial.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nueva Entrada de Stock</CardTitle>
          <CardDescription>
            Selecciona un producto y especifica la cantidad a añadir
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Selector de Producto */}
            <div className="space-y-2">
              <Label htmlFor="product">Producto *</Label>
              <Popover open={isProductOpen} onOpenChange={setIsProductOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={isProductOpen}
                    className="w-full justify-between"
                  >
                    {selectedProduct ? (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {selectedProduct.name}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          ({selectedProduct.sku})
                        </span>
                      </div>
                    ) : (
                      "Seleccionar producto..."
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Buscar producto por nombre o SKU..." />
                    <CommandList>
                      <CommandEmpty>No se encontraron productos.</CommandEmpty>
                      <CommandGroup>
                        {products.map((product) => (
                          <CommandItem
                            key={product.id}
                            value={`${product.name} ${product.sku}`}
                            onSelect={() => {
                              setSelectedProduct(product);
                              setIsProductOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedProduct?.id === product.id
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {product.name}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                SKU: {product.sku} • Stock actual:{" "}
                                {product.quantity}
                              </span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Información del producto seleccionado */}
            {selectedProduct && (
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Información del Producto</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Nombre:</span>
                    <p className="font-medium">{selectedProduct.name}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">SKU:</span>
                    <p className="font-medium">{selectedProduct.sku}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Stock Actual:</span>
                    <p className="font-medium">
                      {selectedProduct.quantity} unidades
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Ubicación:</span>
                    <p className="font-medium">{selectedProduct.location}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Campo Cantidad */}
            <div className="space-y-2">
              <Label htmlFor="quantity">Cantidad a Añadir *</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => handleInputChange("quantity", e.target.value)}
                placeholder="Ej: 50"
                min="1"
                required
              />
            </div>

            {/* Campo Notas */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notas (Opcional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Ej: Compra de proveedor ABC, lote #12345..."
                rows={3}
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground">
                {formData.notes.length}/500 caracteres
              </p>
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSelectedProduct(null);
                  setFormData({ quantity: "", notes: "" });
                }}
                disabled={isLoading}
              >
                Limpiar
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !selectedProduct || !formData.quantity}
                className="flex-1"
              >
                {isLoading ? "Registrando..." : "Registrar Entrada"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Información adicional */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Información Importante</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            • Cada entrada de stock se registra automáticamente en el historial
            de inventario
          </p>
          <p>• El stock se añade al inventario actual del producto</p>
          <p>
            • Las notas son opcionales pero recomendadas para mantener un
            registro detallado
          </p>
          <p>• Solo se pueden añadir cantidades enteras positivas</p>
        </CardContent>
      </Card>
    </div>
  );
}
