"use client"
import { FormChat } from "@/components/form-chat"
import { useEffect, useState } from "react"
import { v4 as uuidv4 } from "uuid"
import type { Form } from "@/lib/types"

export default function FormChatPage({ params }: { params: { id: string } }) {
  // Use localStorage for sessionId to ensure chat continuity across reloads
  const [sessionId, setSessionId] = useState<string>("")
  const [form, setForm] = useState<Form | null>(null)

  useEffect(() => {
    let sid = typeof window !== "undefined" ? window.localStorage.getItem("formchat-session") : null
    if (!sid) {
      sid = uuidv4()
      if (typeof window !== "undefined") {
        window.localStorage.setItem("formchat-session", sid)
      }
    }
    setSessionId(sid || "default")
  }, [])

  useEffect(() => {
    // Fetch form to get styling
    fetch(`/api/forms/${params.id}`)
      .then((res) => res.json())
      .then((data) => setForm(data))
  }, [params.id])

  if (!sessionId || !form) return null

  return (
    <div className="max-w-2xl mx-auto py-8">
      <FormChat formId={params.id} sessionId={sessionId} styling={form.styling} />
    </div>
  )
}
