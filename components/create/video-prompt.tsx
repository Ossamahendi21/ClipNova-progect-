import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"

interface VideoPromptProps {
  onGenerate: (prompt: string, style: string) => void
  isLoading: boolean
}

const STYLES = [
  {
    value: "cinematic",
    label: "Cinematic",
    description: "High-quality, movie-like visuals with dramatic lighting"
  },
  {
    value: "cartoon",
    label: "Cartoon",
    description: "Fun, animated style with vibrant colors"
  },
  {
    value: "documentary",
    label: "Documentary",
    description: "Realistic, educational style with clear visuals"
  },
  {
    value: "minimal",
    label: "Minimal",
    description: "Clean, simple style with focus on content"
  }
]

export function VideoPrompt({ onGenerate, isLoading }: VideoPromptProps) {
  const [prompt, setPrompt] = useState("")
  const [style, setStyle] = useState(STYLES[0].value)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (prompt.trim()) {
      onGenerate(prompt.trim(), style)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label
          htmlFor="prompt"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Video Prompt
        </label>
        <Textarea
          id="prompt"
          placeholder="Describe your video in detail..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[150px]"
          disabled={isLoading}
        />
        <p className="text-sm text-muted-foreground">
          Be specific about what you want to see in your video
        </p>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="style"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Video Style
        </label>
        <Select
          value={style}
          onValueChange={setStyle}
          disabled={isLoading}
        >
          <SelectTrigger id="style">
            <SelectValue placeholder="Select a style" />
          </SelectTrigger>
          <SelectContent>
            {STYLES.map((style) => (
              <SelectItem
                key={style.value}
                value={style.value}
              >
                <div className="space-y-1">
                  <p>{style.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {style.description}
                  </p>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        type="submit"
        disabled={!prompt.trim() || isLoading}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating Video...
          </>
        ) : (
          "Generate Video"
        )}
      </Button>
    </form>
  )
} 