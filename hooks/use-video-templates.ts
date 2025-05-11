import { useState, useEffect } from "react"
import { VideoTemplate } from "@/types/video"

export function useVideoTemplates() {
  const [templates, setTemplates] = useState<VideoTemplate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/templates")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch templates")
      }

      setTemplates(data.templates)
    } catch (err) {
      setError(err as Error)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    templates,
    isLoading,
    error,
    refetch: fetchTemplates
  }
} 