import { Video } from "@/types/video"
import { formatDistanceToNow } from "date-fns"
import { MoreVertical, Share2, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

interface VideoCardProps {
  video: Video
  onClick: () => void
  onDelete: () => void
  onShare: () => void
}

export function VideoCard({ video, onClick, onDelete, onShare }: VideoCardProps) {
  return (
    <div className="group relative">
      <div
        className="aspect-video cursor-pointer overflow-hidden rounded-lg bg-muted"
        onClick={onClick}
      >
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs text-white">
          {formatDuration(video.duration)}
        </div>
      </div>

      <div className="mt-2 flex items-start justify-between">
        <div className="space-y-1">
          <h3
            className="line-clamp-2 cursor-pointer font-medium"
            onClick={onClick}
          >
            {video.title}
          </h3>
          <p className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(video.createdAt), {
              addSuffix: true
            })}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="ml-2">
            <MoreVertical className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onDelete}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
} 