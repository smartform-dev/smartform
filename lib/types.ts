export interface FormField {
  id: string
  type: "text" | "email" | "textarea" | "select" | "radio" | "checkbox"
  label: string
  placeholder?: string
  required: boolean
  options?: string[]
}

export interface FormStyling {
  primaryColor: string
  backgroundColor: string
  textColor: string
  borderRadius: string
  fontSize: string
  fontFamily: string
  darkMode: boolean
}

export interface Form {
  id: string
  userId: string
  title: string
  description?: string
  fields: FormField[]
  styling: FormStyling
  aiPrompt?: string
  aiEnabled: boolean
  isPublished: boolean
  embedCode: string
  createdAt: string
  updatedAt: string
}

export interface FormSubmission {
  id: string
  formId: string
  submissionData: Record<string, any>
  aiResponse?: string
  userResponded: boolean
  userResponse?: "yes" | "no"
  ipAddress?: string
  userAgent?: string
  createdAt: string
}

export interface ChatInteraction {
  id: string
  submissionId: string
  message: string
  isAi: boolean
  createdAt: string
}
