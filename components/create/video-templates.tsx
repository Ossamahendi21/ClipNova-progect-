import { VideoTemplate } from "@/types/video"
import { formatDuration } from "@/lib/utils"

interface VideoTemplatesProps {
  templates: VideoTemplate[]
  selectedTemplate?: VideoTemplate
  onSelect: (template: VideoTemplate) => void
}

export function VideoTemplates({
  templates,
  selectedTemplate,
  onSelect
}: VideoTemplatesProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Choose a Template</h2>
        <p className="text-muted-foreground mt-1">
          Select a template to get started with your video
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`group relative cursor-pointer overflow-hidden rounded-lg border bg-card text-card-foreground shadow transition-all hover:shadow-md ${
              selectedTemplate?.id === template.id
                ? "border-primary"
                : "border-border"
            }`}
            onClick={() => onSelect(template)}
          >
            <div className="aspect-video overflow-hidden">
              <img
                src={template.thumbnail}
                alt={template.name}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs text-white">
                {formatDuration(template.duration)}
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-semibold">{template.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {template.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {template.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {templates.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold">No templates available</h3>
          <p className="text-muted-foreground mt-2">
            Check back later for new templates
          </p>
        </div>
      )}
    </div>
  )
} 