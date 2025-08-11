import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getAuth } from "@clerk/nextjs/server"

export async function GET(request: NextRequest) {
  const { userId } = getAuth(request)
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const company = await prisma.company.findUnique({
      where: { userId },
    })

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 })
    }

    return NextResponse.json(company, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const { userId: externalUserId } = getAuth(request);
  if (!externalUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    console.log("Input:", body);

    const user = await prisma.users.findUnique({
      where: { external_id: externalUserId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const existingCompany = await prisma.company.findUnique({
      where: { userId: user.id },
    });

    if (existingCompany) {
      console.log("Existing company:", existingCompany);
      return NextResponse.json({ error: "Company already exists" }, { status: 400 });
    }

    const company = await prisma.company.create({
      data: {
        ...body,
        userId: user.id,
      },
    });

    return NextResponse.json(company, { status: 200 });
  } catch (error) {
    console.error("Error creating company:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const { userId } = getAuth(request)
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await request.json()
    const company = await prisma.company.update({
      where: { userId },
      data: body,
    })

    return NextResponse.json(company, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
