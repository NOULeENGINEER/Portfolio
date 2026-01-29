"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { projectSchema } from "@/lib/validations"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { X, Plus, AlertCircle } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { FormState } from "./actions"

type ProjectFormData = z.infer<typeof projectSchema>

interface ProjectFormProps {
  initialData?: Partial<ProjectFormData>
  onSubmit: (data: ProjectFormData) => Promise<FormState>
  submitLabel: string
}

export function ProjectForm({ initialData, onSubmit, submitLabel }: ProjectFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [techTagInput, setTechTagInput] = useState("")
  const [skillTagInput, setSkillTagInput] = useState("")
  const [markdownTab, setMarkdownTab] = useState<"write" | "preview">("write")

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      shortSummary: initialData?.shortSummary || "",
      longDescription: initialData?.longDescription || "",
      status: initialData?.status || "Draft",
      startDate: initialData?.startDate || "",
      endDate: initialData?.endDate || "",
      role: initialData?.role || "",
      organization: initialData?.organization || "",
      techTags: initialData?.techTags || [],
      skillTags: initialData?.skillTags || [],
      githubUrl: initialData?.githubUrl || "",
      demoUrl: initialData?.demoUrl || "",
      blogUrl: initialData?.blogUrl || "",
      featured: initialData?.featured || false,
      visibility: initialData?.visibility || "public",
    },
  })

  const title = watch("title")
  const longDescription = watch("longDescription")
  const techTags = watch("techTags") || []
  const skillTags = watch("skillTags") || []
  const featured = watch("featured")

  useEffect(() => {
    if (!initialData?.slug && title) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim()
      setValue("slug", slug)
    }
  }, [title, initialData?.slug, setValue])

  const handleFormSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true)
    setFormError(null)
    
    try {
      const result = await onSubmit(data)
      if (!result.success) {
        setFormError(result.message)
      }
    } catch (error) {
      if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
        setFormError("An unexpected error occurred")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const addTechTag = () => {
    if (techTagInput.trim() && !techTags.includes(techTagInput.trim())) {
      setValue("techTags", [...techTags, techTagInput.trim()])
      setTechTagInput("")
    }
  }

  const removeTechTag = (tag: string) => {
    setValue("techTags", techTags.filter((t) => t !== tag))
  }

  const addSkillTag = () => {
    if (skillTagInput.trim() && !skillTags.includes(skillTagInput.trim())) {
      setValue("skillTags", [...skillTags, skillTagInput.trim()])
      setSkillTagInput("")
    }
  }

  const removeSkillTag = (tag: string) => {
    setValue("skillTags", skillTags.filter((t) => t !== tag))
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {formError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="My Awesome Project"
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                {...register("slug")}
                placeholder="my-awesome-project"
                className="font-mono"
              />
              {errors.slug && (
                <p className="text-sm text-destructive">{errors.slug.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="shortSummary">Short Summary</Label>
            <Textarea
              id="shortSummary"
              {...register("shortSummary")}
              placeholder="A brief description of your project..."
              rows={2}
            />
            {errors.shortSummary && (
              <p className="text-sm text-destructive">{errors.shortSummary.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="longDescription">Long Description (Markdown)</Label>
            <Tabs value={markdownTab} onValueChange={(v) => setMarkdownTab(v as "write" | "preview")}>
              <TabsList>
                <TabsTrigger value="write">Write</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              <TabsContent value="write" className="mt-2">
                <Textarea
                  id="longDescription"
                  {...register("longDescription")}
                  placeholder="# Project Details

Write your detailed project description using Markdown...

## Features
- Feature 1
- Feature 2

## Technical Details
More details here..."
                  rows={15}
                  className="font-mono text-sm"
                />
              </TabsContent>
              <TabsContent value="preview" className="mt-2">
                <div className="border rounded-md p-4 min-h-[300px] prose dark:prose-invert max-w-none">
                  {longDescription ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {longDescription}
                    </ReactMarkdown>
                  ) : (
                    <p className="text-muted-foreground">Nothing to preview</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
            {errors.longDescription && (
              <p className="text-sm text-destructive">{errors.longDescription.message}</p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={watch("status")}
                onValueChange={(value) => setValue("status", value as "Draft" | "Published" | "Archived")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Published">Published</SelectItem>
                  <SelectItem value="Archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-destructive">{errors.status.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="visibility">Visibility</Label>
              <Select
                value={watch("visibility")}
                onValueChange={(value) => setValue("visibility", value as "public" | "private")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="featured" className="flex items-center gap-2">
                Featured
              </Label>
              <div className="flex items-center h-10 px-3 border rounded-md">
                <input
                  type="checkbox"
                  id="featured"
                  {...register("featured")}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <label htmlFor="featured" className="ml-2 text-sm">
                  {featured ? "⭐ Featured" : "Not featured"}
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="role">Your Role</Label>
              <Input
                id="role"
                {...register("role")}
                placeholder="Lead Developer"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="organization">Organization</Label>
              <Input
                id="organization"
                {...register("organization")}
                placeholder="Company Name"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                {...register("startDate")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                {...register("endDate")}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tags</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="techTags">Technology Tags</Label>
            <div className="flex gap-2">
              <Input
                id="techTags"
                value={techTagInput}
                onChange={(e) => setTechTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addTechTag()
                  }
                }}
                placeholder="React, TypeScript, Node.js..."
              />
              <Button type="button" onClick={addTechTag} variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {techTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {techTags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTechTag(tag)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="skillTags">Skill Tags</Label>
            <div className="flex gap-2">
              <Input
                id="skillTags"
                value={skillTagInput}
                onChange={(e) => setSkillTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addSkillTag()
                  }
                }}
                placeholder="Frontend, Backend, DevOps..."
              />
              <Button type="button" onClick={addSkillTag} variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {skillTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {skillTags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeSkillTag(tag)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="githubUrl">GitHub URL</Label>
            <Input
              id="githubUrl"
              {...register("githubUrl")}
              placeholder="https://github.com/username/repo"
              type="url"
            />
            {errors.githubUrl && (
              <p className="text-sm text-destructive">{errors.githubUrl.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="demoUrl">Demo URL</Label>
            <Input
              id="demoUrl"
              {...register("demoUrl")}
              placeholder="https://demo.example.com"
              type="url"
            />
            {errors.demoUrl && (
              <p className="text-sm text-destructive">{errors.demoUrl.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="blogUrl">Blog/Article URL</Label>
            <Input
              id="blogUrl"
              {...register("blogUrl")}
              placeholder="https://blog.example.com/my-project"
              type="url"
            />
            {errors.blogUrl && (
              <p className="text-sm text-destructive">{errors.blogUrl.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting} size="lg">
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
        <Button type="button" variant="outline" size="lg" onClick={() => window.history.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
