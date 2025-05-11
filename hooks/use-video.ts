import { useState, useEffect } from "react"
import { VideoService } from "@/lib/services/video-service"
import { Video, VideoTemplate } from "@/types/video"

interface UseVideoOptions {
  videoId?: string
  templateId?: string
}

export function useVideo({ videoId, templateId }: UseVideoOptions = {}) {
  const [video, setVideo] = useState<Video | null>(null)
  const [template, setTemplate] = useState<VideoTemplate | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (videoId) {
      fetchVideo()
    }
    if (templateId) {
      fetchTemplate()
    }
  }, [videoId, templateId])

  const fetchVideo = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/videos/${videoId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch video")
      }

      setVideo(data.video)
    } catch (err) {
      setError(err as Error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchTemplate = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/templates")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch templates")
      }

      const selectedTemplate = data.templates.find(
        (t: VideoTemplate) => t.id === templateId
      )
      setTemplate(selectedTemplate || null)
    } catch (err) {
      setError(err as Error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateVideo = async (params: {
    title: string
    description: string
    style: string
    prompt: string
  }) => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/videos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...params,
          templateId
        })
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate video")
      }

      return data.videoId
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const deleteVideo = async () => {
    if (!videoId) return

    try {
      setIsLoading(true)
      const response = await fetch(`/api/videos/${videoId}`, {
        method: "DELETE"
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete video")
      }
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const updateVideo = async (params: {
    title?: string
    description?: string
  }) => {
    if (!videoId) return

    try {
      setIsLoading(true)
      const response = await fetch(`/api/videos/${videoId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update video")
      }

      setVideo(data.video)
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    video,
    template,
    isLoading,
    error,
    generateVideo,
    deleteVideo,
    updateVideo
  }
} 