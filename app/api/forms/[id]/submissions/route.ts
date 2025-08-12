import { type NextRequest, NextResponse } from "next/server"
import { prisma, safeQuery } from "@/lib/db"
import { getAuth } from '@clerk/nextjs/server'



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
    }, [])

    return NextResponse.json(submissions)
  } catch (error) {
    console.error("Error fetching submissions:", error)
    return NextResponse.json([])
  }
}
