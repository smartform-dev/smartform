import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { supabase } from "@/lib/supabase";

// GET /api/company/files - Fetches all files for the user's company
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
    const company = await prisma.company.findUnique({
      where: { userId },
      include: {
        files: {
          where: { deleted: false },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!company) {
      // If company doesn't exist, return empty state.
      return NextResponse.json(
        {
          files: [],
          usage: {
            used: 0,
            available: 10, // Default allowance
          },
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        files: company.files,
        usage: {
          used: company.dataUsage,
          available: company.maxDataAllowance,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to fetch company files:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST /api/company/files - Uploads a new file
export async function POST(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const bucketName = process.env.SUPABASE_BUCKET_NAME;
  if (!bucketName) {
    console.error("SUPABASE_BUCKET_NAME is not set.");
    return NextResponse.json(
      { error: "Storage configuration error" },
      { status: 500 }
    );
  }

  const date = new Date().toISOString().split("T")[0];
  const filePath = `${userId}/${date}/${file.name}`;

  try {
    if (!prisma || !prisma.company) {
      console.error("Prisma client or prisma.company model is not initialized.");
      return NextResponse.json({ error: "Database connection error" }, { status: 500 });
    }
    // Upload to Supabase
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file);

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    const fileSizeMB = file.size / 1024 / 1024;

    // Get company
    const company = await prisma.company.findUnique({ where: { userId } });
    if (!company) {
      return NextResponse.json(
        { error: "Company not found. Please create a company first." },
        { status: 404 }
      );
    }

    // Check if upload exceeds allowance
    if (company.dataUsage + fileSizeMB > company.maxDataAllowance) {
      // Delete the just-uploaded file from Supabase
      await supabase.storage.from(bucketName).remove([filePath]);
      return NextResponse.json(
        { error: "Upload exceeds data allowance." },
        { status: 413 }
      );
    }

    // Add file to DB and update usage
    const newFile = await prisma.companyFile.create({
      data: {
        companyId: company.id,
        name: file.name,
        url: publicUrlData.publicUrl,
        size: fileSizeMB,
      },
    });

    await prisma.company.update({
      where: { id: company.id },
      data: {
        dataUsage: {
          increment: fileSizeMB,
        },
      },
    });

    return NextResponse.json(newFile, { status: 201 });
  } catch (error) {
    console.error("Failed to upload file:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE /api/company/files - Deletes one or all files
export async function DELETE(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const fileId = searchParams.get("id");
  const deleteAll = searchParams.get("all") === "true";

  const company = await prisma.company.findUnique({ where: { userId } });
  if (!company) {
    return NextResponse.json({ error: "Company not found" }, { status: 404 });
  }

  const bucketName = process.env.SUPABASE_BUCKET_NAME;
   if (!bucketName) {
    console.error("SUPABASE_BUCKET_NAME is not set.");
    return NextResponse.json(
      { error: "Storage configuration error" },
      { status: 500 }
    );
  }

  try {
    if (!prisma || !prisma.company) {
      console.error("Prisma client or prisma.company model is not initialized.");
      return NextResponse.json({ error: "Database connection error" }, { status: 500 });
    }
    if (deleteAll) {
      // Delete all files
      const filesToDelete = await prisma.companyFile.findMany({
        where: { companyId: company.id, deleted: false },
      });

      const filePaths = filesToDelete.map(f => f.url.split(bucketName + '/')[1]);
      
      if(filePaths.length > 0) {
        await supabase.storage.from(bucketName).remove(filePaths);
      }

      await prisma.companyFile.updateMany({
        where: { companyId: company.id },
        data: { deleted: true },
      });

      await prisma.company.update({
        where: { id: company.id },
        data: { dataUsage: 0 },
      });

      return NextResponse.json(
        { message: "All files deleted successfully" },
        { status: 200 }
      );
    } else if (fileId) {
      // Delete a single file
      const fileToDelete = await prisma.companyFile.findUnique({
        where: { id: fileId },
      });

      if (!fileToDelete || fileToDelete.companyId !== company.id) {
        return NextResponse.json({ error: "File not found" }, { status: 404 });
      }
      
      const filePath = fileToDelete.url.split(bucketName + '/')[1];
      await supabase.storage.from(bucketName).remove([filePath]);

      await prisma.companyFile.update({
        where: { id: fileId },
        data: { deleted: true },
      });

      await prisma.company.update({
        where: { id: company.id },
        data: {
          dataUsage: {
            decrement: fileToDelete.size,
          },
        },
      });

      return NextResponse.json(
        { message: "File deleted successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "Missing file ID or 'all' parameter" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Failed to delete file(s):", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}