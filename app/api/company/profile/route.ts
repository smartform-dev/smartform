import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

// GET /api/company/profile - Fetches the user's company profile
export async function GET(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (!prisma || !prisma.company) {
      console.error("Prisma client or prisma.company model is not initialized.");
      return NextResponse.json({ error: "Database connection error" }, { status: 500 });
    }

    let company = await prisma.company.findUnique({
      where: { userId },
    });

    // If no company, return error
    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    // Return profile data
    const profileData = {
      name: company?.name || "",
      productDescription: company?.productDescription || "",
      targetAudience: company?.targetAudience || "",
    };

    return NextResponse.json(profileData, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch company profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
