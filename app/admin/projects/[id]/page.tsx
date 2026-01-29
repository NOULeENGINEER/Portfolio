import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { prisma } from "@/lib/prisma"
import { ProjectForm } from "../project-form"
import { updateProject } from "../actions"
import { AttachmentsList } from "./attachments-list"
import { FileUpload } from "@/components/admin/file-upload"

export const dynamic = "force-dynamic"

interface EditProjectPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params
  
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      attachments: {
        orderBy: { uploadedAt: "desc" },
      },
    },
  })

  if (!project) {
    notFound()
  }

  const formData = {
    title: project.title,
    slug: project.slug,
    shortSummary: project.shortSummary || "",
    longDescription: project.longDescription || "",
    status: project.status as "Draft" | "Published" | "Archived",
    startDate: project.startDate ? project.startDate.toISOString().split("T")[0] : "",
    endDate: project.endDate ? project.endDate.toISOString().split("T")[0] : "",
    role: project.role || "",
    organization: project.organization || "",
    techTags: project.techTags ? JSON.parse(project.techTags) : [],
    skillTags: project.skillTags ? JSON.parse(project.skillTags) : [],
    githubUrl: project.githubUrl || "",
    demoUrl: project.demoUrl || "",
    blogUrl: project.blogUrl || "",
    featured: project.featured,
    visibility: project.visibility as "public" | "private",
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/projects">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit Project</h1>
          <p className="text-muted-foreground mt-1">
            Update project details and manage attachments
          </p>
        </div>
      </div>

      <ProjectForm
        initialData={formData}
        onSubmit={(data) => updateProject(id, data)}
        submitLabel="Update Project"
      />

      <Card>
        <CardHeader>
          <CardTitle>File Attachments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <FileUpload
            projectId={id}
            isPrivate={project.visibility === "private"}
          />
          
          {project.attachments.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-medium mb-3">
                  Uploaded Files ({project.attachments.length})
                </h3>
                <AttachmentsList attachments={project.attachments} />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
