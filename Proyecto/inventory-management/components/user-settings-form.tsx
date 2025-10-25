"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import type { Settings } from "@/lib/api/settings"

interface UserSettingsFormProps {
  settings: Settings | null
}

export function UserSettingsForm({ settings }: UserSettingsFormProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        <Avatar className="h-24 w-24">
          <AvatarImage src={settings?.user?.avatar || "/placeholder.svg"} />
          <AvatarFallback className="text-2xl">{settings?.user?.name?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
        <div>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Upload className="h-4 w-4" />
            Cambiar Foto
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">JPG, PNG o GIF. Máximo 2MB.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">Nombre</Label>
          <Input id="firstName" defaultValue={settings?.user?.firstName || ""} placeholder="Tu nombre" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Apellido</Label>
          <Input id="lastName" defaultValue={settings?.user?.lastName || ""} placeholder="Tu apellido" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="userEmail">Email</Label>
        <Input id="userEmail" type="email" defaultValue={settings?.user?.email || ""} placeholder="tu@email.com" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="userPhone">Teléfono</Label>
        <Input id="userPhone" type="tel" defaultValue={settings?.user?.phone || ""} placeholder="+52 123 456 7890" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="position">Cargo</Label>
        <Input id="position" defaultValue={settings?.user?.position || ""} placeholder="Gerente, Administrador, etc." />
      </div>
    </div>
  )
}
