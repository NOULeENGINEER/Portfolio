import { prisma } from "@/lib/prisma"
import { ContactPageClient } from "./contact-client"

async function getResumeData() {
  try {
    const resume = await prisma.resume.findFirst({
      where: { id: "default" },
      select: {
        email: true,
        phone: true,
        location: true,
        linkedin: true,
        github: true,
        website: true,
      },
    })
    return resume
  } catch (error) {
    console.error("Error fetching resume data:", error)
    return null
  }
}

export default async function ContactPage() {
  const resumeData = await getResumeData()
  return <ContactPageClient resumeData={resumeData} />
}
