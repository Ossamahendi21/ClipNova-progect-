import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VideoPreview } from "./video-preview"
import { VideoTimeline } from "./video-timeline"
import { VideoAudio } from "./video-audio"
import { VideoEffects } from "./video-effects"
import { VideoSubtitles } from "./video-subtitles"

interface VideoClip {
  id: string
  startTime: number
  endTime: number
  thumbnail: string
  duration: number
}

interface AudioTrack {
  id: string
  name: string
  type: "main" | "background" | "voiceover"
  volume: number
  muted: boolean
  file?: File
}

interface Subtitle {
  id: string
  startTime: string
  endTime: string
  text: string
  language: string
}

export function VideoEditor() {
  const [videoUrl, setVideoUrl] = useState<string>("")
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(100)
  const [isMuted, setIsMuted] = useState(false)
  const [clips, setClips] = useState<VideoClip[]>([])
  const [audioTracks, setAudioTracks] = useState<AudioTrack[]>([])
  const [subtitles, setSubtitles] = useState<Subtitle[]>([])
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)

  const handleTimeChange = (time: number) => {
    setCurrentTime(time)
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const handleMuteToggle = () => {
    setIsMuted(!isMuted)
  }

  const handleClipsChange = (newClips: VideoClip[]) => {
    setClips(newClips)
  }

  const handleAudioTracksChange = (newTracks: AudioTrack[]) => {
    setAudioTracks(newTracks)
  }

  const handleSubtitlesChange = (newSubtitles: Subtitle[]) => {
    setSubtitles(newSubtitles)
  }

  const handleAutoGenerateSubtitles = () => {
    // TODO: Implement auto subtitle generation
  }

  const handleImportSubtitles = () => {
    // TODO: Implement subtitle import
  }

  const handleExport = () => {
    setIsExporting(true)
    setExportProgress(0)

    // Simulate export progress
    const interval = setInterval(() => {
      setExportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsExporting(false)
          return 100
        }
        return prev + 1
      })
    }, 100)
  }

  const handleCancelExport = () => {
    setIsExporting(false)
    setExportProgress(0)
  }

  return (
    <div className="space-y-6">
      <VideoPreview
        videoUrl={videoUrl}
        title="Untitled Video"
        duration={duration}
        createdAt={new Date().toISOString()}
        currentTime={currentTime}
        isPlaying={isPlaying}
        volume={volume}
        isMuted={isMuted}
        onTimeChange={handleTimeChange}
        onPlayPause={handlePlayPause}
        onVolumeChange={handleVolumeChange}
        onMuteToggle={handleMuteToggle}
        onDelete={() => {}}
        onShare={() => {}}
        onDownload={() => {}}
      />

      <Tabs defaultValue="timeline">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="audio">Audio</TabsTrigger>
          <TabsTrigger value="effects">Effects</TabsTrigger>
          <TabsTrigger value="subtitles">Subtitles</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline">
          <VideoTimeline
            clips={clips}
            currentTime={currentTime}
            duration={duration}
            isPlaying={isPlaying}
            onClipsChange={handleClipsChange}
            onTimeChange={handleTimeChange}
            onPlayPause={handlePlayPause}
            onSplit={() => {}}
            onAddClip={() => {}}
          />
        </TabsContent>

        <TabsContent value="audio">
          <VideoAudio
            tracks={audioTracks}
            onTracksChange={handleAudioTracksChange}
            onAddTrack={() => {}}
            onRemoveTrack={() => {}}
          />
        </TabsContent>

        <TabsContent value="effects">
          <VideoEffects
            onEffectChange={() => {}}
            onTransitionChange={() => {}}
          />
        </TabsContent>

        <TabsContent value="subtitles">
          <VideoSubtitles
            subtitles={subtitles}
            onSubtitlesChange={handleSubtitlesChange}
            onAutoGenerate={handleAutoGenerateSubtitles}
            onImport={handleImportSubtitles}
          />
        </TabsContent>

        <TabsContent value="export">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Export Video</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Choose export settings and download your video
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {isExporting ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Exporting...</span>
                      <span className="text-sm text-muted-foreground">
                        {exportProgress}%
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${exportProgress}%` }}
                      />
                    </div>
                  </div>

                  <button
                    className="w-full rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                    onClick={handleCancelExport}
                  >
                    Cancel Export
                  </button>
                </div>
              ) : (
                <button
                  className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                  onClick={handleExport}
                >
                  Export Video
                </button>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 