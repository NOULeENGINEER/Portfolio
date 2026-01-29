"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { projectSchema } from "@/lib/validations"
import { z } from "zod"

export type FormState = {
  success: boolean
  message: string
  errors?: Record<string, string[]>
}

export async function createProject(data: z.infer<typeof projectSchema>): Promise<FormState> {
  try {
    const validated = projectSchema.parse(data)

    const existing = await prisma.project.findUnique({
      where: { slug: validated.slug },
    })

    if (existing) {
      return {
        success: false,
        message: "A project with this slug already exists",
        errors: { slug: ["Slug already exists"] },
      }
    }

    await prisma.project.create({
      data: {
        title: validated.title,
        slug: validated.slug,
        shortSummary: validated.shortSummary || null,
        longDescription: validated.longDescription || null,
        status: validated.status,
        startDate: validated.startDate ? new Date(validated.startDate) : null,
        endDate: validated.endDate ? new Date(validated.endDate) : null,
        role: validated.role || null,
        organization: validated.organization || null,
        techTags: validated.techTags ? JSON.stringify(validated.techTags) : null,
        skillTags: validated.skillTags ? JSON.stringify(validated.skillTags) : null,
        githubUrl: validated.githubUrl || null,
        demoUrl: validated.demoUrl || null,
        blogUrl: validated.blogUrl || null,
        featured: validated.featured || false,
        visibility: validated.visibility || "public",
      },
    })

    revalidatePath("/admin/projects")
    redirect("/admin/projects")
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Validation failed",
        errors: error.flatten().fieldErrors as Record<string, string[]>,
      }
    }
    
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error
    }

    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to create project",
    }
  }
}

export async function updateProject(
  id: string,
  data: z.infer<typeof projectSchema>
): Promise<FormState> {
  try {
    const validated = projectSchema.parse(data)

    const existing = await prisma.project.findFirst({
      where: {
        slug: validated.slug,
        NOT: { id },
      },
    })

    if (existing) {
      return {
        success: false,
        message: "A project with this slug already exists",
        errors: { slug: ["Slug already exists"] },
      }
    }

    await prisma.project.update({
      where: { id },
      data: {
        title: validated.title,
        slug: validated.slug,
        shortSummary: validated.shortSummary || null,
        longDescription: validated.longDescription || null,
        status: validated.status,
        startDate: validated.startDate ? new Date(validated.startDate) : null,
        endDate: validated.endDate ? new Date(validated.endDate) : null,
        role: validated.role || null,
        organization: validated.organization || null,
        techTags: validated.techTags ? JSON.stringify(validated.techTags) : null,
        skillTags: validated.skillTags ? JSON.stringify(validated.skillTags) : null,
        githubUrl: validated.githubUrl || null,
        demoUrl: validated.demoUrl || null,
        blogUrl: validated.blogUrl || null,
        featured: validated.featured || false,
        visibility: validated.visibility || "public",
      },
    })

    revalidatePath("/admin/projects")
    revalidatePath(`/admin/projects/${id}`)
    redirect("/admin/projects")
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Validation failed",
        errors: error.flatten().fieldErrors as Record<string, string[]>,
      }
    }
    
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error
    }

    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update project",
    }
  }
}

export async function deleteProject(id: string): Promise<FormState> {
  try {
    await prisma.project.delete({
      where: { id },
    })

    revalidatePath("/admin/projects")
    
    return {
      success: true,
      message: "Project deleted successfully",
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete project",
    }
  }
}

export async function deleteAttachment(id: string): Promise<FormState> {
  try {
    const attachment = await prisma.attachment.findUnique({
      where: { id },
      select: { projectId: true },
    })

    if (!attachment) {
      return {
        success: false,
        message: "Attachment not found",
      }
    }

    await prisma.attachment.delete({
      where: { id },
    })

    revalidatePath(`/admin/projects/${attachment.projectId}`)
    
    return {
      success: true,
      message: "Attachment deleted successfully",
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete attachment",
    }
  }
}
