"use client"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { Settings } from "@/lib/api/settings"

interface AppearanceSettingsProps {
  settings: Settings | null
}

export function AppearanceSettings({ settings }: AppearanceSettingsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-lg font-medium">Tema</h3>
        <RadioGroup defaultValue={settings?.appearance?.theme || "light"}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="light" id="light" />
            <Label htmlFor="light">Claro</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="dark" id="dark" />
            <Label htmlFor="dark">Oscuro</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="system" id="system" />
            <Label htmlFor="system">Sistema</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-medium">Idioma</h3>
        <RadioGroup defaultValue={settings?.appearance?.language || "es"}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="es" id="es" />
            <Label htmlFor="es">Español</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="en" id="en" />
            <Label htmlFor="en">English</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-medium">Formato de Fecha</h3>
        <RadioGroup defaultValue={settings?.appearance?.dateFormat || "dd/mm/yyyy"}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="dd/mm/yyyy" id="dd/mm/yyyy" />
            <Label htmlFor="dd/mm/yyyy">DD/MM/YYYY</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="mm/dd/yyyy" id="mm/dd/yyyy" />
            <Label htmlFor="mm/dd/yyyy">MM/DD/YYYY</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yyyy-mm-dd" id="yyyy-mm-dd" />
            <Label htmlFor="yyyy-mm-dd">YYYY-MM-DD</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  )
}
