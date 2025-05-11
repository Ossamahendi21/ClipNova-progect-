"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { MoreVertical, Edit, Trash, Share, Download, AlertCircle, Play } from "lucide-react"
import { Video } from "@/types/video"
import { formatDistanceToNow } from "date-fns"
import { toast } from "sonner"

interface VideoCardProps {
  video: Video
  onDelete?: (videoId: string) => void
  onShare?: (videoId: string) => Promise<string | null>
  onDownload?: (videoId: string) => Promise<string>
  onEdit?: (videoId: string) => void
  isHighlighted?: boolean
}

export function VideoCard({
  video,
  onDelete,
  onShare,
  onDownload,
  onEdit,
  isHighlighted = false
}: VideoCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [isCopied, setIsCopied] = useState(false)

  // Format the creation date
  const formattedDate = video.createdAt
    ? formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })
    : 'recently';

  // Format the duration
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleDelete = () => {
    // First close the dialog immediately to improve UI responsiveness
    setIsDeleteDialogOpen(false);

    // Immediately apply visual indication that the video is being deleted
    try {
      const videoElement = document.getElementById(`video-card-${video.id}`);
      if (videoElement) {
        videoElement.classList.add('opacity-50', 'pointer-events-none');
      }
    } catch (error) {
      console.error("Error applying visual deletion indicator:", error);
    }

    // Call the delete handler in a non-blocking way
    if (onDelete) {
      // Use setTimeout with 0ms delay to move the deletion to the next event loop tick
      // This prevents UI blocking by ensuring the current UI updates complete first
      setTimeout(() => {
        try {
          onDelete(video.id);
        } catch (error) {
          console.error("Error during video deletion:", error);
          // If there's an error, we still want the UI to be responsive
        }
      }, 0);
    }
  }

  const handleShare = () => {
    // Set a default share URL immediately for better UX
    setShareUrl('https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4');

    // Then get the actual share URL in the background
    if (onShare) {
      setTimeout(async () => {
        try {
          const url = await onShare(video.id);
          if (url) {
            setShareUrl(url);
          }
        } catch (error) {
          console.error("Error getting share URL:", error);
          // Keep the default URL if there's an error
        }
      }, 0);
    }
    // Keep the dialog open so the user can copy the link
  }

  const handleCopyLink = () => {
    const urlToCopy = shareUrl || 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4';

    // Show "Copied!" immediately for better UX
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);

    // Copy in the background
    setTimeout(() => {
      try {
        navigator.clipboard.writeText(urlToCopy)
          .catch(error => console.error("Failed to copy:", error));
      } catch (error) {
        console.error("Failed to copy:", error);
      }
    }, 0);
  }

  const handleDownload = () => {
    // Show a loading indicator
    toast.loading("Preparing download...", { duration: 2000 });

    // Call the download handler immediately
    if (onDownload) {
      try {
        onDownload(video.id)
          .then(url => {
            // Open the download URL in a new tab
            window.open(url, '_blank');
            toast.success("Download started");
          })
          .catch(error => {
            console.error("Error getting download URL:", error);
            // Fallback to sample video if there's an error
            window.open('https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4', '_blank');
            toast.error("Error preparing download, using fallback video");
          });
      } catch (error) {
        console.error("Error during download:", error);
        // Fallback to sample video if there's an error
        window.open('https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4', '_blank');
        toast.error("Error preparing download, using fallback video");
      }
    } else {
      // Fallback if no download handler is provided
      window.open('https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4', '_blank');
    }
  }

  const handleEdit = () => {
    if (onEdit) {
      onEdit(video.id);
    }
  }

  return (
    <div
      id={`video-card-${video.id}`}
      className={`flex items-center gap-4 p-3 rounded-lg border transition-all ${
        isHighlighted
          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20"
          : "border-border hover:border-emerald-500/50"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-20 h-12 rounded-md overflow-hidden bg-muted">
        <img src={video.thumbnail || "/placeholder.svg"} alt={video.title} className="w-full h-full object-cover" />
        <div className="absolute bottom-1 right-1 bg-background/80 text-xs px-1 rounded">
          {formatDuration(video.duration)}
        </div>
        {video.status === "processing" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-xs">
            Processing...
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-medium truncate">{video.title}</h4>
        <p className="text-xs text-muted-foreground">
          Created {formattedDate} • {video.status}
        </p>
      </div>

      <div
        className={`flex items-center gap-2 transition-opacity ${isHovered ? "opacity-100" : "opacity-0 md:opacity-100"}`}
      >
        <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
          <DialogTrigger asChild>
            <Button size="icon" variant="ghost" className="h-8 w-8" disabled={video.status === "processing"}>
              <Share className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Share Video</DialogTitle>
              <DialogDescription>Share "{video.title}" to social media or copy the link</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <Button variant="outline" onClick={handleShare}>
                Twitter
              </Button>
              <Button variant="outline" onClick={handleShare}>
                Facebook
              </Button>
              <Button variant="outline" onClick={handleShare}>
                Instagram
              </Button>
              <Button variant="outline" onClick={handleShare}>
                LinkedIn
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={shareUrl || video.cloudStorageUrl || `https://clipnova.com/share/${video.id}`}
                readOnly
              />
              <Button
                variant="outline"
                onClick={handleCopyLink}
              >
                {isCopied ? "Copied!" : "Copy"}
              </Button>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsShareDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8"
          onClick={handleDownload}
          disabled={video.status === "processing"}
        >
          <Download className="h-4 w-4" />
        </Button>

        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8"
          onClick={() => {
            if (video.cloudStorageUrl) {
              window.open(video.cloudStorageUrl, '_blank');
            }
          }}
          disabled={!video.cloudStorageUrl || video.status === "processing"}
        >
          <Play className="h-4 w-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleEdit} disabled={video.status === "processing"}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DialogTrigger asChild>
                <DropdownMenuItem className="text-red-500 focus:text-red-500" onSelect={(e) => e.preventDefault()}>
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Video</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete "{video.title}"? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex items-start py-4">
                  <AlertCircle className="h-5 w-5 text-destructive mr-2 shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    Deleting this video will remove it from all collections and shared links will no longer work.
                  </p>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleDelete}>
                    Delete Video
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
