"use client"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import type { Settings } from "@/lib/api/settings"

interface NotificationSettingsProps {
  settings: Settings | null
}

export function NotificationSettings({ settings }: NotificationSettingsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-lg font-medium">Notificaciones por Email</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Alertas de Inventario</Label>
              <p className="text-sm text-muted-foreground">Recibe alertas cuando el stock esté bajo</p>
            </div>
            <Switch defaultChecked={settings?.notifications?.inventoryAlerts ?? true} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Nuevos Pedidos</Label>
              <p className="text-sm text-muted-foreground">Notificaciones de nuevos pedidos recibidos</p>
            </div>
            <Switch defaultChecked={settings?.notifications?.newOrders ?? true} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Reportes Semanales</Label>
              <p className="text-sm text-muted-foreground">Resumen semanal de ventas y estadísticas</p>
            </div>
            <Switch defaultChecked={settings?.notifications?.weeklyReports ?? false} />
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-medium">Notificaciones Push</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Activar Notificaciones Push</Label>
              <p className="text-sm text-muted-foreground">Recibe notificaciones en tiempo real</p>
            </div>
            <Switch defaultChecked={settings?.notifications?.pushEnabled ?? false} />
          </div>
        </div>
      </div>
    </div>
  )
}
