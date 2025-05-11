import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2 } from "lucide-react"

interface Subtitle {
  id: string
  startTime: string
  endTime: string
  text: string
  language: string
}

interface VideoSubtitlesProps {
  subtitles: Subtitle[]
  onSubtitlesChange: (subtitles: Subtitle[]) => void
  onAutoGenerate: () => void
  onImport: () => void
}

export function VideoSubtitles({
  subtitles,
  onSubtitlesChange,
  onAutoGenerate,
  onImport
}: VideoSubtitlesProps) {
  const handleSubtitleChange = (
    id: string,
    field: keyof Omit<Subtitle, "id">,
    value: string
  ) => {
    onSubtitlesChange(
      subtitles.map((subtitle) =>
        subtitle.id === id
          ? {
              ...subtitle,
              [field]: value
            }
          : subtitle
      )
    )
  }

  const handleAddSubtitle = () => {
    onSubtitlesChange([
      ...subtitles,
      {
        id: Math.random().toString(36).substring(7),
        startTime: "00:00:00",
        endTime: "00:00:05",
        text: "",
        language: "en"
      }
    ])
  }

  const handleRemoveSubtitle = (id: string) => {
    onSubtitlesChange(subtitles.filter((subtitle) => subtitle.id !== id))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Video Subtitles</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Button onClick={onAutoGenerate}>
              Auto Generate
            </Button>
            <Button variant="outline" onClick={onImport}>
              Import SRT
            </Button>
          </div>

          {subtitles.map((subtitle) => (
            <Card key={subtitle.id}>
              <CardContent className="pt-6">
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Time</Label>
                      <Input
                        type="text"
                        value={subtitle.startTime}
                        onChange={(e) =>
                          handleSubtitleChange(subtitle.id, "startTime", e.target.value)
                        }
                        placeholder="00:00:00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>End Time</Label>
                      <Input
                        type="text"
                        value={subtitle.endTime}
                        onChange={(e) =>
                          handleSubtitleChange(subtitle.id, "endTime", e.target.value)
                        }
                        placeholder="00:00:05"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Text</Label>
                    <Textarea
                      value={subtitle.text}
                      onChange={(e) =>
                        handleSubtitleChange(subtitle.id, "text", e.target.value)
                      }
                      placeholder="Enter subtitle text..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Select
                      value={subtitle.language}
                      onValueChange={(value) =>
                        handleSubtitleChange(subtitle.id, "language", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="it">Italian</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveSubtitle(subtitle.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button
            variant="outline"
            className="w-full"
            onClick={handleAddSubtitle}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Subtitle
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 