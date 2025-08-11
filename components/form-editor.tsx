"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import type { Form, FormField, FormStyling } from "@/lib/types"
import { FormFieldEditor } from "./form-field-editor"
import { FormPreview } from "./form-preview"
import { StyleEditor } from "./style-editor"
import { Plus, Save, Eye } from "lucide-react"
import { useRouter } from "next/navigation"

interface FormEditorProps {
  form: Form
}

export function FormEditor({ form }: FormEditorProps) {
  const router = useRouter()
  const [title, setTitle] = useState(form.title || "")
  const [description, setDescription] = useState(form.description || "")
  const [fields, setFields] = useState<FormField[]>(Array.isArray(form.fields) ? form.fields : [])
  const [aiPrompt, setAiPrompt] = useState(form.aiPrompt || "")
  const [aiEnabled, setAiEnabled] = useState(form.aiEnabled ?? true)
  const [styling, setStyling] = useState<FormStyling>(
    form.styling || {
      primaryColor: "#2D5016",
      backgroundColor: "#ffffff",
      textColor: "#000000",
      borderRadius: "8px",
      fontSize: "16px",
      fontFamily: "Inter",
      darkMode: false,
    },
  )
  const [isPreview, setIsPreview] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const addField = () => {
    const newField: FormField = {
      id: Math.random().toString(36).substring(7),
      type: "text",
      label: "New Field",
      placeholder: "",
      required: false,
    }
    setFields([...fields, newField])
  }

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map((field) => (field.id === id ? { ...field, ...updates } : field)))
  }

  const removeField = (id: string) => {
    setFields(fields.filter((field) => field.id !== id))
  }

  const saveForm = async () => {
    if (!title.trim()) {
      alert("Please enter a form title")
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch(`/api/forms/${form.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          fields,
          styling,
          aiPrompt,
          aiEnabled,
          isPublished: form.isPublished,
        }),
      })

      if (response.ok) {
        router.push(`/dashboard/forms/${form.id}`)
      } else {
        alert("Failed to save form")
      }
    } catch (error) {
      console.error("Error saving form:", error)
      alert("Failed to save form")
    } finally {
      setIsSaving(false)
    }
  }

  if (isPreview) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Form Preview</h2>
          <Button onClick={() => setIsPreview(false)} variant="outline">
            Back to Editor
          </Button>
        </div>
        <FormPreview title={title} description={description} fields={fields} styling={styling} />
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Form Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Form Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Contact Us" />
            </div>
            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Get in touch with us..."
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Form Fields</CardTitle>
              <Button onClick={addField} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Field
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {fields.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No fields added yet. Click "Add Field" to get started.
              </div>
            ) : (
              <div className="space-y-4">
                {fields.map((field) => (
                  <FormFieldEditor
                    key={field.id}
                    field={field}
                    onUpdate={(updates) => updateField(field.id, updates)}
                    onRemove={() => removeField(field.id)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch id="ai-enabled" checked={aiEnabled} onCheckedChange={setAiEnabled} />
              <Label htmlFor="ai-enabled">Enable AI Responses</Label>
            </div>
            {aiEnabled && (
              <div>
                <Label htmlFor="ai-prompt">AI Prompt</Label>
                <Textarea
                  id="ai-prompt"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="You are a helpful assistant for [Company Name]. Based on the form submission, provide a relevant follow-up question or offer additional information about our products/services."
                  rows={4}
                />
                <p className="text-sm text-muted-foreground mt-2">
                  This prompt will be used to generate AI responses based on form submissions.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <StyleEditor styling={styling} onUpdate={setStyling} />

        <div className="flex flex-col gap-2">
          <Button onClick={() => setIsPreview(true)} variant="outline" className="w-full">
            <Eye className="h-4 w-4 mr-2" />
            Preview Form
          </Button>
          <Button
            onClick={saveForm}
            disabled={isSaving || !title.trim()}
            className="w-full bg-primary hover:bg-primary/90"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  )
}
