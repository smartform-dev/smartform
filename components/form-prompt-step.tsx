"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface FormPromptStepProps {
  formId: string
  initialPrompt?: any
}

export function FormPromptStep({ formId, initialPrompt }: FormPromptStepProps) {
  const [prompt, setPrompt] = useState(initialPrompt || {
    name: "",
    businessType: "",
    websiteUrl: "",
    productDescription: "",
    targetAudience: "",
    mainContactGoal: "",
    commonQuestions: "",
    valueOffers: "",
    preferredTone: "",
    keywords: "",
    followUpStyle: "",
    prompt: "",
    context: "",
  })
  const [isSaving, setIsSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPrompt({ ...prompt, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSuccess(false)
    try {
      const res = await fetch(`/api/forms/${formId}/prompt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prompt),
      })
      if (res.ok) setSuccess(true)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business & AI Context</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="name">Business Name</Label>
          <Input id="name" name="name" value={prompt.name} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="businessType">Business Type</Label>
          <Input id="businessType" name="businessType" value={prompt.businessType} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="websiteUrl">Website URL</Label>
          <Input id="websiteUrl" name="websiteUrl" value={prompt.websiteUrl} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="productDescription">Product/Service Description</Label>
          <Textarea id="productDescription" name="productDescription" value={prompt.productDescription} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="targetAudience">Target Audience</Label>
          <Input id="targetAudience" name="targetAudience" value={prompt.targetAudience} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="mainContactGoal">Main Contact Goal</Label>
          <Input id="mainContactGoal" name="mainContactGoal" value={prompt.mainContactGoal} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="commonQuestions">Common Questions (comma separated)</Label>
          <Textarea id="commonQuestions" name="commonQuestions" value={prompt.commonQuestions} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="valueOffers">Value Offers (comma separated)</Label>
          <Textarea id="valueOffers" name="valueOffers" value={prompt.valueOffers} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="preferredTone">Preferred Tone</Label>
          <Input id="preferredTone" name="preferredTone" value={prompt.preferredTone} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="keywords">Keywords (comma separated)</Label>
          <Textarea id="keywords" name="keywords" value={prompt.keywords} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="followUpStyle">Follow-up Style</Label>
          <Input id="followUpStyle" name="followUpStyle" value={prompt.followUpStyle} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="prompt">AI Prompt</Label>
          <Textarea id="prompt" name="prompt" value={prompt.prompt} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="context">AI Context</Label>
          <Textarea id="context" name="context" value={prompt.context} onChange={handleChange} />
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="w-full mt-4">
          {isSaving ? "Saving..." : "Save Context"}
        </Button>
        {success && <div className="text-green-600 mt-2">Saved!</div>}
      </CardContent>
    </Card>
  )
}
