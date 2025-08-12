import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { getAuth } from "@clerk/nextjs/server"

export async function POST(request: NextRequest, { params }: { params: Promise<{ embedCode: string }> }) {
  const { userId } = getAuth(request)
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { embedCode } = await params
  try {
    const body = await request.json()
    const { submissionData } = body

    if (!submissionData || typeof submissionData !== "object") {
      return NextResponse.json({ error: "Invalid submission data" }, { status: 400 })
    }

    // Get form by embed code using Prisma
    const form = await prisma.form.findFirst({
      where: {
        embeds: {
          some: { embedCode },
        },
        isActive: true,
      },
      include: {
        embeds: true,
        prompt: true,
      },
    })

    if (!form) {
      return NextResponse.json({ error: "Form not found or not published" }, { status: 404 })
    }

    // Create submission
    const submission = await prisma.formSubmission.create({
      data: {
        formId: form.id,
        data: submissionData,
        ip: request.headers.get("x-forwarded-for") || "127.0.0.1",
        userAgent: request.headers.get("user-agent") || "Unknown",
      },
    })

    let aiResponse = null

    // Generate AI response if enabled and API key is available
    if (form.prompt && form.prompt.prompt && process.env.OPENAI_API_KEY) {
      try {
        const submissionText = Object.entries(submissionData)
          .map(([key, value]) => `${key}: ${value}`)
          .join("\n")

        const { text } = await generateText({
          model: openai("gpt-3.5-turbo"),
          prompt: `${form.prompt.prompt}\n\nForm submission:\n${submissionText}\n\nProvide a helpful, personalized response:`,
          maxOutputTokens: 200,
        })

        aiResponse = text

        // Update submission with AI response
        await prisma.formSubmission.update({
          where: { id: submission.id },
          data: { data: { ...submissionData, aiResponse } },
        })

        // Optionally, create chat interaction for AI response (if you have a model for it)
        // await prisma.chatInteraction.create({
        //   data: {
        //     submissionId: submission.id,
        //     message: aiResponse,
        //     isAi: true,
        //   },
        // })
      } catch (aiError) {
        console.error("Error generating AI response:", aiError)
        // Continue without AI response if there's an error
      }
    }

    return NextResponse.json({
      success: true,
      submissionId: submission.id,
      aiResponse,
    })
  } catch (error) {
    console.error("Error submitting form:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
