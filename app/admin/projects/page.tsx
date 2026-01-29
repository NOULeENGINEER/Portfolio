import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Pencil, Eye, Trash2 } from "lucide-react"
import { DeleteProjectButton } from "./delete-button"
import { format } from "date-fns"

export const dynamic = "force-dynamic"

const statusColors = {
  Draft: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  Published: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  Archived: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
}

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { attachments: true },
      },
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground mt-1">
            Manage your portfolio projects
          </p>
        </div>
        <Link href="/admin/projects/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Project
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Projects ({projects.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No projects yet</p>
              <Link href="/admin/projects/new">
                <Button>Create your first project</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead>Files</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">
                        {project.title}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {project.slug}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={statusColors[project.status as keyof typeof statusColors]}
                        >
                          {project.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {project.featured && (
                          <Badge variant="outline">⭐ Featured</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {project._count.attachments > 0 && (
                          <span className="text-sm text-muted-foreground">
                            {project._count.attachments} file{project._count.attachments !== 1 ? 's' : ''}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(project.createdAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(project.updatedAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/projects/${project.slug}`} target="_blank">
                            <Button variant="ghost" size="icon" title="View">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/admin/projects/${project.id}`}>
                            <Button variant="ghost" size="icon" title="Edit">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                          <DeleteProjectButton
                            projectId={project.id}
                            projectTitle={project.title}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
