"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { FormBuilder } from "@/components/form-builder"

export default function NewFormPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Create New Form</h1>
          <p className="text-muted-foreground mt-2">
            Build your AI-powered contact form with our drag-and-drop builder
          </p>
        </div>
        <FormBuilder />
      </div>
    </div>
  )
}
