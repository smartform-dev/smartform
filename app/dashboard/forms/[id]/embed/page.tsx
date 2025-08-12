"use client"

import { useEffect, useState } from "react"
import { useUser, SignInButton, UserButton } from "@clerk/nextjs"
import { useRouter, useParams } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { EmbedCodeDisplay } from "@/components/embed-code-display"



export default function EmbedCodePage() {
  const { isSignedIn, isLoaded } = useUser()
  const router = useRouter()
  const params = useParams()
  const id = Array.isArray(params.id) ? params.id[0] : params.id
  const [form, setForm] = useState<any>(null)
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
