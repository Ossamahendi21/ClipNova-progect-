import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, Scissors, Plus } from "lucide-react"
import { formatDuration } from "@/lib/utils"

interface VideoClip {
  id: string
  startTime: number
  endTime: number
  thumbnail: string
  duration: number
}

interface VideoTimelineProps {
  clips: VideoClip[]
  currentTime: number
  duration: number
  isPlaying: boolean
  onClipsChange: (clips: VideoClip[]) => void
  onTimeChange: (time: number) => void
  onPlayPause: () => void
  onSplit: () => void
  onAddClip: () => void
}

export function VideoTimeline({
  clips,
  currentTime,
  duration,
  isPlaying,
  onClipsChange,
  onTimeChange,
  onPlayPause,
  onSplit,
  onAddClip
}: VideoTimelineProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={onPlayPause}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          <span className="text-sm text-muted-foreground">
            {formatDuration(currentTime)} / {formatDuration(duration)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={onSplit}
          >
            <Scissors className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={onAddClip}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="relative h-24 rounded-lg border bg-muted p-2">
        <div className="absolute inset-0 flex items-center">
          <Slider
            value={[currentTime]}
            max={duration}
            step={0.1}
            onValueChange={([value]) => onTimeChange(value)}
            className="w-full"
          />
        </div>

        <div className="relative h-full">
          {clips.map((clip) => (
            <div
              key={clip.id}
              className="absolute top-0 h-full cursor-pointer rounded border bg-background p-1"
              style={{
                left: `${(clip.startTime / duration) * 100}%`,
                width: `${((clip.endTime - clip.startTime) / duration) * 100}%`
              }}
            >
              <img
                src={clip.thumbnail}
                alt="Clip thumbnail"
                className="h-full w-full object-cover rounded"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 