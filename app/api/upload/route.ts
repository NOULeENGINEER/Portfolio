import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ALLOWED_FILE_TYPES } from "@/lib/validations"
import { writeFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"
import crypto from "crypto"

const MAX_FILE_SIZE = 25 * 1024 * 1024 // 25MB
const UPLOAD_DIR = path.join(process.cwd(), "uploads")

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const projectId = formData.get("projectId") as string | null
    const isPrivate = formData.get("isPrivate") === "true"

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 })
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 25MB limit" },
        { status: 400 }
      )
    }

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `File type ${file.type} is not allowed` },
        { status: 400 }
      )
    }

    // Verify project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Create uploads directory if it doesn't exist
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true })
    }

    // Generate unique filename with timestamp
    const timestamp = Date.now()
    const randomString = crypto.randomBytes(8).toString("hex")
    const fileExtension = path.extname(file.name)
    const storedName = `${timestamp}-${randomString}${fileExtension}`

    // Read file buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Calculate SHA256 hash
    const hash = crypto.createHash("sha256")
    hash.update(buffer)
    const sha256 = hash.digest("hex")

    // Save file to disk
    const filePath = path.join(UPLOAD_DIR, storedName)
    await writeFile(filePath, buffer)

    // Store metadata in database
    const attachment = await prisma.attachment.create({
      data: {
        projectId,
        originalName: file.name,
        storedName,
        mimeType: file.type,
        size: file.size,
        sha256,
        isPrivate,
      },
    })

    return NextResponse.json({
      success: true,
      attachment: {
        id: attachment.id,
        originalName: attachment.originalName,
        size: attachment.size,
        mimeType: attachment.mimeType,
        isPrivate: attachment.isPrivate,
        uploadedAt: attachment.uploadedAt,
      },
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    )
  }
}
