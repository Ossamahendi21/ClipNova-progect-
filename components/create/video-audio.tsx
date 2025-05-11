import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Volume2, Music, Mic, Upload, X } from "lucide-react"

interface AudioTrack {
  id: string
  name: string
  type: "main" | "background" | "voiceover"
  volume: number
  muted: boolean
  file?: File
}

interface VideoAudioProps {
  tracks: AudioTrack[]
  onTracksChange: (tracks: AudioTrack[]) => void
  onAddTrack: (type: AudioTrack["type"], file: File) => void
  onRemoveTrack: (id: string) => void
}

export function VideoAudio({
  tracks,
  onTracksChange,
  onAddTrack,
  onRemoveTrack
}: VideoAudioProps) {
  const handleVolumeChange = (id: string, volume: number) => {
    const updatedTracks = tracks.map((track) =>
      track.id === id ? { ...track, volume } : track
    )
    onTracksChange(updatedTracks)
  }

  const handleMuteToggle = (id: string) => {
    const updatedTracks = tracks.map((track) =>
      track.id === id ? { ...track, muted: !track.muted } : track
    )
    onTracksChange(updatedTracks)
  }

  const handleFileChange = (type: AudioTrack["type"], e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onAddTrack(type, file)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Audio Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Audio Track */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              Main Audio
            </Label>
            {tracks.find((track) => track.type === "main") && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onRemoveTrack(tracks.find((t) => t.type === "main")!.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {tracks.find((track) => track.type === "main") ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Switch
                  checked={!tracks.find((t) => t.type === "main")?.muted}
                  onCheckedChange={() =>
                    handleMuteToggle(tracks.find((t) => t.type === "main")!.id)
                  }
                />
                <span className="text-sm">
                  {tracks.find((t) => t.type === "main")?.name}
                </span>
              </div>
              <Slider
                value={[tracks.find((t) => t.type === "main")?.volume || 100]}
                min={0}
                max={100}
                step={1}
                onValueChange={([value]) =>
                  handleVolumeChange(tracks.find((t) => t.type === "main")!.id, value)
                }
              />
            </div>
          ) : (
            <div>
              <input
                type="file"
                id="main-audio"
                className="hidden"
                accept="audio/*"
                onChange={(e) => handleFileChange("main", e)}
              />
              <Button
                variant="outline"
                className="w-full"
                onClick={() => document.getElementById("main-audio")?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Main Audio
              </Button>
            </div>
          )}
        </div>

        {/* Background Music */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Music className="h-4 w-4" />
              Background Music
            </Label>
            {tracks.find((track) => track.type === "background") && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() =>
                  onRemoveTrack(tracks.find((t) => t.type === "background")!.id)
                }
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {tracks.find((track) => track.type === "background") ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Switch
                  checked={!tracks.find((t) => t.type === "background")?.muted}
                  onCheckedChange={() =>
                    handleMuteToggle(tracks.find((t) => t.type === "background")!.id)
                  }
                />
                <span className="text-sm">
                  {tracks.find((t) => t.type === "background")?.name}
                </span>
              </div>
              <Slider
                value={[tracks.find((t) => t.type === "background")?.volume || 50]}
                min={0}
                max={100}
                step={1}
                onValueChange={([value]) =>
                  handleVolumeChange(
                    tracks.find((t) => t.type === "background")!.id,
                    value
                  )
                }
              />
            </div>
          ) : (
            <div>
              <input
                type="file"
                id="background-audio"
                className="hidden"
                accept="audio/*"
                onChange={(e) => handleFileChange("background", e)}
              />
              <Button
                variant="outline"
                className="w-full"
                onClick={() => document.getElementById("background-audio")?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Add Background Music
              </Button>
            </div>
          )}
        </div>

        {/* Voiceover */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Mic className="h-4 w-4" />
              Voiceover
            </Label>
            {tracks.find((track) => track.type === "voiceover") && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() =>
                  onRemoveTrack(tracks.find((t) => t.type === "voiceover")!.id)
                }
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {tracks.find((track) => track.type === "voiceover") ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Switch
                  checked={!tracks.find((t) => t.type === "voiceover")?.muted}
                  onCheckedChange={() =>
                    handleMuteToggle(tracks.find((t) => t.type === "voiceover")!.id)
                  }
                />
                <span className="text-sm">
                  {tracks.find((t) => t.type === "voiceover")?.name}
                </span>
              </div>
              <Slider
                value={[tracks.find((t) => t.type === "voiceover")?.volume || 75]}
                min={0}
                max={100}
                step={1}
                onValueChange={([value]) =>
                  handleVolumeChange(
                    tracks.find((t) => t.type === "voiceover")!.id,
                    value
                  )
                }
              />
            </div>
          ) : (
            <div>
              <input
                type="file"
                id="voiceover-audio"
                className="hidden"
                accept="audio/*"
                onChange={(e) => handleFileChange("voiceover", e)}
              />
              <Button
                variant="outline"
                className="w-full"
                onClick={() => document.getElementById("voiceover-audio")?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Add Voiceover
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 