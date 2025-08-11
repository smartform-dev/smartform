import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getAuth } from "@clerk/nextjs/server"

// GET: Fetch the prompt for a form
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = getAuth(request)
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  try {
    const form = await prisma.form.findUnique({
      where: { id },
      include: { company: true, prompt: true },
    })
    if (!form) return NextResponse.json({ error: "Form not found" }, { status: 404 })

    const response = {
      ...form.company,
      ...form.prompt,
    }

    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST: Create or update the prompt for a form
export async function POST(request: NextRequest, { params }: { params: Promise<{ id:string }> }) {
  const { userId } = getAuth(request)
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  try {
    const data = await request.json()
    const { prompt, context, ...companyData } = data

    const form = await prisma.form.findUnique({ where: { id } })
    if (!form) return NextResponse.json({ error: "Form not found" }, { status: 404 })

    if (form.companyId) {
      await prisma.company.update({
        where: { id: form.companyId },
        data: companyData,
      })
    }

    const updatedPrompt = await prisma.formPrompt.upsert({
      where: { formId: id },
      update: { prompt, context },
      create: { formId: id, prompt, context },
    })

    return NextResponse.json(updatedPrompt)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
