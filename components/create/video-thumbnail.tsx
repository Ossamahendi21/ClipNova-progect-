import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, Image, Camera } from "lucide-react"
import { cn } from "@/lib/utils"

interface VideoThumbnailProps {
  thumbnailUrl: string
  onThumbnailChange: (file: File) => void
  onCaptureFrame: () => void
  className?: string
}

export function VideoThumbnail({
  thumbnailUrl,
  onThumbnailChange,
  onCaptureFrame,
  className
}: VideoThumbnailProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith("image/")) {
      onThumbnailChange(file)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onThumbnailChange(file)
    }
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle>Video Thumbnail</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={cn(
            "aspect-video rounded-lg border-2 border-dashed flex items-center justify-center relative overflow-hidden",
            isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt="Video thumbnail"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center p-6">
              <Image className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                Drag and drop an image here, or click to select
              </p>
            </div>
          )}

          <input
            type="file"
            id="thumbnail-upload"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => document.getElementById("thumbnail-upload")?.click()}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Image
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={onCaptureFrame}
          >
            <Camera className="mr-2 h-4 w-4" />
            Capture Frame
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="thumbnail-url">Or enter image URL</Label>
          <div className="flex gap-2">
            <Input
              id="thumbnail-url"
              placeholder="https://example.com/image.jpg"
              className="flex-1"
            />
            <Button variant="outline">Use URL</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 