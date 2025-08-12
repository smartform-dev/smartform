import { notFound } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { FormEditor } from "@/components/form-editor"



async function getForm(id: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/forms/${id}`, {
      cache: "no-store",
    });

    if (response.ok) {
      const form = await response.json();
      // Transform database format to component format
      return {
        id: form.id,
        userId: form.user_id,
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
      };
    }
  } catch (error) {
    console.log("API fetch failed", error);
  }

  return null;
}

export default async function EditFormPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const form = await getForm(id);

  if (!form) {
    notFound();
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
  );
}
