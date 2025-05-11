import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface VideoSettingsProps {
  title: string
  description: string
  visibility: "public" | "private" | "unlisted"
  allowComments: boolean
  allowDownloads: boolean
  category: string
  tags: string[]
  onUpdate: (settings: VideoSettings) => void
}

export interface VideoSettings {
  title: string
  description: string
  visibility: "public" | "private" | "unlisted"
  allowComments: boolean
  allowDownloads: boolean
  category: string
  tags: string[]
}

export function VideoSettings({
  title,
  description,
  visibility,
  allowComments,
  allowDownloads,
  category,
  tags,
  onUpdate
}: VideoSettingsProps) {
  const handleChange = (field: keyof VideoSettings, value: any) => {
    onUpdate({
      title,
      description,
      visibility,
      allowComments,
      allowDownloads,
      category,
      tags,
      [field]: value
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Video Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Enter video title"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Enter video description"
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label>Visibility</Label>
          <Select
            value={visibility}
            onValueChange={(value: "public" | "private" | "unlisted") =>
              handleChange("visibility", value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="private">Private</SelectItem>
              <SelectItem value="unlisted">Unlisted</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Category</Label>
          <Select
            value={category}
            onValueChange={(value) => handleChange("category", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="entertainment">Entertainment</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="music">Music</SelectItem>
              <SelectItem value="gaming">Gaming</SelectItem>
              <SelectItem value="sports">Sports</SelectItem>
              <SelectItem value="technology">Technology</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Tags</Label>
          <Input
            value={tags.join(", ")}
            onChange={(e) =>
              handleChange(
                "tags",
                e.target.value.split(",").map((tag) => tag.trim())
              )
            }
            placeholder="Enter tags separated by commas"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="comments">Allow Comments</Label>
            <Switch
              id="comments"
              checked={allowComments}
              onCheckedChange={(checked) =>
                handleChange("allowComments", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="downloads">Allow Downloads</Label>
            <Switch
              id="downloads"
              checked={allowDownloads}
              onCheckedChange={(checked) =>
                handleChange("allowDownloads", checked)
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 