"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Bot, User } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { FormStyling } from "@/lib/types"

interface FormChatProps {
  formId: string
  sessionId: string
  styling?: FormStyling
}

interface ChatMessage {
  id?: string
  sender: "user" | "ai"
  message: string
  createdAt?: string
}

export function FormChat({ formId, sessionId, styling }: FormChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Fetch full chat history on mount and after sending
  const fetchMessages = async () => {
    const res = await fetch(`/api/forms/${formId}/chat?sessionId=${sessionId}`)
    const data = await res.json()
    setMessages(Array.isArray(data) ? data : [])
  }

  useEffect(() => {
    fetchMessages()
  }, [formId, sessionId])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim()) return
    setLoading(true)
    const res = await fetch(`/api/forms/${formId}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, sender: "user", message: input }),
    })
    // The API returns [userMsg, aiMsg] if AI responds, or just userMsg
    const result = await res.json()
    if (Array.isArray(result)) {
      setMessages((msgs) => [...msgs, ...result])
    } else {
      setMessages((msgs) => [...msgs, result])
    }
    setInput("")
    setLoading(false)
    setTimeout(fetchMessages, 500)
  }

  // Use user colors or fallback
  const primary = styling?.primaryColor || "#2563eb"
  const background = styling?.backgroundColor || "#f8fafc"
  const text = styling?.textColor || "#1e293b"
  const borderRadius = styling?.borderRadius || "12px"
  const fontFamily = styling?.fontFamily || "Inter, sans-serif"
  // Reset to original: solid bg, skinny white border, text color as form
  const cardBorder = `1.5px solid ${text}`
  const userBubble = `bg-[${primary}] text-white` // dynamic
  const aiBubble = `bg-white text-[${text}] border border-[${primary}]`

  return (
    <div
      className="w-full max-w-xl mx-auto"
      style={{ fontFamily }}
    >
      <Card
        className="rounded-2xl overflow-hidden"
        style={{ background: background, color: text, borderRadius, border: cardBorder }}
      >
        <CardHeader>
          <CardTitle className="tracking-widest text-lg font-bold flex items-center gap-2" style={{ color: primary }}>
            <Bot className="h-6 w-6" style={{ color: primary }} />
            AI Assistant
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 overflow-y-auto p-4 flex flex-col gap-2" style={{ background, borderRadius }}>
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className={`flex items-end gap-2 mb-1 ${msg.sender === "ai" ? "flex-row" : "flex-row-reverse"}`}
                >
                  <div className="shrink-0">
                    {msg.sender === "ai" ? (
                      <Bot className="h-7 w-7" style={{ color: primary, background: background, borderRadius }} />
                    ) : (
                      <User className="h-7 w-7" style={{ color: background, background: primary, borderRadius }} />
                    )}
                  </div>
                  <motion.div
                    className={`px-5 py-3 max-w-[75%] whitespace-pre-line text-left text-base font-mono ${msg.sender === "ai" ? aiBubble : userBubble}`}
                    style={{ borderRadius }}
                    initial={{ scale: 0.98, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    {msg.message}
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={chatEndRef} />
          </div>
          <div className="flex gap-2 mt-4">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              disabled={loading}
              style={{ background: background, color: text, borderRadius, border: `1px solid ${text}` }}
            />
            <Button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              style={{ background: primary, color: "#fff", borderRadius }}
            >
              Send
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
