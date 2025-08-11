import { type NextRequest, NextResponse } from "next/server"
import { prisma, safeQuery } from "@/lib/db"
import { getAuth } from '@clerk/nextjs/server'

// Mock submissions data
const mockSubmissions: Record<string, any[]> = {
  "550e8400-e29b-41d4-a716-446655440001": [
    {
      id: "660e8400-e29b-41d4-a716-446655440001",
      form_id: "550e8400-e29b-41d4-a716-446655440001",
      submission_data: {
        name: "John Smith",
        email: "john.smith@techstartup.com",
        company: "TechStartup Inc",
        subject: "Sales",
        message: "Hi, I'm interested in learning more about your enterprise solutions.",
      },
      ai_response: "Thank you for your interest in our enterprise solutions, John!",
      user_responded: true,
      user_response: "yes",
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      chat_interactions: [
        {
          id: "770e8400-e29b-41d4-a716-446655440001",
          message: "Thank you for your interest in our enterprise solutions, John!",
          is_ai: true,
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "770e8400-e29b-41d4-a716-446655440002",
          message: "yes",
          is_ai: false,
          created_at: new Date(Date.now() - 1 * 60 * 60 * 50 * 60 * 1000).toISOString(),
        },
      ],
    },
  ],
  "550e8400-e29b-41d4-a716-446655440002": [
    {
      id: "660e8400-e29b-41d4-a716-446655440003",
      form_id: "550e8400-e29b-41d4-a716-446655440002",
      submission_data: {
        email: "mike.chen@example.com",
        firstName: "Mike",
        lastName: "Chen",
        interests: true,
        frequency: "Weekly",
      },
      ai_response: "Welcome to our newsletter, Mike!",
      user_responded: true,
      user_response: "yes",
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      chat_interactions: [
        {
          id: "770e8400-e29b-41d4-a716-446655440005",
          message: "Welcome to our newsletter, Mike!",
          is_ai: true,
          created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ],
    },
  ],
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = getAuth(request)
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params

  try {
    // Try to fetch from database
    const submissions = await safeQuery(async () => {
      const dbSubs = await prisma.formSubmission.findMany({
        where: {
          formId: id
        },
        orderBy: {
          submittedAt: 'desc'
        }
      })

      // Fetch the form and its fields to map field IDs to labels
      const form = await prisma.form.findUnique({
        where: { id },
        include: { fields: true },
      })
      const fieldMap = (form?.fields || []).reduce((acc, field) => {
        acc[field.id] = field.label
        return acc
      }, {} as Record<string, string>)

      // Map 'data' to 'submission_data' and replace field IDs with labels
      return dbSubs.map(sub => {
        const original = sub.data || {}
        const mapped: Record<string, any> = {}
        for (const [key, value] of Object.entries(original)) {
          mapped[fieldMap[key] || key] = value
        }
        return {
          ...sub,
          submission_data: mapped,
        }
      })
    }, mockSubmissions[id] || [])

    return NextResponse.json(submissions)
  } catch (error) {
    console.error("Error fetching submissions:", error)
    return NextResponse.json(mockSubmissions[id] || [])
  }
}
