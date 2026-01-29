"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, X, File, FileText, Image as ImageIcon, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { ALLOWED_FILE_TYPES } from "@/lib/validations"

interface FileUploadProps {
  projectId: string
  onUploadComplete?: () => void
  isPrivate?: boolean
}

interface FileWithPreview {
  file: File
  id: string
  progress: number
  error?: string
}

export function FileUpload({ projectId, onUploadComplete, isPrivate = false }: FileUploadProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    // Handle rejected files
    rejectedFiles.forEach((rejected) => {
      const error = rejected.errors[0]
      if (error.code === "file-too-large") {
        toast.error(`${rejected.file.name}: File size exceeds 25MB`)
      } else if (error.code === "file-invalid-type") {
        toast.error(`${rejected.file.name}: File type not allowed`)
      } else {
        toast.error(`${rejected.file.name}: ${error.message}`)
      }
    })

    // Add accepted files to the list
    const newFiles = acceptedFiles.map((file) => ({
      file,
      id: Math.random().toString(36).substring(7),
      progress: 0,
    }))
    
    setFiles((prev) => [...prev, ...newFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ALLOWED_FILE_TYPES.reduce((acc, type) => {
      acc[type] = []
      return acc
    }, {} as Record<string, string[]>),
    maxSize: 25 * 1024 * 1024, // 25MB
    multiple: true,
  })

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) {
      return <ImageIcon className="h-4 w-4" />
    } else if (type.includes("pdf") || type.includes("document")) {
      return <FileText className="h-4 w-4" />
    }
    return <File className="h-4 w-4" />
  }

  const uploadFiles = async () => {
    if (files.length === 0) return

    setIsUploading(true)
    let successCount = 0

    for (const fileWithPreview of files) {
      try {
        const formData = new FormData()
        formData.append("file", fileWithPreview.file)
        formData.append("projectId", projectId)
        formData.append("isPrivate", String(isPrivate))

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Upload failed")
        }

        successCount++
        
        // Remove successfully uploaded file from list
        setFiles((prev) => prev.filter((f) => f.id !== fileWithPreview.id))
      } catch (error) {
        console.error("Upload error:", error)
        toast.error(
          `Failed to upload ${fileWithPreview.file.name}: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        )
        
        // Mark file with error
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileWithPreview.id
              ? { ...f, error: error instanceof Error ? error.message : "Upload failed" }
              : f
          )
        )
      }
    }

    setIsUploading(false)

    if (successCount > 0) {
      toast.success(`Successfully uploaded ${successCount} file(s)`)
      if (onUploadComplete) {
        onUploadComplete()
      } else {
        // Refresh the page to show new attachments
        window.location.reload()
      }
    }
  }

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <Card
        {...getRootProps()}
        className={`border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          <Upload className="h-10 w-10 text-muted-foreground" />
          {isDragActive ? (
            <p className="text-sm text-muted-foreground">Drop files here...</p>
          ) : (
            <>
              <p className="text-sm font-medium">
                Drag & drop files here, or click to select
              </p>
              <p className="text-xs text-muted-foreground">
                Max 25MB per file. Allowed: PDF, DOCX, Images, Text, CSV, ZIP
              </p>
            </>
          )}
        </div>
      </Card>

      {/* File list */}
      {files.length > 0 && (
        <Card className="p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium">
                Files to upload ({files.length})
              </p>
              <Button
                size="sm"
                onClick={uploadFiles}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload All
                  </>
                )}
              </Button>
            </div>
            
            <div className="space-y-2">
              {files.map((fileWithPreview) => (
                <div
                  key={fileWithPreview.id}
                  className="flex items-center gap-3 p-2 rounded-md bg-muted/50"
                >
                  <div className="flex-shrink-0">
                    {getFileIcon(fileWithPreview.file.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {fileWithPreview.file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(fileWithPreview.file.size)}
                    </p>
                    {fileWithPreview.error && (
                      <p className="text-xs text-destructive mt-1">
                        {fileWithPreview.error}
                      </p>
                    )}
                  </div>
                  <Badge variant="outline" className="flex-shrink-0">
                    {fileWithPreview.file.type.split("/")[1] || "file"}
                  </Badge>
                  {!isUploading && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFile(fileWithPreview.id)}
                      className="flex-shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Empty state when no files */}
      {files.length === 0 && !isDragActive && (
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">
            No files selected. Drag files above or click to browse.
          </p>
        </div>
      )}
    </div>
  )
}
