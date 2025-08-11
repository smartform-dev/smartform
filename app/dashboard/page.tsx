"use client"

import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, FormInput, Eye, Code, Loader2, AlertCircle, Database, CheckCircle, Building } from "lucide-react"
import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard-header"
import { useOnboardingCheck } from "@/hooks/useOnboardingCheck"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useRouter, useSearchParams } from "next/navigation"

interface Form {
  id: string
  title: string
  description?: string
  is_published: boolean
  created_at: string
  embed_code: string
  submission_count: number
}

export default function DashboardPage() {
  const { status: onboardingStatus, recheck: recheckOnboarding } = useOnboardingCheck();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();
  const [forms, setForms] = useState<Form[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [usingMockData, setUsingMockData] = useState(false)
  const [dbStatus, setDbStatus] = useState<"checking" | "connected" | "disconnected">("checking")

  useEffect(() => {
    if (searchParams.get("onboardingComplete")) {
      recheckOnboarding();
    }
  }, [searchParams, recheckOnboarding]);

  useEffect(() => {
    const syncUser = async () => {
      if (user) {
        try {
          await fetch("/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              external_id: user.id,
              email: user.primaryEmailAddress?.emailAddress,
              first_name: user.firstName,
              last_name: user.lastName,
              image_url: user.imageUrl,
            }),
          });
        } catch (error) {
          console.error("Error syncing user:", error);
        }
      }
    };

    syncUser();
  }, [user]);

  useEffect(() => {
    if (onboardingStatus === "onboarded") {
      checkDatabaseStatus()
      fetchForms()
    } else if (onboardingStatus === "loading") {
      setLoading(true)
    } else {
      setLoading(false)
    }
  }, [onboardingStatus])

  const handleCreateCompany = async () => {
    router.push('/onboarding');
  };

  const checkDatabaseStatus = async () => {
    try {
      const hasDbUrl = process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== ""
      if (!hasDbUrl) {
        setDbStatus("disconnected")
        return
      }
      const response = await fetch("/api/forms", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
      if (response.ok) {
        const data = await response.json()
        const hasMockIds = data.some((form: any) => form.id.startsWith("550e8400"))
        setDbStatus(hasMockIds ? "disconnected" : "connected")
      } else {
        setDbStatus("disconnected")
      }
    } catch (error) {
      console.error("Database status check failed:", error)
      setDbStatus("disconnected")
    }
  }

  const fetchForms = async () => {
    try {
      setError(null)
      setLoading(true)
      const response = await fetch("/api/forms", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      const data = await response.json()
      if (Array.isArray(data)) {
        setForms(data)
        const hasMockIds = data.some((form) => form.id.startsWith("550e8400"))
        setUsingMockData(hasMockIds)
      } else {
        throw new Error("Invalid data format received")
      }
    } catch (error) {
      console.error("Error fetching forms:", error)
      setError(error instanceof Error ? error.message : "Failed to load forms")
      setForms([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <Card className="max-w-md w-full">
            <CardContent className="flex flex-col items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Loading dashboard...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (onboardingStatus === "needs_company") {
    return (
      <Dialog open={true}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Welcome!</DialogTitle>
            <DialogDescription>
              To get started, you need to create a company profile. This will help us tailor our services for you.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={handleCreateCompany} className="mt-4">
            <Building className="h-4 w-4 mr-2" />
            Create Company Profile
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Welcome to SmartForm!</h1>
            <p className="text-muted-foreground mt-2">Create and manage your AI-powered contact forms</p>
          </div>
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link href="/dashboard/forms/new">
              <Plus className="h-4 w-4 mr-2" />
              Create Form
            </Link>
          </Button>
        </div>

        {error && (
          <Card className="mb-6 border-destructive">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <p className="text-destructive font-medium">Error loading forms</p>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{error}</p>
              <div className="flex gap-2">
                <Button onClick={fetchForms} variant="outline" size="sm">
                  Try Again
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href="/dashboard/forms/new">Create New Form</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {forms.length === 0 && !error ? (
          <Card className="text-center py-16">
            <CardContent>
              <FormInput className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <CardTitle className="mb-2">No forms yet</CardTitle>
              <CardDescription className="mb-6">Create your first AI-powered form to get started</CardDescription>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href="/dashboard/forms/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Form
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forms.map((form) => (
              <Card key={form.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">{form.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{form.description || "No description"}</CardDescription>
                    </div>
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        form.is_published
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      }`}
                    >
                      {form.is_published ? "Published" : "Draft"}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <span>{form.submission_count || 0} submissions</span>
                    <span>{new Date(form.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <Link href={`/dashboard/forms/${form.id}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <Link href={`/dashboard/forms/${form.id}/edit`}>
                        <FormInput className="h-4 w-4 mr-1" />
                        Edit
                      </Link>
                    </Button>
                    {form.is_published && (
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/dashboard/forms/${form.id}/embed`}>
                          <Code className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {dbStatus === "disconnected" && (
          <Card className="mt-8 border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Connect Your Database
              </CardTitle>
              <CardDescription>
                To store real data and enable full functionality, connect a database using these steps:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">1. Add Neon Integration</h4>
                    <p className="text-sm text-muted-foreground">
                      Click the "Add Integration" button and select Neon to create a PostgreSQL database.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">2. Set Environment Variables</h4>
                    <p className="text-sm text-muted-foreground">
                      Add your DATABASE_URL and other required environment variables.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">3. Run Database Scripts</h4>
                    <p className="text-sm text-muted-foreground">
                      Execute the schema and seed scripts to set up your database tables.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">4. Restart Application</h4>
                    <p className="text-sm text-muted-foreground">
                      Restart your development server to connect to the new database.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

