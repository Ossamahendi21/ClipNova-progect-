"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Clock, Star } from "lucide-react"
import { useState } from "react"

interface VideoTemplateCardProps {
  id: number
  title: string
  description: string
  thumbnail: string
  duration: string
  selected?: boolean
  onSelect?: () => void
}

const PLACEHOLDER_URL = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"

export function VideoTemplateCard({
  title,
  description,
  thumbnail,
  duration,
  selected,
  onSelect
}: VideoTemplateCardProps) {
  const [imgError, setImgError] = useState(false)
  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-lg",
        selected && "ring-2 ring-primary"
      )}
      onClick={onSelect}
    >
      <div className="relative aspect-video">
        <img
          src={imgError || !thumbnail ? PLACEHOLDER_URL : thumbnail}
          alt={title}
          className="object-cover w-full h-full rounded-t-lg"
          onError={() => setImgError(true)}
        />
        <div className="absolute bottom-2 right-2 bg-black/75 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {duration}
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold line-clamp-1">{title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
          {description}
        </p>
      </CardContent>
    </Card>
  )
}
