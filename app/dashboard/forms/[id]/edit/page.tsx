import { notFound } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { FormEditor } from "@/components/form-editor"

// Mock form data (same as in the details page)
const mockForms: Record<string, any> = {
  "550e8400-e29b-41d4-a716-446655440001": {
    id: "550e8400-e29b-41d4-a716-446655440001",
    title: "Contact Us",
    description: "Get in touch with our team and we'll respond within 24 hours",
    fields: [
      {
        id: "name",
        type: "text",
        label: "Full Name",
        placeholder: "Enter your full name",
        required: true,
      },
      {
        id: "email",
        type: "email",
        label: "Email Address",
        placeholder: "your.email@example.com",
        required: true,
      },
      {
        id: "company",
        type: "text",
        label: "Company",
        placeholder: "Your company name",
        required: false,
      },
      {
        id: "subject",
        type: "select",
        label: "Subject",
        placeholder: "Select a topic",
        required: true,
        options: ["General Inquiry", "Sales", "Support", "Partnership", "Other"],
      },
      {
        id: "message",
        type: "textarea",
        label: "Message",
        placeholder: "Tell us how we can help you...",
        required: true,
      },
    ],
    styling: {
      primaryColor: "#2D5016",
      backgroundColor: "#ffffff",
      textColor: "#1f2937",
      borderRadius: "8px",
      fontSize: "16px",
      fontFamily: "Inter",
      darkMode: false,
    },
    aiPrompt:
      "You are a helpful customer service assistant for TechCorp. Based on the contact form submission, provide a relevant follow-up question or offer assistance.",
    aiEnabled: true,
    isPublished: true,
    embedCode: "contact_form_2024",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  "550e8400-e29b-41d4-a716-446655440002": {
    id: "550e8400-e29b-41d4-a716-446655440002",
    title: "Newsletter Signup",
    description: "Stay updated with our latest news, product updates, and industry insights",
    fields: [
      {
        id: "email",
        type: "email",
        label: "Email Address",
        placeholder: "Enter your email address",
        required: true,
      },
      {
        id: "firstName",
        type: "text",
        label: "First Name",
        placeholder: "Your first name",
        required: true,
      },
      {
        id: "lastName",
        type: "text",
        label: "Last Name",
        placeholder: "Your last name",
        required: false,
      },
      {
        id: "interests",
        type: "checkbox",
        label: "I'm interested in product updates",
        required: false,
      },
      {
        id: "frequency",
        type: "radio",
        label: "Email Frequency",
        required: true,
        options: ["Weekly", "Bi-weekly", "Monthly"],
      },
    ],
    styling: {
      primaryColor: "#3b82f6",
      backgroundColor: "#f8fafc",
      textColor: "#1e293b",
      borderRadius: "12px",
      fontSize: "16px",
      fontFamily: "Inter",
      darkMode: false,
    },
    aiPrompt:
      "You are a friendly newsletter assistant for TechCorp. Welcome new subscribers warmly and ask if they have any specific topics they're interested in learning about.",
    aiEnabled: true,
    isPublished: true,
    embedCode: "newsletter_signup_2024",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
}

async function getForm(id: string) {
  try {
    // Try to fetch from API first
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/forms/${id}`, {
      cache: "no-store",
    })

    if (response.ok) {
      const form = await response.json()
      // Transform database format to component format
      return {
        id: form.id,
        title: form.title,
        description: form.description,
        fields: form.fields || [],
        styling: form.styling || {
          primaryColor: "#2D5016",
          backgroundColor: "#ffffff",
          textColor: "#000000",
          borderRadius: "8px",
          fontSize: "16px",
          fontFamily: "Inter",
          darkMode: false,
        },
        aiPrompt: form.ai_prompt,
        aiEnabled: form.ai_enabled,
        isPublished: form.is_published,
        embedCode: form.embed_code,
        createdAt: form.created_at,
        updatedAt: form.updated_at,
      }
    }
  } catch (error) {
    console.log("API fetch failed, using mock data")
  }

  // Fallback to mock data
  return mockForms[id] || null
}

export default async function EditFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const form = await getForm(id)

  if (!form) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Edit Form</h1>
          <p className="text-muted-foreground mt-2">Update your AI-powered contact form</p>
        </div>
        <FormEditor form={form} />
      </div>
    </div>
  )
}
