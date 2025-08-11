import { notFound } from "next/navigation"
import { EmbeddedForm } from "@/components/embedded-form"
import { prisma } from "@/lib/db"

async function getForm(embedCode: string) {
  try {
    // Use Prisma ORM to fetch the form by embedCode and isActive
    const form = await prisma.form.findFirst({
      where: {
        embeds: {
          some: {
            embedCode: embedCode,
          },
        },
        isActive: true,
      },
      include: {
        embeds: true,
        fields: true,
      },
    })
    return form
  } catch (error) {
    console.error("Error fetching form:", error)
    return null
  }
}

export default async function EmbedPage({ params }: { params: Promise<{ embedCode: string }> }) {
  const { embedCode } = await params
  const form = await getForm(embedCode)

  if (!form) {
    notFound()
  }

  // Transform database form to component format
  const formData = {
    id: form.id,
    userId: form.ownerId || "",
    title: form.title,
    description: form.description || "",
    fields: (form.fields || []).map((f: any) => ({
      id: f.id,
      type: ["text", "email", "textarea", "select", "radio", "checkbox"].includes(f.type) ? f.type : "text",
      label: f.label,
      placeholder: f.placeholder,
      required: f.required,
      options: f.options ? (Array.isArray(f.options) ? f.options : (typeof f.options === "string" ? JSON.parse(f.options) : undefined)) : undefined,
    })),
    styling: {
      primaryColor: "#2D5016",
      backgroundColor: "#ffffff",
      textColor: "#000000",
      borderRadius: "8px",
      fontSize: "16px",
      fontFamily: "Inter",
      darkMode: false,
    },
    aiPrompt: "",
    aiEnabled: false,
    isPublished: form.isActive ?? true,
    embedCode: form.embeds?.[0]?.embedCode || params.embedCode,
    createdAt: form.createdAt?.toISOString?.() || "",
    updatedAt: form.updatedAt?.toISOString?.() || "",
  }

  return (
    <div className="min-h-screen p-4">
      <EmbeddedForm form={formData} />
    </div>
  )
}
