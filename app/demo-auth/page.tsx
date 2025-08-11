import { redirect } from "next/navigation"

export default function DemoAuthPage() {
  // Redirect to dashboard since we removed demo auth
  redirect("/dashboard")
}
