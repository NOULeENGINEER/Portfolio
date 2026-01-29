"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Trash2, Download, FileText, Image, File } from "lucide-react"
import { deleteAttachment } from "../actions"
import { toast } from "sonner"
import { format } from "date-fns"

interface Attachment {
  id: string
  originalName: string
  storedName: string
  mimeType: string
  size: number
  isPrivate: boolean
  uploadedAt: Date
}

interface AttachmentsListProps {
  attachments: Attachment[]
}

export function AttachmentsList({ attachments }: AttachmentsListProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedAttachment, setSelectedAttachment] = useState<Attachment | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i]
  }

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) {
      return <Image className="h-4 w-4" />
    } else if (mimeType.includes("pdf") || mimeType.includes("document")) {
      return <FileText className="h-4 w-4" />
    }
    return <File className="h-4 w-4" />
  }

  const handleDeleteClick = (attachment: Attachment) => {
    setSelectedAttachment(attachment)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!selectedAttachment) return

    setIsDeleting(true)
    try {
      const result = await deleteAttachment(selectedAttachment.id)
      if (result.success) {
        toast.success(result.message)
        setDeleteDialogOpen(false)
        setSelectedAttachment(null)
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error("Failed to delete attachment")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>File Name</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead>Uploaded</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attachments.map((attachment) => (
              <TableRow key={attachment.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {getFileIcon(attachment.mimeType)}
                    <span className="truncate max-w-xs">{attachment.originalName}</span>
                  </div>
                </TableCell>
                <TableCell>{formatFileSize(attachment.size)}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-mono text-xs">
                    {attachment.mimeType.split("/")[1] || attachment.mimeType}
                  </Badge>
                </TableCell>
                <TableCell>
                  {attachment.isPrivate ? (
                    <Badge variant="secondary">Private</Badge>
                  ) : (
                    <Badge variant="outline">Public</Badge>
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {format(new Date(attachment.uploadedAt), "MMM d, yyyy")}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Download"
                      asChild
                    >
                      <a href={`/api/files/${attachment.id}`} download>
                        <Download className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Delete"
                      onClick={() => handleDeleteClick(attachment)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Attachment</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <strong>{selectedAttachment?.originalName}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
