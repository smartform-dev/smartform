import { notFound } from "next/navigation"
import { EmbeddedForm } from "@/components/embedded-form"
import { prisma } from "@/lib/db"

interface FormStyling {
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  borderRadius: string;
  fontSize: string;
  fontFamily: string;
  darkMode: boolean;
}

async function getForm(id: string) {
  try {
    // Try to get form by ID first
    let form = await prisma.form.findFirst({
      where: {
        OR: [
          { id, isActive: true },
          { embeds: { some: { embedCode: id } }, isActive: true },
        ],
      },
      include: {
        fields: true,
        embeds: true,
      },
    })
    return form
  } catch (error) {
    console.error("Error fetching form:", error)
    return null
  }
}

export default async function FormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const form = await getForm(id)

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
    styling: (form.styling as unknown as FormStyling) || {
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
    embedCode: form.embeds?.[0]?.embedCode || id,
    createdAt: form.createdAt?.toISOString?.() || "",
    updatedAt: form.updatedAt?.toISOString?.() || "",
  }

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Form Preview</h1>
          <p className="text-gray-600">This is how your form will appear to visitors</p>
        </div>
        <EmbeddedForm form={formData} />
      </div>
    </div>
  )
}
