import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { readFile } from "fs/promises"
import { existsSync } from "fs"
import path from "path"

const UPLOAD_DIR = path.join(process.cwd(), "uploads")

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Validate ID format (prevent path traversal)
    if (!id || id.includes("..") || id.includes("/") || id.includes("\\")) {
      return NextResponse.json({ error: "Invalid file ID" }, { status: 400 })
    }

    // Get attachment from database
    const attachment = await prisma.attachment.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            visibility: true,
          },
        },
      },
    })

    if (!attachment) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    // Check access control for private files
    if (attachment.isPrivate || attachment.project.visibility === "private") {
      const session = await auth()
      if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
    }

    // Validate stored filename (prevent path traversal)
    const storedName = path.basename(attachment.storedName)
    if (storedName !== attachment.storedName) {
      return NextResponse.json(
        { error: "Invalid filename" },
        { status: 400 }
      )
    }

    // Read file from disk
    const filePath = path.join(UPLOAD_DIR, storedName)
    
    if (!existsSync(filePath)) {
      return NextResponse.json(
        { error: "File not found on disk" },
        { status: 404 }
      )
    }

    const fileBuffer = await readFile(filePath)

    // Set appropriate headers
    const headers = new Headers()
    headers.set("Content-Type", attachment.mimeType)
    headers.set("Content-Length", attachment.size.toString())
    headers.set(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(attachment.originalName)}"`
    )
    headers.set("Cache-Control", "private, max-age=3600")

    return new NextResponse(fileBuffer, {
      status: 200,
      headers,
    })
  } catch (error) {
    console.error("Download error:", error)
    return NextResponse.json(
      { error: "Failed to download file" },
      { status: 500 }
    )
  }
}
