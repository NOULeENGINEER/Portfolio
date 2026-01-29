"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { resumeSchema } from "@/lib/validations"
import { z } from "zod"

export type FormState = {
  success: boolean
  message: string
  errors?: Record<string, string[]>
}

export async function updateResume(data: z.infer<typeof resumeSchema>): Promise<FormState> {
  try {
    const validated = resumeSchema.parse(data)

    // Update or create the default resume
    await prisma.resume.upsert({
      where: { id: "default" },
      update: {
        name: validated.name,
        headline: validated.headline || null,
        location: validated.location || null,
        summary: validated.summary || null,
        email: validated.email || null,
        phone: validated.phone || null,
        website: validated.website || null,
        linkedin: validated.linkedin || null,
        github: validated.github || null,
        twitter: validated.twitter || null,
        skills: validated.skills || null,
        languages: validated.languages || null,
        experience: validated.experience || null,
        education: validated.education || null,
        certifications: validated.certifications || null,
      },
      create: {
        id: "default",
        name: validated.name,
        headline: validated.headline || null,
        location: validated.location || null,
        summary: validated.summary || null,
        email: validated.email || null,
        phone: validated.phone || null,
        website: validated.website || null,
        linkedin: validated.linkedin || null,
        github: validated.github || null,
        twitter: validated.twitter || null,
        skills: validated.skills || null,
        languages: validated.languages || null,
        experience: validated.experience || null,
        education: validated.education || null,
        certifications: validated.certifications || null,
      },
    })

    revalidatePath("/admin/resume")
    revalidatePath("/")

    return {
      success: true,
      message: "Resume updated successfully",
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Validation failed",
        errors: error.flatten().fieldErrors as Record<string, string[]>,
      }
    }

    console.error("Error updating resume:", error)
    return {
      success: false,
      message: "Failed to update resume",
    }
  }
}
