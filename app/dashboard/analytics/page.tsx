"use client"

import { useEffect, useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, FormInput, MessageSquare, TrendingUp, Loader2 } from "lucide-react"

interface Stats {
  total_forms: number
  total_submissions: number
  ai_interactions: number
  user_responses: number
}

interface Submission {
  title: string
  created_at: string
  has_ai_response: boolean
}

interface TopForm {
  title: string
  submission_count: number
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Stats>({
    total_forms: 0,
    total_submissions: 0,
    ai_interactions: 0,
    user_responses: 0,
  })
  const [recentSubmissions, setRecentSubmissions] = useState<Submission[]>([])
  const [topForms, setTopForms] = useState<TopForm[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/analytics")
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
        setRecentSubmissions(data.recentSubmissions)
        setTopForms(data.topForms)
      }
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading analytics...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-2">Track your form performance and AI interactions</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Forms</CardTitle>
              <FormInput className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_forms}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_submissions}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Interactions</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.ai_interactions}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">User Responses</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.user_responses}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              {recentSubmissions.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No submissions yet</p>
              ) : (
                <div className="space-y-3">
                  {recentSubmissions.map((submission, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                      <div>
                        <p className="font-medium">{submission.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(submission.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      {submission.has_ai_response && (
                        <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">AI Response</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Performing Forms</CardTitle>
            </CardHeader>
            <CardContent>
              {topForms.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No forms created yet</p>
              ) : (
                <div className="space-y-3">
                  {topForms.map((form, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                      <p className="font-medium">{form.title}</p>
                      <div className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
                        {form.submission_count} submissions
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
