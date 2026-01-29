"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { resumeSchema } from "@/lib/validations"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Save, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { updateResume, FormState } from "./actions"

type ResumeFormData = z.infer<typeof resumeSchema>

export default function ResumeEditorPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ResumeFormData>({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      name: "",
      headline: "",
      location: "",
      summary: "",
      email: "",
      phone: "",
      website: "",
      linkedin: "",
      github: "",
      twitter: "",
      skills: "",
      languages: "",
      experience: "",
      education: "",
      certifications: "",
    },
  })

  // Fetch resume data
  useEffect(() => {
    async function fetchResume() {
      try {
        const response = await fetch("/api/resume/default")
        if (response.ok) {
          const data = await response.json()
          // Set form values
          Object.keys(data).forEach((key) => {
            if (key !== "id" && key !== "updatedAt") {
              setValue(key as keyof ResumeFormData, data[key] || "")
            }
          })
        }
      } catch (error) {
        console.error("Error fetching resume:", error)
        toast.error("Failed to load resume data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchResume()
  }, [setValue])

  const onSubmit = async (data: ResumeFormData) => {
    setIsSubmitting(true)
    setFormError(null)

    try {
      const result: FormState = await updateResume(data)

      if (result.success) {
        toast.success(result.message)
      } else {
        setFormError(result.message)
        toast.error(result.message)
      }
    } catch (error) {
      setFormError("An unexpected error occurred")
      toast.error("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const validateJSON = (value: string | undefined) => {
    if (!value || value.trim() === "") return true
    try {
      JSON.parse(value)
      return true
    } catch {
      return "Invalid JSON format"
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Resume Editor</h1>
        <p className="text-muted-foreground mt-2">
          Manage your resume information across different sections
        </p>
      </div>

      {formError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="languages">Languages</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Basic information about yourself
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    {...register("name")}
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="headline">Headline</Label>
                  <Input
                    id="headline"
                    {...register("headline")}
                    placeholder="Senior Software Engineer"
                  />
                  {errors.headline && (
                    <p className="text-sm text-destructive">{errors.headline.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    {...register("location")}
                    placeholder="San Francisco, CA"
                  />
                  {errors.location && (
                    <p className="text-sm text-destructive">{errors.location.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="summary">Summary</Label>
                  <Textarea
                    id="summary"
                    {...register("summary")}
                    placeholder="A brief summary about yourself..."
                    rows={6}
                  />
                  {errors.summary && (
                    <p className="text-sm text-destructive">{errors.summary.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  How people can reach you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    {...register("phone")}
                    placeholder="+1 (555) 123-4567"
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive">{errors.phone.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    {...register("website")}
                    placeholder="https://example.com"
                  />
                  {errors.website && (
                    <p className="text-sm text-destructive">{errors.website.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    type="url"
                    {...register("linkedin")}
                    placeholder="https://linkedin.com/in/username"
                  />
                  {errors.linkedin && (
                    <p className="text-sm text-destructive">{errors.linkedin.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="github">GitHub</Label>
                  <Input
                    id="github"
                    type="url"
                    {...register("github")}
                    placeholder="https://github.com/username"
                  />
                  {errors.github && (
                    <p className="text-sm text-destructive">{errors.github.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    type="url"
                    {...register("twitter")}
                    placeholder="https://twitter.com/username"
                  />
                  {errors.twitter && (
                    <p className="text-sm text-destructive">{errors.twitter.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills">
            <Card>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
                <CardDescription>
                  JSON array of your skills. Example: ["JavaScript", "React", "Node.js"]
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="skills">Skills (JSON)</Label>
                  <Textarea
                    id="skills"
                    {...register("skills", {
                      validate: validateJSON,
                    })}
                    placeholder='["JavaScript", "TypeScript", "React", "Node.js"]'
                    rows={10}
                    className="font-mono text-sm"
                  />
                  {errors.skills && (
                    <p className="text-sm text-destructive">{errors.skills.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Enter a valid JSON array of strings
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Languages Tab */}
          <TabsContent value="languages">
            <Card>
              <CardHeader>
                <CardTitle>Languages</CardTitle>
                <CardDescription>
                  JSON array of languages with proficiency levels. Example: {`[{"name": "English", "level": "Native"}]`}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="languages">Languages (JSON)</Label>
                  <Textarea
                    id="languages"
                    {...register("languages", {
                      validate: validateJSON,
                    })}
                    placeholder='[{"name": "English", "level": "Native"}, {"name": "Spanish", "level": "Professional"}]'
                    rows={10}
                    className="font-mono text-sm"
                  />
                  {errors.languages && (
                    <p className="text-sm text-destructive">{errors.languages.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Enter a valid JSON array of objects with "name" and "level" properties
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Experience Tab */}
          <TabsContent value="experience">
            <Card>
              <CardHeader>
                <CardTitle>Work Experience</CardTitle>
                <CardDescription>
                  JSON array of your work experience. Include company, position, startDate, endDate, and description.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience (JSON)</Label>
                  <Textarea
                    id="experience"
                    {...register("experience", {
                      validate: validateJSON,
                    })}
                    placeholder='[{"company": "Tech Corp", "position": "Senior Developer", "startDate": "2020-01", "endDate": "Present", "description": "Led development..."}]'
                    rows={15}
                    className="font-mono text-sm"
                  />
                  {errors.experience && (
                    <p className="text-sm text-destructive">{errors.experience.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Enter a valid JSON array of work experience objects
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Education Tab */}
          <TabsContent value="education">
            <Card>
              <CardHeader>
                <CardTitle>Education & Certifications</CardTitle>
                <CardDescription>
                  Manage your educational background and professional certifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="education">Education (JSON)</Label>
                  <Textarea
                    id="education"
                    {...register("education", {
                      validate: validateJSON,
                    })}
                    placeholder='[{"institution": "University", "degree": "BS Computer Science", "startDate": "2015", "endDate": "2019"}]'
                    rows={10}
                    className="font-mono text-sm"
                  />
                  {errors.education && (
                    <p className="text-sm text-destructive">{errors.education.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Enter a valid JSON array of education objects
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="certifications">Certifications (JSON)</Label>
                  <Textarea
                    id="certifications"
                    {...register("certifications", {
                      validate: validateJSON,
                    })}
                    placeholder='[{"name": "AWS Certified Developer", "issuer": "Amazon", "date": "2022"}]'
                    rows={10}
                    className="font-mono text-sm"
                  />
                  {errors.certifications && (
                    <p className="text-sm text-destructive">{errors.certifications.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Enter a valid JSON array of certification objects
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end">
          <Button type="submit" disabled={isSubmitting} size="lg">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Resume
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
