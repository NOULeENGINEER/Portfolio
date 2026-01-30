import { Metadata } from "next"
import { PublicNavbar } from "@/components/public/navbar"
import { prisma } from "@/lib/prisma"
import { ProjectsClient } from "@/components/public/projects-client"

export const metadata: Metadata = {
  title: "Projects | Noussayr Derbel",
  description: "Browse my portfolio of software development projects",
}

async function getProjects() {
  try {
    const projects = await prisma.project.findMany({
      where: {
        status: "Published",
        visibility: "public",
      },
      orderBy: { startDate: "desc" },
      select: {
        id: true,
        slug: true,
        title: true,
        shortSummary: true,
        longDescription: true,
        status: true,
        startDate: true,
        endDate: true,
        techTags: true,
        skillTags: true,
        githubUrl: true,
        demoUrl: true,
        blogUrl: true,
        featured: true,
      },
    })
    return projects
  } catch (error) {
    console.error("Error fetching projects:", error)
    return []
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Projects</h1>
            <p className="text-lg text-muted-foreground">
              Explore my portfolio of software development projects
            </p>
          </div>

          {/* Projects */}
          <ProjectsClient projects={projects} />
        </div>
      </main>
    </div>
  )
}
