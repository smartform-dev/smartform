import { prisma, safeQuery, isMockMode } from "@/lib/db"
import { getAuth } from "@clerk/nextjs/server"
import { type NextRequest, NextResponse } from "next/server"



export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  // Remove Clerk auth check for GET to allow public access
  // const { userId } = getAuth(request)
  // if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await context.params;
  try {
    console.log(`GET /api/forms/${id} - Starting request`)

    const form = await safeQuery(async () => {
      console.log("Attempting database query for form", id)
      const { prisma } = await import("@/lib/db")

      const result = await prisma.form.findUnique({
        where: { id },
        include: {
          fields: true,
          embeds: true,
        },
      })

      console.log("Database query successful for form", id)
      return result
    }, null)

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 })
    }

    // Map Prisma fields to frontend format
    const responseForm = {
      id: form.id,
      title: form.title,
      description: form.description,
      fields: form.fields || [],
      styling: form.styling || null,
      isPublished: form.isActive,
      embedCode: form.embeds?.[0]?.embedCode || null,
      createdAt: form.createdAt,
      updatedAt: form.updatedAt,
      // Add other fields as needed
    }

    console.log("Returning form data for", id)
    return NextResponse.json(responseForm)
  } catch (error) {
    console.error(`Error fetching form ${id}:`, error)

    return NextResponse.json({ error: "Form not found" }, { status: 404 })
  }
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { userId } = getAuth(request)
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await context.params;
  try {
    console.log(`PUT /api/forms/${id} - Starting request`)

    const body = await request.json()
    const { title, description, fields, styling, aiPrompt, aiEnabled, isPublished } = body

    if (!title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    // Use Prisma ORM to update the form and its fields
    const updatedForm = await safeQuery(async () => {
      // Remove all existing fields for this form
      await prisma.formField.deleteMany({ where: { formId: id } })
      // Create new fields
      if (Array.isArray(fields) && fields.length > 0) {
        await prisma.formField.createMany({
          data: fields.map((f: any, idx: number) => ({
            formId: id,
            label: f.label,
            type: f.type,
            required: !!f.required,
            options: f.options ? JSON.stringify(f.options) : null,
            order: idx,
          })),
        })
      }
      // Update the form itself
      const updated = await prisma.form.update({
        where: { id },
        data: {
          title,
          description: description || null,
          isActive: isPublished || false,
          styling: styling || {},
        },
        include: {
          embeds: true,
          fields: true,
        },
      })
      return updated
    }, null)

    if (!updatedForm) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 })
    }

    // Map Prisma fields to frontend format for PUT response
    const responseForm = {
      id: updatedForm.id,
      title: updatedForm.title,
      description: updatedForm.description,
      fields: updatedForm.fields || [],
      styling: updatedForm.styling || null,
      isPublished: updatedForm.isActive,
      embedCode: updatedForm.embeds?.[0]?.embedCode || null,
      createdAt: updatedForm.createdAt,
      updatedAt: updatedForm.updatedAt,
      // Add other fields as needed
    }

    console.log("Returning updated form data for", id)
    return NextResponse.json(responseForm)
  } catch (error) {
    console.error(`Error updating form ${id}:`, error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { userId } = getAuth(request)
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await context.params;
  try {
    console.log(`DELETE /api/forms/${id} - Starting request`)

    const deletedForm = await safeQuery(async () => {
      await prisma.form.delete({
        where: { id },
      })
      return { id }
    }, { id: id })

    if (!deletedForm) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 })
    }

    console.log("Form deletion successful for", id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error deleting form ${id}:`, error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
