"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import type { Settings } from "@/lib/api/settings"

interface SecuritySettingsProps {
  settings: Settings | null
}

export function SecuritySettings({ settings }: SecuritySettingsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-lg font-medium">Cambiar Contraseña</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Contraseña Actual</Label>
            <Input id="currentPassword" type="password" placeholder="••••••••" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">Nueva Contraseña</Label>
            <Input id="newPassword" type="password" placeholder="••••••••" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
            <Input id="confirmPassword" type="password" placeholder="••••••••" />
          </div>

          <Button>Actualizar Contraseña</Button>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-medium">Autenticación de Dos Factores</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Activar 2FA</Label>
              <p className="text-sm text-muted-foreground">Añade una capa extra de seguridad a tu cuenta</p>
            </div>
            <Switch defaultChecked={settings?.security?.twoFactorEnabled ?? false} />
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-medium">Sesiones Activas</h3>
        <div className="space-y-4">
          <div className="rounded-lg border border-border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Navegador Actual</p>
                <p className="text-sm text-muted-foreground">Chrome en Windows • Activo ahora</p>
              </div>
              <Button variant="outline" size="sm">
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
