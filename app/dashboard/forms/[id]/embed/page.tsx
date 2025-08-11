"use client"

import { useEffect, useState } from "react"
import { useUser, SignInButton, UserButton } from "@clerk/nextjs"
import { useRouter, useParams } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { EmbedCodeDisplay } from "@/components/embed-code-display"

// Mock form data that matches our sample forms
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
    aiPrompt:
      "You are a friendly newsletter assistant for TechCorp. Welcome new subscribers warmly and ask if they have any specific topics they're interested in learning about.",
    aiEnabled: true,
    isPublished: true,
    embedCode: "newsletter_signup_2024",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
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
    aiPrompt:
      "You are a sales assistant for TechCorp. Based on the demo request, provide helpful information about next steps.",
    aiEnabled: true,
    isPublished: false,
    embedCode: "demo_request_2024",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
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
    aiPrompt:
      "You are a customer success representative for TechCorp. Thank customers for their feedback and ask follow-up questions based on their rating.",
    aiEnabled: true,
    isPublished: true,
    embedCode: "feedback_form_2024",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
}

export default function EmbedCodePage() {
  const { isSignedIn, isLoaded } = useUser()
  const router = useRouter()
  const params = useParams()
  const id = Array.isArray(params.id) ? params.id[0] : params.id
  const [form, setForm] = useState(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace("/")
    }
  }, [isLoaded, isSignedIn, router])

  useEffect(() => {
    if (!id || !isSignedIn) return
    setLoading(true)
    fetch(`/api/forms/${id}`)
      .then(async (res) => {
        if (res.status === 401) {
          setError("You must be logged in to view this page.")
          setForm(null)
        } else if (res.status === 404) {
          setError("Form not found.")
          setForm(null)
        } else if (!res.ok) {
          setError("An unexpected error occurred.")
          setForm(null)
        } else {
          const data = await res.json()
          setForm(data)
          setError(null)
        }
      })
      .catch(() => {
        setError("An unexpected error occurred.")
        setForm(null)
      })
      .finally(() => setLoading(false))
  }, [id, isSignedIn])

  if (!isLoaded || !isSignedIn) return null
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <span className="font-bold text-xl">SmartForm</span>
            <nav className="flex items-center space-x-4">
              <SignInButton mode="modal">
                <button className="text-white bg-primary px-4 py-2 rounded">Sign In</button>
              </SignInButton>
            </nav>
          </div>
        </header>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold mb-4">{error}</h1>
          </div>
        </div>
      </div>
    )
  }
  if (!form) return null
  if (!form.isPublished) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold mb-4">Form Not Published</h1>
            <p className="text-muted-foreground">This form must be published before you can get the embed code.</p>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="container mx-auto px-4 py-8">
        <EmbedCodeDisplay form={form} />
      </div>
    </div>
  )
}
