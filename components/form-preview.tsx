"use client"

import type { FormField, FormStyling } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"

interface FormPreviewProps {
  title: string
  description?: string
  fields: FormField[]
  styling: FormStyling
}

export function FormPreview({ title, description, fields, styling }: FormPreviewProps) {
  const formStyle = {
    backgroundColor: styling.backgroundColor,
    color: styling.textColor,
    fontSize: styling.fontSize,
    fontFamily: styling.fontFamily,
    borderRadius: styling.borderRadius,
  }

  const primaryStyle = {
    backgroundColor: styling.primaryColor,
    borderColor: styling.primaryColor,
  }

  return (
    <div className={`max-w-2xl mx-auto ${styling.darkMode ? "dark" : ""}`}>
      <Card style={formStyle} className="border-2">
        <CardHeader>
          <CardTitle className="text-2xl" style={{ color: styling.textColor }}>
            {title || "Form Title"}
          </CardTitle>
          {description && (
            <p className="text-muted-foreground" style={{ color: styling.textColor, opacity: 0.7 }}>
              {description}
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {fields.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No fields added yet</div>
          ) : (
            fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id} style={{ color: styling.textColor }}>
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>

                {field.type === "text" && (
                  <Input id={field.id} placeholder={field.placeholder} style={{ borderRadius: styling.borderRadius }} />
                )}

                {field.type === "email" && (
                  <Input
                    id={field.id}
                    type="email"
                    placeholder={field.placeholder}
                    style={{ borderRadius: styling.borderRadius }}
                  />
                )}

                {field.type === "textarea" && (
                  <Textarea
                    id={field.id}
                    placeholder={field.placeholder}
                    style={{ borderRadius: styling.borderRadius }}
                    rows={4}
                  />
                )}

                {field.type === "select" && (
                  <Select>
                    <SelectTrigger style={{ borderRadius: styling.borderRadius }}>
                      <SelectValue placeholder={field.placeholder || "Select an option"} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map((option, index) => (
                        <SelectItem key={index} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {field.type === "radio" && (
                  <RadioGroup>
                    {field.options?.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`${field.id}-${index}`} />
                        <Label htmlFor={`${field.id}-${index}`} style={{ color: styling.textColor }}>
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                {field.type === "checkbox" && (
                  <div className="flex items-center space-x-2">
                    <Checkbox id={field.id} />
                    <Label htmlFor={field.id} style={{ color: styling.textColor }}>
                      {field.placeholder || field.label}
                    </Label>
                  </div>
                )}
              </div>
            ))
          )}

          <Button className="w-full" style={primaryStyle} disabled={fields.length === 0}>
            Submit
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
