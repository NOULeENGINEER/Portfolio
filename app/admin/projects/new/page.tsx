import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProjectForm } from "../project-form"
import { createProject } from "../actions"

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/projects">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Create New Project</h1>
          <p className="text-muted-foreground mt-1">
            Add a new project to your portfolio
          </p>
        </div>
      </div>

      <ProjectForm
        onSubmit={createProject}
        submitLabel="Create Project"
      />
    </div>
  )
}
