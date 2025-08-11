"use client"

import { useState } from "react"
import type { Form } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Check, Eye, Code } from "lucide-react"
import Link from "next/link"
import { generateEmbedScript } from "@/lib/utils"

interface EmbedCodeDisplayProps {
  form: Form
}

export function EmbedCodeDisplay({ form }: EmbedCodeDisplayProps) {
  const [copied, setCopied] = useState(false)

  const embedScript = generateEmbedScript(form.embedCode)
  const directUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/embed/${form.embedCode}`

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!form.embedCode) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Embed Code</h1>
            <p className="text-muted-foreground mt-2">No embed code found for "{form.title}".</p>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Embed Not Available</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">This form does not have an embed code. Please ensure the form is published and has an embed code assigned in the dashboard.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Embed Code</h1>
          <p className="text-muted-foreground mt-2">Get the embed code for "{form.title}"</p>
        </div>

        <Button asChild variant="outline">
          <Link href={`/embed/${form.embedCode}`} target="_blank">
            <Eye className="h-4 w-4 mr-2" />
            Preview Form
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="script" className="w-full">
        <TabsList>
          <TabsTrigger value="script">
            <Code className="h-4 w-4 mr-2" />
            Embed Script
          </TabsTrigger>
          <TabsTrigger value="iframe">
            <Code className="h-4 w-4 mr-2" />
            Direct Iframe
          </TabsTrigger>
          <TabsTrigger value="url">
            <Code className="h-4 w-4 mr-2" />
            Direct URL
          </TabsTrigger>
        </TabsList>

        <TabsContent value="script">
          <Card>
            <CardHeader>
              <CardTitle>JavaScript Embed (Recommended)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                This script will automatically resize the form to fit its content and works on any website.
              </p>
              <div className="relative">
                <Textarea value={embedScript} readOnly rows={12} className="font-mono text-sm resize-none" />
                <Button size="sm" className="absolute top-2 right-2" onClick={() => copyToClipboard(embedScript)}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h4 className="font-medium mb-2">How to use:</h4>
                <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
                  <li>Copy the code above</li>
                  <li>Paste it into your website's HTML where you want the form to appear</li>
                  <li>The form will automatically load and resize to fit its content</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="iframe">
          <Card>
            <CardHeader>
              <CardTitle>Direct Iframe</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Use this if you prefer a simple iframe embed. You may need to adjust the height manually.
              </p>
              <div className="relative">
                <Textarea
                  value={`<iframe src="${directUrl}" width="100%" height="600" frameborder="0"></iframe>`}
                  readOnly
                  rows={3}
                  className="font-mono text-sm resize-none"
                />
                <Button
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() =>
                    copyToClipboard(`<iframe src="${directUrl}" width="100%" height="600" frameborder="0"></iframe>`)
                  }
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="url">
          <Card>
            <CardHeader>
              <CardTitle>Direct URL</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Share this URL directly or use it in your own iframe implementation.
              </p>
              <div className="relative">
                <Textarea value={directUrl} readOnly rows={2} className="font-mono text-sm resize-none" />
                <Button size="sm" className="absolute top-2 right-2" onClick={() => copyToClipboard(directUrl)}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <Button asChild className="w-full">
                <Link href={directUrl} target="_blank">
                  Open Form in New Tab
                </Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Form Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Form ID:</span> {form.id}
            </div>
            <div>
              <span className="font-medium">Embed Code:</span> {form.embedCode}
            </div>
            <div>
              <span className="font-medium">AI Enabled:</span> {form.aiEnabled ? "Yes" : "No"}
            </div>
            <div>
              <span className="font-medium">Published:</span> {form.isPublished ? "Yes" : "No"}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
