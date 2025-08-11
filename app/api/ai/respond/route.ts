import { getAuth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const { userId } = getAuth(request)
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await request.json()
    const { submissionId, response } = body

    if (!submissionId || !["yes", "no"].includes(response)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    // Update submission with user response
    const submission = await prisma.formSubmission.update({
      where: { id: submissionId },
      data: {
        userResponded: { set: true },
        userResponse: { set: response },
      },
    })

    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 })
    }

    // Save user response as a chat message
    await prisma.formChat.create({
      data: {
        formId: submission.formId,
        sessionId: submissionId, // or use a real sessionId if available
        sender: "user",
        message: response,
      },
    })

    // Create follow-up AI response based on user's yes/no
    const followUpMessage =
      response === "yes"
        ? "Great! I'll make sure someone from our team reaches out to you soon with more information."
        : "No problem! Thanks for letting us know. Feel free to reach out if you have any other questions."

    await prisma.formChat.create({
      data: {
        formId: submission.formId,
        sessionId: submissionId, // or use a real sessionId if available
        sender: "ai",
        message: followUpMessage,
      },
    })

    return NextResponse.json({
      success: true,
      followUpMessage,
    })
  } catch (error) {
    console.error("Error processing AI response:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
