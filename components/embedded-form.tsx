"use client"

import type React from "react"
import { motion } from "framer-motion"

import { useState, useEffect } from "react"
import type { Form, FormField } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Bot, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { FormChat } from "@/components/form-chat"
import { v4 as uuidv4 } from "uuid"

interface EmbeddedFormProps {
  form: Form
}

export function EmbeddedForm({ form }: EmbeddedFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [aiResponse, setAiResponse] = useState<string | null>(null)
  const [submissionId, setSubmissionId] = useState<string | null>(null)
  const [userResponded, setUserResponded] = useState(false)
  const [followUpMessage, setFollowUpMessage] = useState<string | null>(null)

  const router = useRouter()

  const styling = form.styling as any
  const fields = form.fields as FormField[]

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
    color: "#ffffff",
  }

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value ?? "",
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const embedCode = form.embedCode || form.id
      const response = await fetch(`/api/forms/submit/${embedCode}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          submissionData: formData,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (result.success) {
        setIsSubmitted(true)
        setSubmissionId(result.submissionId)
        if (result.aiResponse) {
          setAiResponse(result.aiResponse)
        }
      } else {
        alert("Failed to submit form")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("Failed to submit form")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAiResponse = async (response: "yes" | "no") => {
    try {
      const result = await fetch("/api/ai/respond", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          submissionId,
          response,
        }),
      })

      const data = await result.json()

      if (data.success) {
        setUserResponded(true)
        setFollowUpMessage(data.followUpMessage)
      }
    } catch (error) {
      console.error("Error responding to AI:", error)
    }
  }

  // Generate or get a sessionId for chat
  const [sessionId] = useState(() => {
    if (typeof window !== "undefined") {
      let sid = window.localStorage.getItem("formchat-session")
      if (!sid) {
        sid = uuidv4()
        window.localStorage.setItem("formchat-session", sid)
      }
      return sid
    }
    return "default"
  })

  // Handle iframe resizing for parent window
  useEffect(() => {
    const resizeIframe = () => {
      if (typeof window !== "undefined" && window.parent && window.parent !== window) {
        const height = Math.max(
          document.documentElement.scrollHeight,
          document.body.scrollHeight,
          600, // minimum height
        )
        window.parent.postMessage(
          {
            type: "resize",
            height,
            formId: form.id,
            embedCode: form.embedCode || form.id,
          },
          "*",
        )
      }
    }

    // Initial resize
    resizeIframe()

    // Resize on content changes
    const observer = new ResizeObserver(resizeIframe)
    observer.observe(document.body)

    return () => observer.disconnect()
  }, [form.id, form.embedCode, isSubmitted, aiResponse, followUpMessage])

  if (isSubmitted) {
    return (
      <div className={`max-w-2xl mx-auto ${styling.darkMode ? "dark" : ""}`}>
        <Card style={formStyle} className="border-2">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <motion.h2
              className="text-2xl font-bold mb-4"
              style={{ color: styling.textColor }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Thank You!
            </motion.h2>
            <motion.p
              className="text-lg mb-6"
              style={{ color: styling.textColor, opacity: 0.8 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Your form has been submitted successfully.
            </motion.p>

            {aiResponse && !userResponded && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3 mb-4">
                  <Bot className="h-6 w-6 text-primary mt-1" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">AI Assistant</p>
                    <p className="text-gray-700 dark:text-gray-300">{aiResponse}</p>
                  </div>
                </div>
                <div className="flex gap-2 justify-center">
                  <Button
                    onClick={() => handleAiResponse("yes")}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Yes
                  </Button>
                  <Button
                    onClick={() => handleAiResponse("no")}
                    size="sm"
                    variant="outline"
                    className="border-gray-300"
                  >
                    No
                  </Button>
                </div>
              </div>
            )}

            {followUpMessage && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Bot className="h-6 w-6 text-primary mt-1" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">AI Assistant</p>
                    <p className="text-gray-700 dark:text-gray-300">{followUpMessage}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Chat Helper and Chat UI */}
            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <div className="mb-4 text-lg font-semibold text-primary">
                Not done yet? Let's solve your problem right now — chat with our AI assistant below!
              </div>
              <FormChat formId={form.id} sessionId={sessionId} styling={form.styling} />
            </motion.div>
            {/* Optional: Button to open full chat page */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              <Button
                className="mt-4"
                variant="outline"
                onClick={() => router.push(`/forms/${form.id}/chat`)}
              >
                Open Full Chat Page
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={`max-w-2xl mx-auto ${styling.darkMode ? "dark" : ""}`}>
      <Card style={formStyle} className="border-2">
        <CardHeader>
          <CardTitle className="text-2xl" style={{ color: styling.textColor }}>
            {form.title}
          </CardTitle>
          {form.description && (
            <p className="text-muted-foreground" style={{ color: styling.textColor, opacity: 0.7 }}>
              {form.description}
            </p>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id} style={{ color: styling.textColor }}>
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>

                {field.type === "text" && (
                  <Input
                    id={field.id}
                    placeholder={field.placeholder || ""}
                    required={field.required}
                    value={formData[field.id] || ""}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    style={{ borderRadius: styling.borderRadius }}
                  />
                )}

                {field.type === "email" && (
                  <Input
                    id={field.id}
                    type="email"
                    placeholder={field.placeholder || ""}
                    required={field.required}
                    value={formData[field.id] || ""}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    style={{ borderRadius: styling.borderRadius }}
                  />
                )}

                {field.type === "textarea" && (
                  <Textarea
                    id={field.id}
                    placeholder={field.placeholder || ""}
                    required={field.required}
                    value={formData[field.id] || ""}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    style={{ borderRadius: styling.borderRadius }}
                    rows={4}
                  />
                )}

                {field.type === "select" && (
                  <Select
                    required={field.required}
                    value={formData[field.id] || ""}
                    onValueChange={(value) => handleInputChange(field.id, value)}
                  >
                    <SelectTrigger style={{ borderRadius: styling.borderRadius }}>
                      <SelectValue placeholder={field.placeholder || "Select an option"} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map((option: string, index: number) => (
                        <SelectItem key={index} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {field.type === "radio" && (
                  <RadioGroup
                    required={field.required}
                    value={formData[field.id] || ""}
                    onValueChange={(value) => handleInputChange(field.id, value)}
                  >
                    {field.options?.map((option: string, index: number) => (
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
                    <Checkbox
                      id={field.id}
                      required={field.required}
                      checked={formData[field.id] || false}
                      onCheckedChange={(checked) => handleInputChange(field.id, checked)}
                    />
                    <Label htmlFor={field.id} style={{ color: styling.textColor }}>
                      {field.placeholder || field.label}
                    </Label>
                  </div>
                )}
              </div>
            ))}

            <Button type="submit" className="w-full" style={primaryStyle} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
