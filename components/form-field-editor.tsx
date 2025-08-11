"use client"

import type { FormField } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Trash2, GripVertical } from "lucide-react"
import { useState } from "react"

interface FormFieldEditorProps {
  field: FormField
  onUpdate: (updates: Partial<FormField>) => void
  onRemove: () => void
}

export function FormFieldEditor({ field, onUpdate, onRemove }: FormFieldEditorProps) {
  const [options, setOptions] = useState(field.options?.join("\n") || "")

  const handleOptionsChange = (value: string) => {
    setOptions(value)
    onUpdate({ options: value.split("\n").filter((opt) => opt.trim()) })
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <GripVertical className="h-5 w-5 text-muted-foreground mt-2 cursor-move" />

          <div className="flex-1 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor={`type-${field.id}`}>Field Type</Label>
                <Select value={field.type} onValueChange={(value: FormField["type"]) => onUpdate({ type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="textarea">Textarea</SelectItem>
                    <SelectItem value="select">Select</SelectItem>
                    <SelectItem value="radio">Radio</SelectItem>
                    <SelectItem value="checkbox">Checkbox</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2 pt-6">
                <Switch
                  id={`required-${field.id}`}
                  checked={field.required}
                  onCheckedChange={(checked) => onUpdate({ required: checked })}
                />
                <Label htmlFor={`required-${field.id}`}>Required</Label>
              </div>
            </div>

            <div>
              <Label htmlFor={`label-${field.id}`}>Label</Label>
              <Input
                id={`label-${field.id}`}
                value={field.label || ""}
                onChange={(e) => onUpdate({ label: e.target.value })}
                placeholder="Field label"
              />
            </div>

            <div>
              <Label htmlFor={`placeholder-${field.id}`}>Placeholder</Label>
              <Input
                id={`placeholder-${field.id}`}
                value={field.placeholder || ""}
                onChange={(e) => onUpdate({ placeholder: e.target.value })}
                placeholder="Placeholder text"
              />
            </div>

            {(field.type === "select" || field.type === "radio") && (
              <div>
                <Label htmlFor={`options-${field.id}`}>Options (one per line)</Label>
                <Textarea
                  id={`options-${field.id}`}
                  value={options}
                  onChange={(e) => handleOptionsChange(e.target.value)}
                  placeholder="Option 1&#10;Option 2&#10;Option 3"
                  rows={3}
                />
              </div>
            )}
          </div>

          <Button variant="ghost" size="sm" onClick={onRemove} className="text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
