import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

interface VideoEffectsProps {
  onEffectChange: (effects: {
    filter: string
    brightness: number
    contrast: number
    saturation: number
    blur: number
  }) => void
  onTransitionChange: (transitions: {
    type: string
    duration: number
  }) => void
}

const FILTERS = [
  { value: "none", label: "None" },
  { value: "grayscale", label: "Grayscale" },
  { value: "sepia", label: "Sepia" },
  { value: "vintage", label: "Vintage" },
  { value: "noir", label: "Noir" }
]

const TRANSITIONS = [
  { value: "fade", label: "Fade" },
  { value: "slide", label: "Slide" },
  { value: "zoom", label: "Zoom" },
  { value: "wipe", label: "Wipe" }
]

export function VideoEffects({
  onEffectChange,
  onTransitionChange
}: VideoEffectsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Video Effects</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Adjust the look and feel of your video
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Filter</label>
          <Select
            defaultValue="none"
            onValueChange={(value) =>
              onEffectChange({
                filter: value,
                brightness: 100,
                contrast: 100,
                saturation: 100,
                blur: 0
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a filter" />
            </SelectTrigger>
            <SelectContent>
              {FILTERS.map((filter) => (
                <SelectItem
                  key={filter.value}
                  value={filter.value}
                >
                  {filter.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Brightness</label>
          <Slider
            defaultValue={[100]}
            max={200}
            step={1}
            onValueChange={([value]) =>
              onEffectChange({
                filter: "none",
                brightness: value,
                contrast: 100,
                saturation: 100,
                blur: 0
              })
            }
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Contrast</label>
          <Slider
            defaultValue={[100]}
            max={200}
            step={1}
            onValueChange={([value]) =>
              onEffectChange({
                filter: "none",
                brightness: 100,
                contrast: value,
                saturation: 100,
                blur: 0
              })
            }
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Saturation</label>
          <Slider
            defaultValue={[100]}
            max={200}
            step={1}
            onValueChange={([value]) =>
              onEffectChange({
                filter: "none",
                brightness: 100,
                contrast: 100,
                saturation: value,
                blur: 0
              })
            }
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Blur</label>
          <Slider
            defaultValue={[0]}
            max={10}
            step={0.1}
            onValueChange={([value]) =>
              onEffectChange({
                filter: "none",
                brightness: 100,
                contrast: 100,
                saturation: 100,
                blur: value
              })
            }
          />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Transitions</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Add smooth transitions between clips
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Transition Type</label>
          <Select
            defaultValue="fade"
            onValueChange={(value) =>
              onTransitionChange({
                type: value,
                duration: 0.5
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a transition" />
            </SelectTrigger>
            <SelectContent>
              {TRANSITIONS.map((transition) => (
                <SelectItem
                  key={transition.value}
                  value={transition.value}
                >
                  {transition.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Duration (seconds)</label>
          <Slider
            defaultValue={[0.5]}
            min={0.1}
            max={2}
            step={0.1}
            onValueChange={([value]) =>
              onTransitionChange({
                type: "fade",
                duration: value
              })
            }
          />
        </div>
      </div>
    </div>
  )
} 