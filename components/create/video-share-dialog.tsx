import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Facebook, Twitter, Linkedin, Link2, Check } from "lucide-react"
import { toast } from "sonner"

interface VideoShareDialogProps {
  isOpen: boolean
  onClose: () => void
  videoUrl: string
  title: string
}

export function VideoShareDialog({
  isOpen,
  onClose,
  videoUrl,
  title
}: VideoShareDialogProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(videoUrl)
      setCopied(true)
      toast.success("Link copied to clipboard")
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error("Failed to copy link")
    }
  }

  const handleShare = (platform: string) => {
    const shareUrl = encodeURIComponent(videoUrl)
    const shareTitle = encodeURIComponent(title)
    let url = ""

    switch (platform) {
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`
        break
      case "twitter":
        url = `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`
        break
      case "linkedin":
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`
        break
    }

    window.open(url, "_blank", "width=600,height=400")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Video</DialogTitle>
          <DialogDescription>
            Share your video with others through social media or direct link
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="link" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="link">Copy Link</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
          </TabsList>

          <TabsContent value="link" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="link">Video Link</Label>
              <div className="flex gap-2">
                <Input
                  id="link"
                  value={videoUrl}
                  readOnly
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyLink}
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Link2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="social" className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-4"
                onClick={() => handleShare("facebook")}
              >
                <Facebook className="h-6 w-6 text-[#1877F2]" />
                <span className="text-sm">Facebook</span>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-4"
                onClick={() => handleShare("twitter")}
              >
                <Twitter className="h-6 w-6 text-[#1DA1F2]" />
                <span className="text-sm">Twitter</span>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-4"
                onClick={() => handleShare("linkedin")}
              >
                <Linkedin className="h-6 w-6 text-[#0A66C2]" />
                <span className="text-sm">LinkedIn</span>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
} 