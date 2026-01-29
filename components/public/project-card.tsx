import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, ExternalLink, Github } from "lucide-react"
import { formatDate } from "@/lib/helpers"

interface ProjectCardProps {
  project: {
    slug: string
    title: string
    shortSummary: string | null
    status: string
    startDate: Date | null
    endDate: Date | null
    techTags: string | null
    skillTags: string | null
    githubUrl: string | null
    demoUrl: string | null
    featured: boolean
  }
}

export function ProjectCard({ project }: ProjectCardProps) {
  const techTags = project.techTags ? JSON.parse(project.techTags) : []
  const skillTags = project.skillTags ? JSON.parse(project.skillTags) : []
  const allTags = [...techTags.slice(0, 3), ...skillTags.slice(0, 2)]

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">
              <Link 
                href={`/projects/${project.slug}`}
                className="hover:text-primary transition-colors"
              >
                {project.title}
              </Link>
            </CardTitle>
            {project.shortSummary && (
              <CardDescription className="line-clamp-2">
                {project.shortSummary}
              </CardDescription>
            )}
          </div>
          <Badge variant={project.status === "Published" ? "default" : "secondary"}>
            {project.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Date Range */}
        {project.startDate && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            <span>
              {formatDate(project.startDate.toString())}
              {project.endDate && ` - ${formatDate(project.endDate.toString())}`}
            </span>
          </div>
        )}

        {/* Tags */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {allTags.slice(0, 5).map((tag: string, index: number) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {allTags.length > 5 && (
              <Badge variant="outline" className="text-xs">
                +{allTags.length - 5}
              </Badge>
            )}
          </div>
        )}

        {/* Links */}
        <div className="flex gap-3 pt-2">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              <Github className="h-4 w-4" />
              <span>Code</span>
            </a>
          )}
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Demo</span>
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
