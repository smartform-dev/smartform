import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// GET: List all company files from DB
export async function GET() {
  const files = await prisma.companyFile.findMany({ orderBy: { createdAt: "desc" } })
  return NextResponse.json(files)
}

// POST: Add a file entry to DB
export async function POST(request: NextRequest) {
  const { name, url, size, mime_type } = await request.json()
  if (!name || !url || !size || !mime_type) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }
  const file = await prisma.companyFile.create({
    data: { name, url, size, mime_type }
  })
  return NextResponse.json(file)
}

// DELETE: Remove a file entry from DB
export async function DELETE(request: NextRequest) {
  const { id } = await request.json()
  if (!id) return NextResponse.json({ error: "File id required" }, { status: 400 })
  await prisma.companyFile.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
