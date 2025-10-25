"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Settings } from "@/lib/api/settings"

interface CompanySettingsFormProps {
  settings: Settings | null
}

export function CompanySettingsForm({ settings }: CompanySettingsFormProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="companyName">Nombre de la Empresa</Label>
          <Input
            id="companyName"
            defaultValue={settings?.company?.name || "Cematlix"}
            placeholder="Nombre de tu empresa"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="taxId">RFC / Tax ID</Label>
          <Input id="taxId" defaultValue={settings?.company?.taxId || ""} placeholder="RFC123456789" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Dirección</Label>
        <Textarea
          id="address"
          defaultValue={settings?.company?.address || ""}
          placeholder="Dirección completa de la empresa"
          rows={3}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono</Label>
          <Input id="phone" type="tel" defaultValue={settings?.company?.phone || ""} placeholder="+52 123 456 7890" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            defaultValue={settings?.company?.email || ""}
            placeholder="contacto@empresa.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="website">Sitio Web</Label>
        <Input
          id="website"
          type="url"
          defaultValue={settings?.company?.website || ""}
          placeholder="https://www.empresa.com"
        />
      </div>
    </div>
  )
}
