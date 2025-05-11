import { useState, useEffect } from "react"
import { Video } from "@/types/video"

interface VideoFilters {
  status: string
  sortBy: string
  search: string
}

export function useVideoFilters() {
  const [filters, setFilters] = useState<VideoFilters>({
    status: "all",
    sortBy: "newest",
    search: ""
  })
  const [videos, setVideos] = useState<Video[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetchVideos()
  }, [filters])

  const fetchVideos = async () => {
    try {
      setIsLoading(true)
      const searchParams = new URLSearchParams({
        status: filters.status,
        sortBy: filters.sortBy,
        search: filters.search
      })

      const response = await fetch(`/api/videos?${searchParams}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch videos")
      }

      setVideos(data.videos)
    } catch (err) {
      setError(err as Error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateFilters = (newFilters: Partial<VideoFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters
    }))
  }

  return {
    filters,
    videos,
    isLoading,
    error,
    updateFilters,
    refetch: fetchVideos
  }
} 