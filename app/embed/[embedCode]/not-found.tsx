import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export default function EmbedNotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <CardTitle>Form Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">This form doesn't exist or is no longer available.</p>
        </CardContent>
      </Card>
    </div>
  )
}
