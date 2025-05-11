import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VideoPrompt } from "./video-prompt"
import { VideoTemplates } from "./video-templates"
import { VideoTimeline } from "./video-timeline"
import { VideoEditor } from "./video-editor"
import { VideoAudio } from "./video-audio"
import { VideoEffects } from "./video-effects"
import { VideoSubtitles } from "./video-subtitles"
import { VideoThumbnail } from "./video-thumbnail"
import { VideoSettings, VideoSettings as VideoSettingsType } from "./video-settings"
import { GenerationProgress } from "./generation-progress"
import { VideoService } from "@/lib/services/video-service"
import { VideoTemplate } from "@/types/video"
import { toast } from "sonner"

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

interface VideoGenerationProps {
  onComplete?: (videoId: string) => void
}

export function VideoGeneration({ onComplete }: VideoGenerationProps) {
  const [activeTab, setActiveTab] = useState("prompt")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState<VideoTemplate>()
  const [videoUrl, setVideoUrl] = useState("")
  const [clips, setClips] = useState<VideoClip[]>([])
  const [audioTracks, setAudioTracks] = useState<AudioTrack[]>([])
  const [subtitles, setSubtitles] = useState<Subtitle[]>([])
  const [effects, setEffects] = useState({
    filter: "none",
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0
  })
  const [transitions, setTransitions] = useState({
    type: "fade",
    duration: 0.5
  })
  const [settings, setSettings] = useState<VideoSettingsType>({
    title: "",
    description: "",
    visibility: "public",
    allowComments: true,
    allowDownloads: false,
    category: "entertainment",
    tags: []
  })

  const handleGenerate = async (prompt: string, style: string) => {
    try {
      setIsGenerating(true)
      setActiveTab("progress")

      const videoService = VideoService.getInstance()
      const videoId = await videoService.generateVideo({
        templateId: selectedTemplate?.id,
        title: settings.title || "Untitled Video",
        description: settings.description,
        style,
        prompt
      })

      // Poll for progress
      const progressInterval = setInterval(async () => {
        const progress = videoService.getVideoProgress(videoId)
        if (progress) {
          setGenerationProgress(progress.progress)
          setCurrentStep(progress.step)

          if (progress.status === "completed") {
            clearInterval(progressInterval)
            setIsGenerating(false)
            setVideoUrl(`/videos/${videoId}`)
            setActiveTab("editor")
            onComplete?.(videoId)
            toast.success("Video generated successfully!")
          } else if (progress.status === "error") {
            clearInterval(progressInterval)
            setIsGenerating(false)
            toast.error(progress.error || "Failed to generate video")
          }
        }
      }, 1000)
    } catch (error) {
      setIsGenerating(false)
      toast.error("Failed to generate video")
    }
  }

  const handleTemplateSelect = (template: VideoTemplate) => {
    setSelectedTemplate(template)
    setActiveTab("prompt")
  }

  const handleSettingsUpdate = (newSettings: VideoSettingsType) => {
    setSettings(newSettings)
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="prompt">Prompt</TabsTrigger>
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-6">
          <VideoTemplates
            templates={[]} // TODO: Load templates from API
            selectedTemplate={selectedTemplate}
            onSelect={handleTemplateSelect}
          />
        </TabsContent>

        <TabsContent value="prompt" className="space-y-6">
          <VideoPrompt
            onGenerate={handleGenerate}
            isLoading={isGenerating}
          />
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <GenerationProgress
            progress={generationProgress}
            step={currentStep}
          />
        </TabsContent>

        <TabsContent value="editor" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6">
              <VideoEditor
                videoUrl={videoUrl}
                onSave={() => toast.success("Changes saved")}
              />
              <VideoTimeline
                clips={clips}
                currentTime={0}
                duration={0}
                isPlaying={false}
                onClipsChange={setClips}
                onTimeChange={() => {}}
                onPlayPause={() => {}}
                onSplit={() => {}}
                onAddClip={() => {}}
              />
            </div>
            <div className="space-y-6">
              <VideoAudio
                tracks={audioTracks}
                onTracksChange={setAudioTracks}
                onAddTrack={() => {}}
                onRemoveTrack={() => {}}
              />
              <VideoEffects
                onEffectChange={setEffects}
                onTransitionChange={setTransitions}
              />
              <VideoSubtitles
                subtitles={subtitles}
                onSubtitlesChange={setSubtitles}
                onAutoGenerate={() => {}}
                onImport={() => {}}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <VideoSettings
              {...settings}
              onUpdate={handleSettingsUpdate}
            />
            <VideoThumbnail
              thumbnailUrl=""
              onThumbnailChange={() => {}}
              onCaptureFrame={() => {}}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 