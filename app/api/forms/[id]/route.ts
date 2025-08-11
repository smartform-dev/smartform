import { prisma, safeQuery, isMockMode } from "@/lib/db"
import { getAuth } from "@clerk/nextjs/server"
import { type NextRequest, NextResponse } from "next/server"

// Mock form data with complete form definitions
const mockForms: Record<string, any> = {
  "550e8400-e29b-41d4-a716-446655440001": {
    id: "550e8400-e29b-41d4-a716-446655440001",
    user_id: "demo_user",
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
    ai_prompt:
      "You are a helpful customer service assistant for TechCorp. Based on the contact form submission, provide a relevant follow-up question or offer assistance. Be professional, friendly, and helpful.",
    ai_enabled: true,
    is_published: true,
    embed_code: "contact_form_2024",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  "550e8400-e29b-41d4-a716-446655440002": {
    id: "550e8400-e29b-41d4-a716-446655440002",
    user_id: "demo_user",
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
    ai_prompt:
      "You are a friendly newsletter assistant for TechCorp. Welcome new subscribers warmly and ask if they have any specific topics they're interested in learning about.",
    ai_enabled: true,
    is_published: true,
    embed_code: "newsletter_signup_2024",
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  "550e8400-e29b-41d4-a716-446655440003": {
    id: "550e8400-e29b-41d4-a716-446655440003",
    user_id: "demo_user",
    title: "Product Demo Request",
    description: "Request a personalized demo of our platform",
    fields: [
      {
        id: "fullName",
        type: "text",
        label: "Full Name",
        placeholder: "Enter your full name",
        required: true,
      },
      {
        id: "email",
        type: "email",
        label: "Work Email",
        placeholder: "your.email@company.com",
        required: true,
      },
      {
        id: "phone",
        type: "text",
        label: "Phone Number",
        placeholder: "+1 (555) 123-4567",
        required: false,
      },
      {
        id: "companyName",
        type: "text",
        label: "Company Name",
        placeholder: "Your company",
        required: true,
      },
      {
        id: "companySize",
        type: "select",
        label: "Company Size",
        placeholder: "Select company size",
        required: true,
        options: ["1-10 employees", "11-50 employees", "51-200 employees", "201-1000 employees", "1000+ employees"],
      },
      {
        id: "useCase",
        type: "textarea",
        label: "Primary Use Case",
        placeholder: "Tell us about your main use case or challenge...",
        required: true,
      },
    ],
    styling: {
      primaryColor: "#059669",
      backgroundColor: "#ffffff",
      textColor: "#111827",
      borderRadius: "6px",
      fontSize: "15px",
      fontFamily: "Inter",
      darkMode: false,
    },
    ai_prompt:
      "You are a sales assistant for TechCorp. Based on the demo request, provide helpful information about next steps.",
    ai_enabled: true,
    is_published: false,
    embed_code: "demo_request_2024",
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  "550e8400-e29b-41d4-a716-446655440004": {
    id: "550e8400-e29b-41d4-a716-446655440004",
    user_id: "demo_user",
    title: "Customer Feedback",
    description: "Help us improve by sharing your experience",
    fields: [
      {
        id: "customerName",
        type: "text",
        label: "Your Name",
        placeholder: "Enter your name",
        required: false,
      },
      {
        id: "email",
        type: "email",
        label: "Email (Optional)",
        placeholder: "your.email@example.com",
        required: false,
      },
      {
        id: "rating",
        type: "radio",
        label: "Overall Experience",
        required: true,
        options: ["Excellent", "Good", "Average", "Poor"],
      },
      {
        id: "recommendation",
        type: "radio",
        label: "Would you recommend us?",
        required: true,
        options: ["Definitely", "Probably", "Not sure", "Probably not", "Definitely not"],
      },
      {
        id: "feedback",
        type: "textarea",
        label: "Additional Comments",
        placeholder: "Share any additional feedback or suggestions...",
        required: false,
      },
    ],
    styling: {
      primaryColor: "#dc2626",
      backgroundColor: "#fef2f2",
      textColor: "#1f2937",
      borderRadius: "10px",
      fontSize: "16px",
      fontFamily: "Inter",
      darkMode: false,
    },
    ai_prompt:
      "You are a customer success representative for TechCorp. Thank customers for their feedback and ask follow-up questions based on their rating.",
    ai_enabled: true,
    is_published: true,
    embed_code: "feedback_form_2024",
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
}

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  // Remove Clerk auth check for GET to allow public access
  // const { userId } = getAuth(request)
  // if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await context.params;
  try {
    console.log(`GET /api/forms/${id} - Starting request`)

    // Check if we're in mock mode first
    if (isMockMode()) {
      console.log("Using mock data mode for form", id)
      const mockForm = mockForms[id]
      if (!mockForm) {
        return NextResponse.json({ error: "Form not found" }, { status: 404 })
      }
      return NextResponse.json(mockForm)
    }

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
    }, mockForms[id] || null)

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

    // Return mock data if available
    const mockForm = mockForms[id]
    if (mockForm) {
      console.log("Falling back to mock data for form", id)
      return NextResponse.json(mockForm)
    }

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
