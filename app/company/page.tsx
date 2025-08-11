"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Building,
  Package,
  Users,
  Flag,
  Trash2,
  FileText,
  AlertTriangle,
  UploadCloud,
  Loader2,
  Edit,
} from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { useToast } from "@/components/ui/use-toast"
import CompanyLoading from "./loading"

interface CompanyFile {
  id: string
  name: string
  createdAt: string
  status: string
  size: number
}

interface Usage {
  used: number
  available: number
}

interface CompanyProfile {
  name: string
  websiteUrl: string
  businessType: string
  productDescription: string
  targetAudience: string
  mainContactGoal: string
  commonQuestions: string
  valueOffers: string
  preferredTone: string
  keywords: string
  followUpStyle: string
}

export default function CompanyPage() {
  const [files, setFiles] = useState<CompanyFile[]>([])
  const [usage, setUsage] = useState<Usage>({ used: 0, available: 10 })
  const [profile, setProfile] = useState<CompanyProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | boolean>(false)
  const [confirmText, setConfirmText] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState<CompanyProfile | null>(null)
  const { toast } = useToast()

  const fetchCompanyData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [filesRes, profileRes] = await Promise.all([
        fetch("/api/company/files"),
        fetch("/api/company/profile"),
      ]);
      if (!filesRes.ok || !profileRes.ok) throw new Error("Failed to fetch data");
      
      const filesData = await filesRes.json();
      const profileData = await profileRes.json();

      setFiles(filesData.files);
      setUsage(filesData.usage);
      setProfile(profileData);
      setEditedProfile(profileData);

    } catch (error) {
      toast({
        title: "Error",
        description: "Could not load company data.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchCompanyData()
  }, [fetchCompanyData])

  const handleFileUpload = async (selectedFiles: FileList | null) => {
    if (!selectedFiles || selectedFiles.length === 0) return

    setIsUploading(true)
    const uploadPromises = Array.from(selectedFiles).map(async (file) => {
      const formData = new FormData()
      formData.append("file", file)
      try {
        const res = await fetch("/api/company/files", {
          method: "POST",
          body: formData,
        })
        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.error || `Failed to upload ${file.name}`)
        }
        return { success: true, name: file.name }
      } catch (error: any) {
        return { success: false, name: file.name, error: error.message }
      }
    })

    const results = await Promise.all(uploadPromises)
    
    results.forEach(result => {
        if(result.success) {
            toast({ title: "Success", description: `${result.name} uploaded.` })
        } else {
            toast({ title: "Error", description: `Failed to upload ${result.name}: ${result.error}`, variant: "destructive" })
        }
    })

    setIsUploading(false)
    await fetchCompanyData()
  }

  const handleDeleteFile = async (id: string) => {
    setIsDeleting(id)
    try {
      const res = await fetch(`/api/company/files?id=${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete file")
      toast({ title: "Success", description: "File deleted." })
      await fetchCompanyData()
    } catch (error) {
      toast({ title: "Error", description: "Could not delete file.", variant: "destructive" })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteAllFiles = async () => {
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/company/files?all=true`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete all files")
      toast({ title: "Success", description: "All files have been deleted." })
      setConfirmText("")
      await fetchCompanyData()
    } catch (error) {
      toast({ title: "Error", description: "Could not delete all files.", variant: "destructive" })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (editedProfile) {
      setEditedProfile({ ...editedProfile, [e.target.name]: e.target.value });
    }
  };

  const handleSaveChanges = async () => {
    if (!editedProfile) return;
    setIsEditing(true);
    try {
      const res = await fetch("/api/company", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedProfile),
      });
      if (!res.ok) throw new Error("Failed to save changes");
      toast({ title: "Success", description: "Company profile updated." });
      await fetchCompanyData();
    } catch (error) {
      toast({ title: "Error", description: "Could not save changes.", variant: "destructive" });
    } finally {
      setIsEditing(false);
    }
  };

  const percentUsed = Math.min(100, ((usage?.used ?? 0) / (usage?.available ?? 1)) * 100)

  if (isLoading) {
    return <CompanyLoading />;
  }

  return (
    <>
      <DashboardHeader />
      <div className="container mx-auto px-4 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Left Column: Company Details */}
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building className="h-6 w-6" />
                  <CardTitle>Company Profile</CardTitle>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Edit Company Profile</DialogTitle>
                      <DialogDescription>
                        Make changes to your company profile here. Click save when you're done.
                      </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="h-96 p-4">
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">Name</Label>
                          <Input id="name" name="name" value={editedProfile?.name || ""} onChange={handleProfileChange} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="websiteUrl" className="text-right">Website</Label>
                          <Input id="websiteUrl" name="websiteUrl" value={editedProfile?.websiteUrl || ""} onChange={handleProfileChange} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="businessType" className="text-right">Business Type</Label>
                          <Input id="businessType" name="businessType" value={editedProfile?.businessType || ""} onChange={handleProfileChange} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="productDescription" className="text-right">Product Description</Label>
                          <Textarea id="productDescription" name="productDescription" value={editedProfile?.productDescription || ""} onChange={handleProfileChange} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="targetAudience" className="text-right">Target Audience</Label>
                          <Input id="targetAudience" name="targetAudience" value={editedProfile?.targetAudience || ""} onChange={handleProfileChange} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="mainContactGoal" className="text-right">Main Contact Goal</Label>
                          <Input id="mainContactGoal" name="mainContactGoal" value={editedProfile?.mainContactGoal || ""} onChange={handleProfileChange} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="commonQuestions" className="text-right">Common Questions</Label>
                          <Textarea id="commonQuestions" name="commonQuestions" value={editedProfile?.commonQuestions || ""} onChange={handleProfileChange} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="valueOffers" className="text-right">Value/Offers</Label>
                          <Textarea id="valueOffers" name="valueOffers" value={editedProfile?.valueOffers || ""} onChange={handleProfileChange} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="preferredTone" className="text-right">Preferred Tone</Label>
                          <Input id="preferredTone" name="preferredTone" value={editedProfile?.preferredTone || ""} onChange={handleProfileChange} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="keywords" className="text-right">Keywords</Label>
                          <Input id="keywords" name="keywords" value={editedProfile?.keywords || ""} onChange={handleProfileChange} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="followUpStyle" className="text-right">Follow-up Style</Label>
                          <Input id="followUpStyle" name="followUpStyle" value={editedProfile?.followUpStyle || ""} onChange={handleProfileChange} className="col-span-3" />
                        </div>
                      </div>
                    </ScrollArea>
                    <DialogFooter>
                      <Button onClick={handleSaveChanges} disabled={isEditing}>
                        {isEditing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Changes"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{profile?.name ?? "..."}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <a href={profile?.websiteUrl} target="_blank" rel="noreferrer">{profile?.websiteUrl}</a>
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold flex items-center gap-2">
                    <Package className="h-5 w-5" /> Business Type
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {profile?.businessType ?? "..."}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Data Management */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Usage</CardTitle>
                <CardDescription>
                  Manage your uploaded data to keep the AI sharp.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Progress value={percentUsed} className="w-full" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>
                      {(usage?.used ?? 0).toFixed(2)} MB / {(usage?.available ?? 10)} MB used
                    </span>
                    <span>{percentUsed.toFixed(0)}%</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <label className="relative">
                  <input
                    type="file"
                    multiple
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept=".txt,.docx,.md,.pdf,.csv"
                    onChange={(e) => handleFileUpload(e.target.files)}
                    disabled={isUploading}
                  />
                  <Button disabled={isUploading}>
                    {isUploading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <UploadCloud className="mr-2 h-4 w-4" />
                    )}
                    Upload Files
                  </Button>
                </label>
                 <p className="text-xs text-muted-foreground ml-4">
                    Allowed: .txt, .docx, .md, .pdf, .csv
                </p>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Uploaded Files</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-72 w-full pr-4">
                  {(files ?? []).length === 0 ? (
                    <p className="text-muted-foreground text-center">No files uploaded yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {(files ?? []).map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50"
                        >
                          <div className="flex items-center gap-4">
                            <FileText className="h-6 w-6 text-primary" />
                            <div>
                              <p className="font-medium">{file.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(file.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <Badge
                              variant={
                                file.status === "INDEXED" ? "default" : "outline"
                              }
                            >
                              {file.status.replace("_", " ")}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteFile(file.id)}
                              disabled={!!isDeleting}
                            >
                              {isDeleting === file.id ? <Loader2 className="h-4 w-4 animate-spin"/> : <Trash2 className="h-4 w-4 text-destructive" />}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
              <CardFooter className="flex justify-end border-t pt-6">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={(files ?? []).length === 0 || !!isDeleting}>
                      <AlertTriangle className="mr-2 h-4 w-4" /> Remove All Data
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete all
                        your uploaded data. Please type{" "}
                        <strong className="text-foreground">confirm</strong> to proceed.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <Input
                      id="confirm-text"
                      value={confirmText}
                      onChange={(e) => setConfirmText(e.target.value)}
                      placeholder="confirm"
                      className="my-4"
                    />
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setConfirmText("")}>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        disabled={confirmText.toLowerCase() !== "confirm" || isDeleting === true}
                        onClick={handleDeleteAllFiles}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        {isDeleting === true && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Delete All Data
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}

