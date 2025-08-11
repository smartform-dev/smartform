import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const external_id = searchParams.get("external_id");

  if (!external_id) {
    return NextResponse.json(
      { error: "external_id is required" },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.users.findUnique({
      where: { external_id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { external_id, email, first_name, last_name, image_url } = body;

    if (!external_id || !email) {
      return NextResponse.json(
        { error: "external_id and email are required" },
        { status: 400 }
      );
    }

    const user = await prisma.users.upsert({
      where: { external_id },
      update: {
        email,
        first_name,
        last_name,
        image_url,
        last_login: new Date(),
      },
      create: {
        external_id,
        email,
        first_name,
        last_name,
        image_url,
      },
    });

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error upserting user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
