import { prisma } from "@/lib/prisma"
import { PublicNavbar } from "@/components/public/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Mail, 
  Phone, 
  Globe, 
  Linkedin, 
  Github, 
  MapPin, 
  Calendar,
  ExternalLink,
  Award,
  Briefcase,
  GraduationCap
} from "lucide-react"
import Link from "next/link"

interface Skill {
  category: string
  items: string[]
}

interface Language {
  name: string
  proficiency: string
}

interface Experience {
  role: string
  company: string
  startDate: string
  endDate?: string
  description?: string
  achievements?: string[]
}

interface Education {
  degree: string
  institution: string
  startDate: string
  endDate?: string
  description?: string
}

interface Certification {
  name: string
  issuer: string
  date: string
  url?: string
}

async function getResumeData() {
  try {
    const resume = await prisma.resume.findFirst({
      where: { id: "default" },
    })
    return resume
  } catch (error) {
    console.error("Error fetching resume:", error)
    return null
  }
}

async function getFeaturedProjects() {
  try {
    const projects = await prisma.project.findMany({
      where: {
        featured: true,
        status: "Published",
        visibility: "public",
      },
      orderBy: { createdAt: "desc" },
      take: 6,
    })
    return projects
  } catch (error) {
    console.error("Error fetching projects:", error)
    return []
  }
}

export default async function Home() {
  const [resume, projects] = await Promise.all([
    getResumeData(),
    getFeaturedProjects(),
  ])

  const skills: Skill[] = resume?.skills ? JSON.parse(resume.skills) : []
  const languages: Language[] = resume?.languages ? JSON.parse(resume.languages) : []
  const experience: Experience[] = resume?.experience ? JSON.parse(resume.experience) : []
  const education: Education[] = resume?.education ? JSON.parse(resume.education) : []
  const certifications: Certification[] = resume?.certifications ? JSON.parse(resume.certifications) : []

  const getInitials = (name?: string) => {
    if (!name) return "ND"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <>
      <PublicNavbar />
      <div className="min-h-screen bg-muted/30">
        <div className="container mx-auto px-4 py-8 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Sidebar */}
            <aside className="lg:col-span-1 space-y-6">
              {/* Profile Card */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <Avatar className="h-32 w-32">
                      <AvatarImage src="/avatar.jpg" alt={resume?.name || "Profile"} />
                      <AvatarFallback className="text-2xl">
                        {getInitials(resume?.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h1 className="text-2xl font-bold">{resume?.name || "Your Name"}</h1>
                      {resume?.headline && (
                        <p className="text-muted-foreground mt-1">{resume.headline}</p>
                      )}
                      {resume?.location && (
                        <div className="flex items-center justify-center gap-1 mt-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{resume.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Links */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {resume?.email && (
                    <a
                      href={`mailto:${resume.email}`}
                      className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                      <span className="truncate">{resume.email}</span>
                    </a>
                  )}
                  {resume?.phone && (
                    <a
                      href={`tel:${resume.phone}`}
                      className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                    >
                      <Phone className="h-4 w-4" />
                      <span>{resume.phone}</span>
                    </a>
                  )}
                  {resume?.website && (
                    <a
                      href={resume.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                    >
                      <Globe className="h-4 w-4" />
                      <span className="truncate">{resume.website}</span>
                    </a>
                  )}
                  {resume?.linkedin && (
                    <a
                      href={resume.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                    >
                      <Linkedin className="h-4 w-4" />
                      <span>LinkedIn</span>
                    </a>
                  )}
                  {resume?.github && (
                    <a
                      href={resume.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                    >
                      <Github className="h-4 w-4" />
                      <span>GitHub</span>
                    </a>
                  )}
                </CardContent>
              </Card>

              {/* Skills */}
              {skills.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Skills</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {skills.map((skillGroup, idx) => (
                      <div key={idx}>
                        <h3 className="text-sm font-semibold mb-2">{skillGroup.category}</h3>
                        <div className="flex flex-wrap gap-2">
                          {skillGroup.items.map((skill, skillIdx) => (
                            <Badge key={skillIdx} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Languages */}
              {languages.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Languages</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {languages.map((lang, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span className="text-sm font-medium">{lang.name}</span>
                        <Badge variant="outline">{lang.proficiency}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </aside>

            {/* Right Main Content */}
            <main className="lg:col-span-2 space-y-6">
              {/* Summary */}
              {resume?.summary && (
                <Card>
                  <CardHeader>
                    <CardTitle>Professional Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{resume.summary}</p>
                  </CardContent>
                </Card>
              )}

              {/* Experience */}
              {experience.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Experience
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {experience.map((exp, idx) => (
                      <div key={idx}>
                        {idx > 0 && <Separator className="mb-6" />}
                        <div className="space-y-2">
                          <div>
                            <h3 className="text-lg font-semibold">{exp.role}</h3>
                            <p className="text-muted-foreground font-medium">{exp.company}</p>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {exp.startDate} - {exp.endDate || "Present"}
                            </span>
                          </div>
                          {exp.description && (
                            <p className="text-sm text-muted-foreground mt-2">{exp.description}</p>
                          )}
                          {exp.achievements && exp.achievements.length > 0 && (
                            <ul className="list-disc list-inside space-y-1 mt-2 text-sm">
                              {exp.achievements.map((achievement, achIdx) => (
                                <li key={achIdx} className="text-muted-foreground">
                                  {achievement}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Featured Projects */}
              {projects.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Featured Projects</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {projects.map((project) => {
                        const techTags = project.techTags ? JSON.parse(project.techTags) : []
                        return (
                          <Card key={project.id} className="hover:border-primary transition-colors">
                            <CardHeader>
                              <CardTitle className="text-base">{project.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              {project.shortSummary && (
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {project.shortSummary}
                                </p>
                              )}
                              {techTags.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {techTags.slice(0, 4).map((tag: string, idx: number) => (
                                    <Badge key={idx} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                              <Link
                                href={`/projects/${project.slug}`}
                                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                              >
                                View Details
                                <ExternalLink className="h-3 w-3" />
                              </Link>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Education */}
              {education.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5" />
                      Education
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {education.map((edu, idx) => (
                      <div key={idx}>
                        {idx > 0 && <Separator className="mb-4" />}
                        <div className="space-y-1">
                          <h3 className="font-semibold">{edu.degree}</h3>
                          <p className="text-sm text-muted-foreground">{edu.institution}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {edu.startDate} - {edu.endDate || "Present"}
                            </span>
                          </div>
                          {edu.description && (
                            <p className="text-sm text-muted-foreground mt-1">{edu.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Certifications */}
              {certifications.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Certifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {certifications.map((cert, idx) => (
                      <div key={idx} className="flex items-start justify-between gap-4">
                        <div className="space-y-1 flex-1">
                          <h3 className="font-semibold text-sm">{cert.name}</h3>
                          <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                          <p className="text-xs text-muted-foreground">{cert.date}</p>
                        </div>
                        {cert.url && (
                          <a
                            href={cert.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  )
}
