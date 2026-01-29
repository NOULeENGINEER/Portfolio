import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const resume = await prisma.resume.findUnique({
      where: { id: "default" },
    })

    if (!resume) {
      return NextResponse.json(
        {
          id: "default",
          name: "",
          headline: "",
          location: "",
          summary: "",
          email: "",
          phone: "",
          website: "",
          linkedin: "",
          github: "",
          twitter: "",
          skills: "",
          languages: "",
          experience: "",
          education: "",
          certifications: "",
        },
        { status: 200 }
      )
    }

    return NextResponse.json(resume)
  } catch (error) {
    console.error("Error fetching resume:", error)
    return NextResponse.json(
      { error: "Failed to fetch resume" },
      { status: 500 }
    )
  }
}
