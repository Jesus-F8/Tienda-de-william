"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { NumericFormat, type NumberFormatValues } from "react-number-format"; // Mantenemos NumericFormat para el input
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type Product,
  type ProductCreateInput,
  type ProductUpdateInput,
  createProduct,
  updateProduct,
} from "@/lib/api/products";
import { getCategories } from "@/lib/api/categories";
import { useToast } from "@/hooks/use-toast";
import { useCurrency } from "@/app/contexts/CurrencyContext";

interface Category {
  id: string;
  name: string;
}
interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product;
  onSuccess?: () => void;
}

// Volvemos a usar 'number' para el precio en el estado
type FormData = {
  name: string;
  sku: string;
  quantity: number;
  location: string;
  categoryId: string;
  price: number; // Siempre almacenado en USD
  originalDisplayValue?: number; // Valor original que el usuario ingresó (para evitar errores de conversión)
};

export function ProductModal({
  isOpen,
  onClose,
  product,
  onSuccess,
}: ProductModalProps) {
  const { toast } = useToast();
  const { currency: selectedCurrency, exchangeRate } = useCurrency();
  const isNioMode = selectedCurrency === "NIO";

  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const initialState: FormData = {
    name: "",
    sku: "",
    quantity: 0,
    location: "",
    categoryId: "",
    price: 0,
    originalDisplayValue: undefined,
  };
  const [formData, setFormData] = useState<FormData>(initialState);

  // --- EFECTOS (Simplificados) ---
  useEffect(() => {
    loadCategories();
  }, []);

  // Inicializar/Resetear formulario (Usa number para price)
  useEffect(() => {
    if (product) {
      // Modo Editar
      setFormData({
        name: product.name,
        sku: product.sku,
        quantity: product.quantity,
        location: product.location,
        categoryId: "",
        price: product.price || 0, // Usar 0 si el precio es null/undefined
        originalDisplayValue: undefined, // Se calculará cuando se cambie a córdobas
      });
    } else {
      // Modo Crear
      setFormData(initialState);
    }
  }, [product, isOpen]);

  // Rellenar categoría (sin cambios)
  useEffect(() => {
    if (product && categories.length > 0) {
      /* ... */
    }
  }, [product, categories]);

  const loadCategories = async () => {
    /* ... */
  };

  // --- MANEJADOR DE PRECIO CON NumericFormat (SIN DINERO.JS) ---
  const handlePriceValueChange = useCallback(
    (values: NumberFormatValues) => {
      // values.floatValue es el número que el usuario VE (puede ser USD o NIO)
      const displayAmount = values.floatValue || 0;

      // Convertir el valor mostrado de vuelta a USD base
      let priceInUsd: number;
      if (isNioMode) {
        // Para córdobas, convertir a USD y almacenar también el valor original
        priceInUsd = Math.round((displayAmount / exchangeRate) * 10000) / 10000;
        // Almacenar el valor original para evitar errores de conversión múltiple
        setFormData((prev) => ({
          ...prev,
          price: priceInUsd,
          originalDisplayValue: displayAmount,
        }));
      } else {
        priceInUsd = displayAmount;
        // Limpiar el valor original cuando estamos en USD
        setFormData((prev) => ({
          ...prev,
          price: priceInUsd,
          originalDisplayValue: undefined,
        }));
      }
    },
    [isNioMode, exchangeRate]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // --- VALIDACIÓN FINAL ---
    // Redondear el precio USD final a 2 decimales JUSTO ANTES de enviar/validar
    const finalUsdPriceToSend = Math.round(formData.price * 100) / 100;

    console.log(
      "[handleSubmit] Precio USD final a validar/enviar:",
      finalUsdPriceToSend
    ); // DEBUG

    if (finalUsdPriceToSend < 0.01) {
      console.warn(
        "[handleSubmit] Validación fallida. Precio final:",
        finalUsdPriceToSend
      ); // DEBUG
      toast({
        title: "Precio inválido",
        description: "El precio debe ser un número válido mayor a 0.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const finalCategoryId =
      formData.categoryId === "null" || formData.categoryId === ""
        ? null
        : formData.categoryId;

    try {
      if (product) {
        // Modo Editar
        const payload: ProductUpdateInput = {
          id: product.id,
          name: formData.name,
          sku: formData.sku,
          location: formData.location,
          price: finalUsdPriceToSend,
          categoryId: finalCategoryId,
        };
        await updateProduct(payload);
        toast({ title: "Producto actualizado" });
      } else {
        // Modo Crear
        const payload: ProductCreateInput = {
          name: formData.name,
          sku: formData.sku,
          location: formData.location,
          price: finalUsdPriceToSend,
          categoryId: finalCategoryId,
          quantity: formData.quantity,
        };
        await createProduct(payload);
        toast({ title: "Producto creado" });
      }
      onSuccess?.();
      onClose();
    } catch (error) {
      /* ... */
      console.error("[handleSubmit] Error API:", error);
      toast({
        title: "Error al guardar",
        description: (error as Error).message || "Hubo un error",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isEditMode = !!product;

  // --- CALCULAR VALOR A MOSTRAR ---
  // Calcular el valor que NumericFormat debe mostrar (USD o NIO convertido)
  // Usar el valor original si está disponible para evitar errores de conversión múltiple
  const valueToDisplay = isNioMode
    ? formData.originalDisplayValue !== undefined
      ? formData.originalDisplayValue
      : (() => {
          // Si no hay valor original, convertir desde USD pero mantener formato limpio
          const convertedValue = formData.price * exchangeRate;
          // Si el resultado es muy cercano a un número entero, mostrarlo como entero
          const rounded = Math.round(convertedValue * 100) / 100;
          return rounded % 1 === 0 ? Math.round(rounded) : rounded;
        })()
    : formData.price;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        {/* ... DialogHeader ... */}
        <DialogHeader>
          {" "}
          <DialogTitle className="text-foreground">
            {" "}
            {isEditMode ? "Editar Producto" : "Agregar Producto"}{" "}
          </DialogTitle>{" "}
          <DialogDescription className="text-muted-foreground">
            {" "}
            {isEditMode
              ? "Actualiza la información del producto."
              : "Completa los datos del nuevo producto."}{" "}
          </DialogDescription>{" "}
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* ... otros campos ... */}
            <div className="grid gap-2">
              {" "}
              <Label htmlFor="name" className="text-foreground">
                {" "}
                Nombre del Producto{" "}
              </Label>{" "}
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Ej: Camisa Polo Azul"
                required
              />{" "}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {" "}
              <div className={`grid gap-2 ${isEditMode ? "col-span-2" : ""}`}>
                {" "}
                <Label htmlFor="sku" className="text-foreground">
                  {" "}
                  SKU{" "}
                </Label>{" "}
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) =>
                    setFormData({ ...formData, sku: e.target.value })
                  }
                  placeholder="Ej: CAM-001"
                  required
                />{" "}
              </div>{" "}
              {!isEditMode && (
                <div className="grid gap-2">
                  {" "}
                  <Label htmlFor="quantity" className="text-foreground">
                    {" "}
                    Cantidad Inicial{" "}
                  </Label>{" "}
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quantity: Number.parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="0"
                    required
                    min={0}
                  />{" "}
                </div>
              )}{" "}
            </div>
            <div className="grid gap-2">
              {" "}
              <Label htmlFor="category" className="text-foreground">
                {" "}
                Categoría{" "}
              </Label>{" "}
              <Select
                value={formData.categoryId || ""}
                onValueChange={(value) =>
                  setFormData({ ...formData, categoryId: value })
                }
              >
                {" "}
                <SelectTrigger>
                  {" "}
                  <SelectValue placeholder="Selecciona una categoría" />{" "}
                </SelectTrigger>{" "}
                <SelectContent>
                  {" "}
                  <SelectItem value="null">Sin categoría</SelectItem>{" "}
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {" "}
                      {category.name}{" "}
                    </SelectItem>
                  ))}{" "}
                </SelectContent>{" "}
              </Select>{" "}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {" "}
              <div className="grid gap-2">
                {" "}
                <Label htmlFor="location" className="text-foreground">
                  {" "}
                  Ubicación{" "}
                </Label>{" "}
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="Ej: Estante A-12"
                  required
                />{" "}
              </div>
              {/* Input de Precio (NumericFormat simplificado) */}
              <div className="grid gap-2">
                <Label htmlFor="price" className="text-foreground">
                  Precio ({isNioMode ? "NIO" : "USD"})
                </Label>
                <NumericFormat
                  id="price"
                  // Mostrar el valor calculado (USD o NIO convertido)
                  value={valueToDisplay > 0 ? valueToDisplay : ""} // Mostrar vacío si es 0
                  // onValueChange actualiza formData.price (USD preciso)
                  onValueChange={handlePriceValueChange}
                  thousandSeparator=","
                  decimalScale={2} // Máximo 2 decimales
                  fixedDecimalScale={false} // NO forzar decimales automáticamente
                  prefix={isNioMode ? "C$" : "$"}
                  allowNegative={false}
                  placeholder="0"
                  customInput={Input}
                  required
                  allowLeadingZeros={false}
                  isAllowed={(values) => {
                    // Permitir solo valores positivos con máximo 2 decimales
                    return (
                      values.floatValue === undefined || values.floatValue >= 0
                    );
                  }}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            {/* ... Botones ... */}
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Guardando..." : isEditMode ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
