import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download } from "lucide-react"

interface VideoExportDialogProps {
  isOpen: boolean
  onClose: () => void
  onExport: (options: ExportOptions) => void
}

interface ExportOptions {
  quality: "360p" | "480p" | "720p" | "1080p"
  format: "mp4" | "mov" | "webm"
  includeWatermark: boolean
}

export function VideoExportDialog({
  isOpen,
  onClose,
  onExport
}: VideoExportDialogProps) {
  const [options, setOptions] = useState<ExportOptions>({
    quality: "720p",
    format: "mp4",
    includeWatermark: false
  })

  const handleExport = () => {
    onExport(options)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Video</DialogTitle>
          <DialogDescription>
            Choose export settings for your video
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Video Quality</Label>
            <Select
              value={options.quality}
              onValueChange={(value: ExportOptions["quality"]) =>
                setOptions({ ...options, quality: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select quality" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="360p">360p (Low)</SelectItem>
                <SelectItem value="480p">480p (Medium)</SelectItem>
                <SelectItem value="720p">720p (HD)</SelectItem>
                <SelectItem value="1080p">1080p (Full HD)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Format</Label>
            <Select
              value={options.format}
              onValueChange={(value: ExportOptions["format"]) =>
                setOptions({ ...options, format: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mp4">MP4 (H.264)</SelectItem>
                <SelectItem value="mov">MOV (QuickTime)</SelectItem>
                <SelectItem value="webm">WebM (VP9)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Watermark</Label>
            <RadioGroup
              value={options.includeWatermark ? "yes" : "no"}
              onValueChange={(value) =>
                setOptions({ ...options, includeWatermark: value === "yes" })
              }
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="watermark-yes" />
                <Label htmlFor="watermark-yes">Include Watermark</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="watermark-no" />
                <Label htmlFor="watermark-no">No Watermark</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export Video
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 