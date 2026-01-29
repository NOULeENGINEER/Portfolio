import { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { PublicNavbar } from "@/components/public/navbar"
import { prisma } from "@/lib/prisma"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Calendar,
  ExternalLink,
  Github,
  FileText,
  Briefcase,
  Building2,
  Download,
  Eye,
} from "lucide-react"
import { formatDate } from "@/lib/helpers"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface ProjectPageProps {
  params: {
    slug: string
  }
}

async function getProject(slug: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { slug },
      include: {
        attachments: {
          where: { isPrivate: false },
          orderBy: { uploadedAt: "desc" },
        },
      },
    })

    if (!project || project.status !== "Published" || project.visibility !== "public") {
      return null
    }

    // Increment view count
    await prisma.project.update({
      where: { id: project.id },
      data: { views: { increment: 1 } },
    })

    return project
  } catch (error) {
    console.error("Error fetching project:", error)
    return null
  }
}

async function getRelatedProjects(currentProjectId: string, tags: string[]) {
  if (tags.length === 0) return []

  try {
    const projects = await prisma.project.findMany({
      where: {
        id: { not: currentProjectId },
        status: "Published",
        visibility: "public",
        OR: [
          { techTags: { contains: tags[0] } },
          { skillTags: { contains: tags[0] } },
        ],
      },
      take: 3,
      orderBy: { createdAt: "desc" },
      select: {
        slug: true,
        title: true,
        shortSummary: true,
        techTags: true,
      },
    })
    return projects
  } catch (error) {
    console.error("Error fetching related projects:", error)
    return []
  }
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const project = await getProject(params.slug)

  if (!project) {
    return {
      title: "Project Not Found",
    }
  }

  return {
    title: `${project.title} | Projects`,
    description: project.shortSummary || project.title,
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = await getProject(params.slug)

  if (!project) {
    notFound()
  }

  const techTags = project.techTags ? JSON.parse(project.techTags) : []
  const skillTags = project.skillTags ? JSON.parse(project.skillTags) : []
  const allTags = [...techTags, ...skillTags]
  const relatedProjects = await getRelatedProjects(project.id, allTags)

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-5xl">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link
              href="/projects"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Link>
          </div>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-4xl font-bold">{project.title}</h1>
              <Badge variant={project.status === "Published" ? "default" : "secondary"}>
                {project.status}
              </Badge>
            </div>

            {project.shortSummary && (
              <p className="text-xl text-muted-foreground mb-6">{project.shortSummary}</p>
            )}

            {/* Metadata Row */}
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
              {project.startDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {formatDate(project.startDate.toString())}
                    {project.endDate && ` - ${formatDate(project.endDate.toString())}`}
                  </span>
                </div>
              )}
              {project.role && (
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  <span>{project.role}</span>
                </div>
              )}
              {project.organization && (
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <span>{project.organization}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>{project.views} views</span>
              </div>
            </div>

            {/* Links */}
            <div className="flex flex-wrap gap-3 mt-6">
              {project.githubUrl && (
                <Button asChild variant="outline">
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4 mr-2" />
                    View Code
                  </a>
                </Button>
              )}
              {project.demoUrl && (
                <Button asChild variant="outline">
                  <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Live Demo
                  </a>
                </Button>
              )}
              {project.blogUrl && (
                <Button asChild variant="outline">
                  <a href={project.blogUrl} target="_blank" rel="noopener noreferrer">
                    <FileText className="h-4 w-4 mr-2" />
                    Read Article
                  </a>
                </Button>
              )}
            </div>
          </div>

          <Separator className="my-8" />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              {project.longDescription && (
                <Card>
                  <CardHeader>
                    <CardTitle>Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {project.longDescription}
                      </ReactMarkdown>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Attachments */}
              {project.attachments.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Attachments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {project.attachments.map((attachment) => (
                        <a
                          key={attachment.id}
                          href={`/api/attachments/${attachment.id}/download`}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Download className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">{attachment.originalName}</p>
                              <p className="text-xs text-muted-foreground">
                                {(attachment.size / 1024).toFixed(2)} KB
                              </p>
                            </div>
                          </div>
                          <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Tech Stack */}
              {techTags.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Tech Stack</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {techTags.map((tag: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Skills */}
              {skillTags.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {skillTags.map((tag: string, index: number) => (
                        <Badge key={index} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Related Projects */}
              {relatedProjects.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Related Projects</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {relatedProjects.map((related) => (
                        <Link
                          key={related.slug}
                          href={`/projects/${related.slug}`}
                          className="block group"
                        >
                          <h4 className="font-medium group-hover:text-primary transition-colors mb-1">
                            {related.title}
                          </h4>
                          {related.shortSummary && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {related.shortSummary}
                            </p>
                          )}
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
