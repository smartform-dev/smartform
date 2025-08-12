import { notFound } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { FormDetails } from "@/components/form-details"





async function getForm(id: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/forms/${id}`, {
      cache: "no-store",
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.log("API fetch failed", error);
  }

  return null;
}

async function getSubmissions(formId: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/forms/${formId}/submissions`,
      {
        cache: "no-store",
      },
    );

    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.log("API fetch failed", error);
  }

  return [];
}

export default async function FormDetailsPage({ params }: { params: { id: string } }) {
  const { id } = params
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
