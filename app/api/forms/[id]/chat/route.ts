import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getAuth } from "@clerk/nextjs/server"

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

// GET: Fetch all chat messages for a form and session
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = getAuth(request)
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const sessionId = request.nextUrl.searchParams.get("sessionId") || "default"
  try {
    const chats = await prisma.formChat.findMany({
      where: { formId: id, sessionId },
      orderBy: { createdAt: "asc" },
    })
    return NextResponse.json(chats)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST: Add a new chat message for a form and session, and get AI response if sender is user
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = getAuth(request)
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  try {
    const { sessionId, sender, message } = await request.json()
    // Save user message
    const chat = await prisma.formChat.create({
      data: { formId: id, sessionId, sender, message },
    })
    // If user, get prompt and chat history, then call OpenAI
    if (sender === "user") {
      const form = await prisma.form.findUnique({
        where: { id },
        include: { company: true, prompt: true },
      })
      const history = await prisma.formChat.findMany({
        where: { formId: id, sessionId },
        orderBy: { createdAt: "asc" },
      })
      // Compose system prompt and messages
      const systemPrompt =
        form && form.company && form.prompt
          ? `Business: ${form.company.name}\nType: ${form.company.businessType}\nGoal: ${form.company.mainContactGoal}\nProduct: ${form.company.productDescription}\nAudience: ${form.company.targetAudience}\nTone: ${form.company.preferredTone}\nKeywords: ${form.company.keywords}\nCommon Qs: ${form.company.commonQuestions}\nValue: ${form.company.valueOffers}\nFollow-up: ${form.company.followUpStyle}\n\n${form.prompt.prompt}\n\n${form.prompt.context}`
          : "You are a helpful business assistant."
      const messages = [
        { role: "system", content: systemPrompt },
        ...history.map((c) => ({ role: c.sender === "user" ? "user" : "assistant", content: c.message })),
      ]
      // Call OpenAI 4o-mini using fetch
      const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages,
        }),
      })
      const aiData = await openaiRes.json()
      const aiMessage = aiData.choices?.[0]?.message?.content || "I'm here to help!"
      // Save AI response
      const aiChat = await prisma.formChat.create({
        data: { formId: id, sessionId, sender: "ai", message: aiMessage },
      })
      return NextResponse.json([chat, aiChat])
    }
    return NextResponse.json(chat)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
