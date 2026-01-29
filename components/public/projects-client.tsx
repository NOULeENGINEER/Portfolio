"use client"

import { useState, useMemo } from "react"
import { ProjectCard } from "@/components/public/project-card"
import { ProjectFilters } from "@/components/public/project-filters"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"
import Link from "next/link"
import { formatDate } from "@/lib/helpers"

interface Project {
  id: string
  slug: string
  title: string
  shortSummary: string | null
  longDescription: string | null
  status: string
  startDate: Date | null
  endDate: Date | null
  techTags: string | null
  skillTags: string | null
  githubUrl: string | null
  demoUrl: string | null
  blogUrl: string | null
  featured: boolean
}

interface ProjectsClientProps {
  projects: Project[]
}

export function ProjectsClient({ projects }: ProjectsClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [yearFilter, setYearFilter] = useState("all")
  const [sortBy, setSortBy] = useState("recent")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid")
  const [itemsToShow, setItemsToShow] = useState(12)

  // Extract all unique tags and years
  const { availableTags, availableYears } = useMemo(() => {
    const tagsSet = new Set<string>()
    const yearsSet = new Set<number>()

    projects.forEach((project) => {
      if (project.techTags) {
        JSON.parse(project.techTags).forEach((tag: string) => tagsSet.add(tag))
      }
      if (project.skillTags) {
        JSON.parse(project.skillTags).forEach((tag: string) => tagsSet.add(tag))
      }
      if (project.startDate) {
        yearsSet.add(new Date(project.startDate).getFullYear())
      }
    })

    return {
      availableTags: Array.from(tagsSet).sort(),
      availableYears: Array.from(yearsSet).sort((a, b) => b - a),
    }
  }, [projects])

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    let filtered = [...projects]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((project) => {
        const title = project.title.toLowerCase()
        const summary = project.shortSummary?.toLowerCase() || ""
        const description = project.longDescription?.toLowerCase() || ""
        return title.includes(query) || summary.includes(query) || description.includes(query)
      })
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((project) => project.status === statusFilter)
    }

    // Year filter
    if (yearFilter !== "all") {
      const year = parseInt(yearFilter)
      filtered = filtered.filter((project) => {
        if (!project.startDate) return false
        return new Date(project.startDate).getFullYear() === year
      })
    }

    // Tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter((project) => {
        const projectTags = [
          ...(project.techTags ? JSON.parse(project.techTags) : []),
          ...(project.skillTags ? JSON.parse(project.skillTags) : []),
        ]
        return selectedTags.every((tag) => projectTags.includes(tag))
      })
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.startDate || 0).getTime() - new Date(a.startDate || 0).getTime()
        case "oldest":
          return new Date(a.startDate || 0).getTime() - new Date(b.startDate || 0).getTime()
        case "title":
          return a.title.localeCompare(b.title)
        case "title-desc":
          return b.title.localeCompare(a.title)
        default:
          return 0
      }
    })

    return filtered
  }, [projects, searchQuery, statusFilter, yearFilter, selectedTags, sortBy])

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const displayedProjects = filteredProjects.slice(0, itemsToShow)
  const hasMore = filteredProjects.length > itemsToShow

  return (
    <div className="space-y-8">
      {/* Filters */}
      <ProjectFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        yearFilter={yearFilter}
        onYearChange={setYearFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        selectedTags={selectedTags}
        onTagToggle={handleTagToggle}
        availableTags={availableTags}
        availableYears={availableYears}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalResults={filteredProjects.length}
      />

      {/* Projects Display */}
      {displayedProjects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground mb-2">No projects found</p>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search or filter criteria
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Tags</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedProjects.map((project) => {
                const allTags = [
                  ...(project.techTags ? JSON.parse(project.techTags) : []),
                  ...(project.skillTags ? JSON.parse(project.skillTags) : []),
                ].slice(0, 3)

                return (
                  <TableRow key={project.id}>
                    <TableCell>
                      <Link
                        href={`/projects/${project.slug}`}
                        className="font-medium hover:text-primary transition-colors"
                      >
                        {project.title}
                      </Link>
                      {project.shortSummary && (
                        <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                          {project.shortSummary}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={project.status === "Published" ? "default" : "secondary"}>
                        {project.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {project.startDate && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-2" />
                          {formatDate(project.startDate.toString())}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {allTags.map((tag: string, i: number) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Load More */}
      {hasMore && (
        <div className="text-center">
          <button
            onClick={() => setItemsToShow((prev) => prev + 12)}
            className="px-6 py-2 border rounded-lg hover:bg-muted transition-colors"
          >
            Load More ({filteredProjects.length - itemsToShow} remaining)
          </button>
        </div>
      )}
    </div>
  )
}
