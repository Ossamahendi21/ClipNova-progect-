"use client"

import type React from "react"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, X, FileText, ImageIcon, Film } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface UploadDropzoneProps {
  onFilesAccepted?: (files: File[]) => void
  maxFiles?: number
  maxSize?: number
  accept?: Record<string, string[]>
  className?: string
}

export function UploadDropzone({
  onFilesAccepted,
  maxFiles = 5,
  maxSize = 100 * 1024 * 1024, // 100MB
  accept = {
    "video/*": [".mp4", ".mov", ".avi"],
    "image/*": [".jpg", ".jpeg", ".png", ".gif"]
  },
  className
}: UploadDropzoneProps) {
  const [files, setFiles] = useState<File[]>([])

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = [...files, ...acceptedFiles].slice(0, maxFiles)
      setFiles(newFiles)
      onFilesAccepted?.(newFiles)
    },
    [files, maxFiles, onFilesAccepted]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    maxSize,
    accept
  })

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index)
    setFiles(newFiles)
    onFilesAccepted?.(newFiles)
  }

  const getFileIcon = (file: File) => {
    const type = file.type.split("/")[0]

    switch (type) {
      case "image":
        return <ImageIcon className="h-5 w-5 text-emerald-500" />
      case "video":
        return <Film className="h-5 w-5 text-emerald-500" />
      default:
        return <FileText className="h-5 w-5 text-emerald-500" />
    }
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          className
        )}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">
          {isDragActive
            ? "Drop the files here..."
            : "Drag & drop files here, or click to select files"}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Supported formats: MP4, MOV, AVI, JPG, PNG, GIF (max {maxFiles} files, {maxSize / 1024 / 1024}MB each)
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Selected Files:</p>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-muted rounded-md"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                  <span className="text-xs text-muted-foreground">
                    ({(file.size / 1024 / 1024).toFixed(2)}MB)
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => removeFile(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
