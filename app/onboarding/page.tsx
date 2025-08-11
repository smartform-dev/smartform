"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import AnimatedLogo from "@/components/ui/animated-logo"

export default function OnboardingPage() {
  const router = useRouter()
  const [company, setCompany] = useState({
    name: "",
    websiteUrl: "",
    businessType: "",
  })
  const [isSaving, setIsSaving] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompany({ ...company, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const res = await fetch("/api/company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(company),
      })
      if (res.ok) {
        router.push("/dashboard?onboardingComplete=true")
      }
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="text-center mb-8">
        <AnimatedLogo />
      </div>
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Tell us about your company</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Company Name *</Label>
              <Input id="name" name="name" value={company.name} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="websiteUrl">Website URL *</Label>
              <Input id="websiteUrl" name="websiteUrl" value={company.websiteUrl} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="businessType">Business Type</Label>
              <Input id="businessType" name="businessType" value={company.businessType} onChange={handleChange} />
            </div>
            <Button type="submit" disabled={isSaving} className="w-full mt-4">
              {isSaving ? "Saving..." : "Save & Continue"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
