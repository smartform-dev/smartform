"use client"

import { useState } from "react"
import type { Form } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Copy, Edit, Eye, Code, BarChart3, MessageSquare, Bot, User, ExternalLink } from "lucide-react"
import Link from "next/link"
import { generateEmbedScript, generateFormUrl, generateEmbedSnippet } from "@/lib/utils"

interface FormDetailsProps {
  form: Form
  submissions: any[]
}

export function FormDetails({ form, submissions }: FormDetailsProps) {
  const [embedCode, setEmbedCode] = useState(generateEmbedScript(form.embedCode || form.id))
  const [copied, setCopied] = useState(false)

  const formUrl = generateFormUrl(form.id)
  const embedSnippet = generateEmbedSnippet(form.id)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const togglePublish = async () => {
    try {
      const response = await fetch(`/api/forms/${form.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          isPublished: !form.isPublished,
        }),
      })

      if (response.ok) {
        window.location.reload()
      }
    } catch (error) {
      console.error("Error updating form:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{form.title}</h1>
          <p className="text-muted-foreground mt-2">{form.description || "No description"}</p>
          <div className="flex items-center gap-2 mt-4">
            <Badge variant={form.isPublished ? "default" : "secondary"}>
              {form.isPublished ? "Published" : "Draft"}
            </Badge>
            <Badge variant="outline">{submissions.length} submissions</Badge>
          </div>
        </div>

        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href={`/dashboard/forms/${form.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>

          {form.isPublished && (
            <>
              <Button asChild variant="outline">
                <Link href={`/embed/${form.embedCode || form.id}`} target="_blank">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Link>
              </Button>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Code className="h-4 w-4 mr-2" />
                    Embed Code
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Embed Your Form</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Direct Link
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">Share this direct link to your form:</p>
                      <div className="relative">
                        <Textarea value={formUrl} readOnly rows={2} className="font-mono text-sm resize-none" />
                        <Button size="sm" className="absolute top-2 right-2" onClick={() => copyToClipboard(formUrl)}>
                          {copied ? "Copied!" : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <Code className="h-4 w-4 mr-2" />
                        Simple Embed Snippet
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Copy and paste this simple snippet into your website:
                      </p>
                      <div className="relative">
                        <Textarea value={embedSnippet} readOnly rows={3} className="font-mono text-sm resize-none" />
                        <Button
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => copyToClipboard(embedSnippet)}
                        >
                          {copied ? "Copied!" : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Full Embed Script (Advanced)</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        This script automatically resizes the form to fit its content:
                      </p>
                      <div className="relative">
                        <Textarea value={embedCode} readOnly rows={8} className="font-mono text-sm resize-none" />
                        <Button size="sm" className="absolute top-2 right-2" onClick={() => copyToClipboard(embedCode)}>
                          {copied ? "Copied!" : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          )}

          <Button onClick={togglePublish} className="bg-primary hover:bg-primary/90">
            {form.isPublished ? "Unpublish" : "Publish"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="submissions" className="w-full">
        <TabsList>
          <TabsTrigger value="submissions">
            <MessageSquare className="h-4 w-4 mr-2" />
            Submissions ({submissions.length})
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="submissions" className="space-y-4">
          {submissions.length === 0 ? (
            <Card>
              <CardContent className="text-center py-16">
                <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No submissions yet</h3>
                <p className="text-muted-foreground">
                  {form.isPublished
                    ? "Share your form to start receiving submissions"
                    : "Publish your form to start receiving submissions"}
                </p>
              </CardContent>
            </Card>
          ) : (
            submissions.map((submission) => (
              <Card key={submission.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">Submission #{submission.id.slice(-8)}</CardTitle>
                    <Badge variant="outline">{new Date(submission.created_at).toLocaleDateString()}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3">
                    {Object.entries(submission.submission_data).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="font-medium text-sm text-muted-foreground">{key}:</span>
                        <span className="text-sm">{String(value)}</span>
                      </div>
                    ))}
                  </div>

                  {submission.chat_interactions && submission.chat_interactions.length > 0 && (
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-3 flex items-center">
                        <Bot className="h-4 w-4 mr-2" />
                        AI Conversation
                      </h4>
                      <div className="space-y-3">
                        {submission.chat_interactions.map((interaction: any) => (
                          <div
                            key={interaction.id}
                            className={`flex items-start gap-3 ${
                              interaction.is_ai ? "bg-blue-50 dark:bg-blue-900/20" : "bg-gray-50 dark:bg-gray-800"
                            } rounded-lg p-3`}
                          >
                            {interaction.is_ai ? (
                              <Bot className="h-5 w-5 text-blue-600 mt-0.5" />
                            ) : (
                              <User className="h-5 w-5 text-gray-600 mt-0.5" />
                            )}
                            <div className="flex-1">
                              <p className="text-sm font-medium mb-1">{interaction.is_ai ? "AI Assistant" : "User"}</p>
                              <p className="text-sm text-gray-700 dark:text-gray-300">{interaction.message}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Form Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{submissions.length}</div>
                  <p className="text-sm text-muted-foreground">Total Submissions</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {submissions.filter((s) => s.ai_response).length}
                  </div>
                  <p className="text-sm text-muted-foreground">AI Interactions</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {submissions.filter((s) => s.user_responded).length}
                  </div>
                  <p className="text-sm text-muted-foreground">User Responses</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
