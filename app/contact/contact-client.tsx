"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { PublicNavbar } from "@/components/public/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, Phone, Globe, Linkedin, Github, MapPin, Loader2, Send, CheckCircle2 } from "lucide-react"
import { contactSchema } from "@/lib/validations"
import { submitContactForm } from "./actions"

type ContactFormData = z.infer<typeof contactSchema>

interface ContactPageClientProps {
  resumeData: {
    email: string | null
    phone: string | null
    location: string | null
    linkedin: string | null
    github: string | null
    website: string | null
  } | null
}

export function ContactPageClient({ resumeData }: ContactPageClientProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    setSubmitResult(null)

    try {
      const formData = new FormData()
      formData.append("name", data.name)
      formData.append("email", data.email)
      formData.append("subject", data.subject || "")
      formData.append("message", data.message)
      formData.append("honeypot", data.honeypot || "")

      const result = await submitContactForm(formData)

      if (result.success) {
        setSubmitResult({ success: true, message: result.message || "Message sent successfully!" })
        reset() // Reset form on success
      } else {
        setSubmitResult({ success: false, message: result.error || "Failed to send message." })
      }
    } catch (error) {
      console.error("Form submission error:", error)
      setSubmitResult({ success: false, message: "An unexpected error occurred. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <PublicNavbar />
      <div className="min-h-screen bg-muted/30">
        <div className="container mx-auto px-4 py-12 lg:py-16">
          {/* Header */}
          <div className="max-w-5xl mx-auto mb-12 text-center">
            <h1 className="text-4xl font-bold mb-4">Get In Touch</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Have a question or want to work together? I'd love to hear from you. 
              Fill out the form below and I'll get back to you as soon as possible.
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Send Me a Message</CardTitle>
                  <CardDescription>
                    Fill out the form below and I'll respond within 24-48 hours.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Success/Error Alert */}
                    {submitResult && (
                      <Alert variant={submitResult.success ? "default" : "destructive"}>
                        {submitResult.success && <CheckCircle2 className="h-4 w-4" />}
                        <AlertDescription>{submitResult.message}</AlertDescription>
                      </Alert>
                    )}

                    {/* Name Field */}
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Your full name"
                        {...register("name")}
                        disabled={isSubmitting}
                      />
                      {errors.name && (
                        <p className="text-sm text-destructive">{errors.name.message}</p>
                      )}
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        Email <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        {...register("email")}
                        disabled={isSubmitting}
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive">{errors.email.message}</p>
                      )}
                    </div>

                    {/* Subject Field (Optional) */}
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        type="text"
                        placeholder="What is this about?"
                        {...register("subject")}
                        disabled={isSubmitting}
                      />
                      {errors.subject && (
                        <p className="text-sm text-destructive">{errors.subject.message}</p>
                      )}
                    </div>

                    {/* Message Field */}
                    <div className="space-y-2">
                      <Label htmlFor="message">
                        Message <span className="text-destructive">*</span>
                      </Label>
                      <Textarea
                        id="message"
                        placeholder="Your message here..."
                        rows={6}
                        {...register("message")}
                        disabled={isSubmitting}
                      />
                      {errors.message && (
                        <p className="text-sm text-destructive">{errors.message.message}</p>
                      )}
                    </div>

                    {/* Honeypot Field - Hidden from users */}
                    <input
                      type="text"
                      {...register("honeypot")}
                      style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px" }}
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                    />

                    {/* Submit Button */}
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isSubmitting}
                      size="lg"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Contact Information */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>
                    Feel free to reach out directly through any of these channels.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {resumeData?.email && (
                    <ContactInfoItem
                      icon={<Mail className="h-5 w-5" />}
                      label="Email"
                      value={resumeData.email}
                      href={`mailto:${resumeData.email}`}
                    />
                  )}
                  
                  {resumeData?.phone && (
                    <ContactInfoItem
                      icon={<Phone className="h-5 w-5" />}
                      label="Phone"
                      value={resumeData.phone}
                      href={`tel:${resumeData.phone.replace(/\s+/g, "")}`}
                    />
                  )}
                  
                  {resumeData?.location && (
                    <ContactInfoItem
                      icon={<MapPin className="h-5 w-5" />}
                      label="Location"
                      value={resumeData.location}
                    />
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Connect Online</CardTitle>
                  <CardDescription>
                    Find me on social media and professional networks.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {resumeData?.linkedin && (
                    <ContactInfoItem
                      icon={<Linkedin className="h-5 w-5" />}
                      label="LinkedIn"
                      value={resumeData.linkedin.replace(/^https?:\/\//, "")}
                      href={resumeData.linkedin}
                      external
                    />
                  )}
                  
                  {resumeData?.github && (
                    <ContactInfoItem
                      icon={<Github className="h-5 w-5" />}
                      label="GitHub"
                      value={resumeData.github.replace(/^https?:\/\//, "")}
                      href={resumeData.github}
                      external
                    />
                  )}
                  
                  {resumeData?.website && (
                    <ContactInfoItem
                      icon={<Globe className="h-5 w-5" />}
                      label="Website"
                      value={resumeData.website.replace(/^https?:\/\//, "")}
                      href={resumeData.website}
                      external
                    />
                  )}
                </CardContent>
              </Card>

              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <div className="text-sm space-y-2">
                    <p className="font-semibold">Response Time</p>
                    <p className="text-muted-foreground">
                      I typically respond to all inquiries within 24-48 hours during business days.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function ContactInfoItem({
  icon,
  label,
  value,
  href,
  external,
}: {
  icon: React.ReactNode
  label: string
  value: string
  href?: string
  external?: boolean
}) {
  const content = (
    <div className="flex items-start gap-3 group">
      <div className="text-primary mt-0.5">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className={`text-sm ${href ? "text-primary group-hover:underline" : ""} break-words`}>
          {value}
        </p>
      </div>
    </div>
  )

  if (href) {
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
      >
        {content}
      </a>
    )
  }

  return content
}
