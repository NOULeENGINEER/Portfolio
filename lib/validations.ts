import { z } from "zod"

export const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  shortSummary: z.string().optional(),
  longDescription: z.string().optional(),
  status: z.enum(["Draft", "Published", "Archived"]),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  role: z.string().optional(),
  organization: z.string().optional(),
  techTags: z.array(z.string()).optional(),
  skillTags: z.array(z.string()).optional(),
  githubUrl: z.string().url().optional().or(z.literal("")),
  demoUrl: z.string().url().optional().or(z.literal("")),
  blogUrl: z.string().url().optional().or(z.literal("")),
  featured: z.boolean().optional(),
  visibility: z.enum(["public", "private"]).optional(),
})

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  subject: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
  honeypot: z.string().max(0).optional(),
})

export const resumeSchema = z.object({
  name: z.string().min(1),
  headline: z.string().optional(),
  location: z.string().optional(),
  summary: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  linkedin: z.string().url().optional().or(z.literal("")),
  github: z.string().url().optional().or(z.literal("")),
  twitter: z.string().url().optional().or(z.literal("")),
  skills: z.string().optional(),
  languages: z.string().optional(),
  experience: z.string().optional(),
  education: z.string().optional(),
  certifications: z.string().optional(),
})

export const fileUploadSchema = z.object({
  name: z.string(),
  type: z.string(),
  size: z.number().max(26214400, "File size must be less than 25MB"),
})

export const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
  "image/webp",
  "text/plain",
  "text/markdown",
  "text/csv",
  "application/zip",
]
