"use client"

import type { FormStyling } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

interface StyleEditorProps {
  styling: FormStyling
  onUpdate: (updates: Partial<FormStyling>) => void
}

export function StyleEditor({ styling, onUpdate }: StyleEditorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Styling</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="primary-color">Primary Color</Label>
          <div className="flex gap-2">
            <Input
              id="primary-color"
              type="color"
              value={styling.primaryColor}
              onChange={(e) => onUpdate({ primaryColor: e.target.value })}
              className="w-16 h-10 p-1"
            />
            <Input
              value={styling.primaryColor || "#2D5016"}
              onChange={(e) => onUpdate({ primaryColor: e.target.value })}
              placeholder="#2D5016"
              className="flex-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="bg-color">Background Color</Label>
          <div className="flex gap-2">
            <Input
              id="bg-color"
              type="color"
              value={styling.backgroundColor}
              onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
              className="w-16 h-10 p-1"
            />
            <Input
              value={styling.backgroundColor || "#ffffff"}
              onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
              placeholder="#ffffff"
              className="flex-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="text-color">Text Color</Label>
          <div className="flex gap-2">
            <Input
              id="text-color"
              type="color"
              value={styling.textColor}
              onChange={(e) => onUpdate({ textColor: e.target.value })}
              className="w-16 h-10 p-1"
            />
            <Input
              value={styling.textColor || "#000000"}
              onChange={(e) => onUpdate({ textColor: e.target.value })}
              placeholder="#000000"
              className="flex-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="border-radius">Border Radius</Label>
          <Select value={styling.borderRadius || "8px"} onValueChange={(value) => onUpdate({ borderRadius: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0px">None</SelectItem>
              <SelectItem value="4px">Small</SelectItem>
              <SelectItem value="8px">Medium</SelectItem>
              <SelectItem value="12px">Large</SelectItem>
              <SelectItem value="16px">Extra Large</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="font-size">Font Size</Label>
          <Select value={styling.fontSize || "16px"} onValueChange={(value) => onUpdate({ fontSize: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="14px">Small</SelectItem>
              <SelectItem value="16px">Medium</SelectItem>
              <SelectItem value="18px">Large</SelectItem>
              <SelectItem value="20px">Extra Large</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="font-family">Font Family</Label>
          <Select value={styling.fontFamily || "Inter"} onValueChange={(value) => onUpdate({ fontFamily: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Inter">Inter</SelectItem>
              <SelectItem value="Arial">Arial</SelectItem>
              <SelectItem value="Helvetica">Helvetica</SelectItem>
              <SelectItem value="Georgia">Georgia</SelectItem>
              <SelectItem value="Times New Roman">Times New Roman</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="dark-mode"
            checked={styling.darkMode}
            onCheckedChange={(checked) => onUpdate({ darkMode: checked })}
          />
          <Label htmlFor="dark-mode">Dark Mode</Label>
        </div>
      </CardContent>
    </Card>
  )
}
