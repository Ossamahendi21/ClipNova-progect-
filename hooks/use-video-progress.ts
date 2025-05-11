import { useState, useEffect } from "react"

interface VideoProgress {
  progress: number
  step: string
  status: "processing" | "completed" | "error"
  error?: string
}

export function useVideoProgress(videoId?: string) {
  const [progress, setProgress] = useState<VideoProgress | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!videoId) return

    const fetchProgress = async () => {
      try {
        const response = await fetch(`/api/videos/${videoId}/progress`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch progress")
        }

        setProgress(data.progress)
      } catch (err) {
        setError(err as Error)
      } finally {
        setIsLoading(false)
      }
    }

    const interval = setInterval(fetchProgress, 1000)
    fetchProgress()

    return () => clearInterval(interval)
  }, [videoId])

  return {
    progress,
    isLoading,
    error
  }
} 