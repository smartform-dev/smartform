import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(request: Request) {
  const { userId } = getAuth(request)
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    // Stats
    const [totalForms, totalSubmissions] = await Promise.all([
      prisma.form.count(),
      prisma.formSubmission.count(),
    ])

    // Recent submissions (last 10)
    const recentSubmissionsRaw = await prisma.formSubmission.findMany({
      orderBy: { submittedAt: "desc" },
      take: 10,
      include: {
        form: { select: { title: true } }
      }
    })
    const recentSubmissions = recentSubmissionsRaw.map(sub => ({
      title: sub.form?.title || "Untitled",
      created_at: sub.submittedAt,
      has_ai_response: false // Placeholder, as not in schema
    }))

    // Top forms by submission count
    const topFormsRaw = await prisma.form.findMany({
      include: {
        _count: { select: { submissions: true } }
      },
      orderBy: { submissions: { _count: "desc" } },
      take: 5
    })
    const topForms = topFormsRaw.map(form => ({
      title: form.title,
      submission_count: form._count.submissions
    }))

    const analyticsData = {
      stats: {
        total_forms: totalForms,
        total_submissions: totalSubmissions,
        ai_interactions: 0, // Not tracked in schema
        user_responses: 0,  // Not tracked in schema
      },
      recentSubmissions,
      topForms,
    }

    return NextResponse.json(analyticsData)
  } catch (error) {
    console.error("Analytics error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
