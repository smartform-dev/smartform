import { NextResponse, NextRequest } from "next/server"
import { prisma } from "@/lib/db"
import { getAuth } from '@clerk/nextjs/server'

// GET /api/forms - List all forms with submission counts
export async function GET(request: NextRequest) {
  const { userId } = getAuth(request)
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const forms = await prisma.form.findMany({
      include: {
        fields: true,
        embeds: true,
        _count: {
          select: { submissions: true }
        }
      },
      orderBy: { createdAt: "desc" }
    })

    const transformedForms = forms.map(form => ({
      id: form.id,
      title: form.title,
      description: form.description,
      is_published: form.isActive,
      created_at: form.createdAt,
      embed_code: form.embeds[0]?.embedCode || null,
      submission_count: form._count.submissions,
    }))

    return NextResponse.json(transformedForms)
  } catch (error) {
    console.error("API Error in GET /api/forms:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/forms - Create a new form
export async function POST(request: NextRequest) {
  const { userId } = getAuth(request)
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await request.json()
    const { title, description, fields, embedCode } = body

    if (!title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    // Find the local user by external_id (Clerk userId)
    const dbUser = await prisma.users.findUnique({
      where: { external_id: userId }
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found in database" }, { status: 404 });
    }

    const newForm = await prisma.form.create({
      data: {
        ownerId: dbUser.id,
        title,
        description,
        isActive: true,
        fields: {
          create: (fields || []).map((f: any, idx: number) => ({
            label: f.label,
            type: f.type,
            required: !!f.required,
            options: f.options ? JSON.stringify(f.options) : null,
            order: idx,
          }))
        },
        embeds: embedCode
          ? { create: { embedCode, url: `/embed/${embedCode}` } }
          : undefined,
      },
      include: {
        fields: true,
        embeds: true,
      }
    })

    return NextResponse.json(newForm)
  } catch (error) {
    console.error("Error creating form:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
