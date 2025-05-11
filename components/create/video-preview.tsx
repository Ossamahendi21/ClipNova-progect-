import { formatDistanceToNow } from "date-fns"
import { Download, MoreVertical, Share2, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { formatDuration } from "@/lib/utils"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"

interface VideoPreviewProps {
  videoUrl: string
  title: string
  duration: number
  createdAt: string
  onDelete: () => void
  onShare: () => void
  onDownload: () => void
  currentTime: number
  isPlaying: boolean
  volume: number
  isMuted: boolean
  onTimeChange: (time: number) => void
  onPlayPause: () => void
  onVolumeChange: (volume: number) => void
  onMuteToggle: () => void
}

export function VideoPreview({
  videoUrl,
  title,
  duration,
  createdAt,
  onDelete,
  onShare,
  onDownload,
  currentTime,
  isPlaying,
  volume,
  isMuted,
  onTimeChange,
  onPlayPause,
  onVolumeChange,
  onMuteToggle
}: VideoPreviewProps) {
  return (
    <div className="space-y-4">
      <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
        <video
          {...(videoUrl ? { src: videoUrl } : {})}
          className="w-full h-full object-contain"
          controls={false}
        />

        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            className="h-16 w-16 rounded-full bg-black/50 hover:bg-black/70"
            onClick={onPlayPause}
          >
            {isPlaying ? (
              <Pause className="h-8 w-8" />
            ) : (
              <Play className="h-8 w-8" />
            )}
          </Button>
        </div>
      </div>

      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">{title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{formatDuration(duration)}</span>
            <span>•</span>
            <span>
              {formatDistanceToNow(new Date(createdAt), {
                addSuffix: true
              })}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={onShare}
          >
            <Share2 className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={onDownload}
          >
            <Download className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Video
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Slider
            value={[currentTime]}
            max={duration}
            step={0.1}
            onValueChange={([value]) => onTimeChange(value)}
            className="flex-1"
          />
          <span className="text-sm text-muted-foreground w-24 text-right">
            {formatDuration(currentTime)} / {formatDuration(duration)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMuteToggle}
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
          <Slider
            value={[isMuted ? 0 : volume]}
            max={100}
            step={1}
            onValueChange={([value]) => onVolumeChange(value)}
            className="w-24"
          />
        </div>
      </div>
    </div>
  )
} 