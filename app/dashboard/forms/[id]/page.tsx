import { notFound } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { FormDetails } from "@/components/form-details"

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
    ai_prompt:
      "You are a helpful customer service assistant for TechCorp. Based on the contact form submission, provide a relevant follow-up question or offer assistance.",
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

// Mock submissions data
const mockSubmissions: Record<string, any[]> = {
  "550e8400-e29b-41d4-a716-446655440001": [
    {
      id: "660e8400-e29b-41d4-a716-446655440001",
      form_id: "550e8400-e29b-41d4-a716-446655440001",
      submission_data: {
        name: "John Smith",
        email: "john.smith@techstartup.com",
        company: "TechStartup Inc",
        subject: "Sales",
        message:
          "Hi, I'm interested in learning more about your enterprise solutions. We're a growing startup with about 50 employees.",
      },
      ai_response:
        "Thank you for your interest in our enterprise solutions, John! It sounds like TechStartup Inc is at an exciting growth stage. I'd love to learn more about your specific needs. Would you be interested in scheduling a 30-minute demo call this week?",
      user_responded: true,
      user_response: "yes",
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      chat_interactions: [
        {
          id: "770e8400-e29b-41d4-a716-446655440001",
          message:
            "Thank you for your interest in our enterprise solutions, John! It sounds like TechStartup Inc is at an exciting growth stage. I'd love to learn more about your specific needs. Would you be interested in scheduling a 30-minute demo call this week?",
          is_ai: true,
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "770e8400-e29b-41d4-a716-446655440002",
          message: "yes",
          is_ai: false,
          created_at: new Date(Date.now() - 1 * 60 * 60 * 50 * 60 * 1000).toISOString(),
        },
        {
          id: "770e8400-e29b-41d4-a716-446655440003",
          message:
            "Perfect! I'll have our sales team reach out to you within the next business day to schedule a demo. In the meantime, feel free to check out our case studies on our website.",
          is_ai: true,
          created_at: new Date(Date.now() - 1 * 60 * 60 * 45 * 60 * 1000).toISOString(),
        },
      ],
    },
    {
      id: "660e8400-e29b-41d4-a716-446655440002",
      form_id: "550e8400-e29b-41d4-a716-446655440001",
      submission_data: {
        name: "Sarah Johnson",
        email: "sarah@designstudio.com",
        company: "Creative Design Studio",
        subject: "Partnership",
        message:
          "We're a design agency and would like to explore partnership opportunities. We have several clients who could benefit from your services.",
      },
      ai_response:
        "Hi Sarah! Partnership opportunities are always exciting to explore. I'd love to learn more about Creative Design Studio and your client base. Could we schedule a brief call to discuss potential collaboration opportunities?",
      user_responded: false,
      user_response: null,
      created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      chat_interactions: [
        {
          id: "770e8400-e29b-41d4-a716-446655440004",
          message:
            "Hi Sarah! Partnership opportunities are always exciting to explore. I'd love to learn more about Creative Design Studio and your client base. Could we schedule a brief call to discuss potential collaboration opportunities?",
          is_ai: true,
          created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        },
      ],
    },
  ],
  "550e8400-e29b-41d4-a716-446655440002": [
    {
      id: "660e8400-e29b-41d4-a716-446655440003",
      form_id: "550e8400-e29b-41d4-a716-446655440002",
      submission_data: {
        email: "mike.chen@example.com",
        firstName: "Mike",
        lastName: "Chen",
        interests: true,
        frequency: "Weekly",
      },
      ai_response:
        "Welcome to our newsletter, Mike! Thanks for subscribing to weekly updates. You'll receive valuable insights about industry trends, product updates, and best practices. Are there any specific topics you're most interested in learning about?",
      user_responded: true,
      user_response: "yes",
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      chat_interactions: [
        {
          id: "770e8400-e29b-41d4-a716-446655440005",
          message:
            "Welcome to our newsletter, Mike! Thanks for subscribing to weekly updates. You'll receive valuable insights about industry trends, product updates, and best practices. Are there any specific topics you're most interested in learning about?",
          is_ai: true,
          created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "770e8400-e29b-41d4-a716-446655440006",
          message: "yes",
          is_ai: false,
          created_at: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "770e8400-e29b-41d4-a716-446655440007",
          message:
            "Great! I'd recommend focusing on AI and automation trends, as well as productivity tips. You'll find our content very valuable. Thanks for being part of our community!",
          is_ai: true,
          created_at: new Date(Date.now() - 22 * 60 * 60 * 50 * 60 * 1000).toISOString(),
        },
      ],
    },
  ],
  "550e8400-e29b-41d4-a716-446655440003": [],
  "550e8400-e29b-41d4-a716-446655440004": [
    {
      id: "660e8400-e29b-41d4-a716-446655440004",
      form_id: "550e8400-e29b-41d4-a716-446655440004",
      submission_data: {
        customerName: "Lisa Rodriguez",
        email: "lisa.r@email.com",
        rating: "Excellent",
        recommendation: "Definitely",
        feedback:
          "The platform is intuitive and the customer support team is fantastic. Really helped streamline our workflow.",
      },
      ai_response:
        "Thank you so much for the excellent feedback, Lisa! We're thrilled to hear that our platform has helped streamline your workflow and that you had a great experience with our support team. What specific features have been most valuable for your team?",
      user_responded: false,
      user_response: null,
      created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      chat_interactions: [
        {
          id: "770e8400-e29b-41d4-a716-446655440008",
          message:
            "Thank you so much for the excellent feedback, Lisa! We're thrilled to hear that our platform has helped streamline your workflow and that you had a great experience with our support team. What specific features have been most valuable for your team?",
          is_ai: true,
          created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        },
      ],
    },
  ],
}

async function getForm(id: string) {
  try {
    // Try to fetch from API first
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/forms/${id}`, {
      cache: "no-store",
    })

    if (response.ok) {
      return await response.json()
    }
  } catch (error) {
    console.log("API fetch failed, using mock data")
  }

  // Fallback to mock data
  return mockForms[id] || null
}

async function getSubmissions(formId: string) {
  try {
    // Try to fetch from API first
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/forms/${formId}/submissions`,
      {
        cache: "no-store",
      },
    )

    if (response.ok) {
      return await response.json()
    }
  } catch (error) {
    console.log("API fetch failed, using mock submissions")
  }

  // Fallback to mock data
  return mockSubmissions[formId] || []
}

export default async function FormDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const form = await getForm(id)

  if (!form) {
    notFound()
  }

  const submissions = await getSubmissions(id)

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="container mx-auto px-4 py-8">
        <FormDetails form={form} submissions={submissions} />
      </div>
    </div>
  )
}
