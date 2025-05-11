"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { VideoCard } from "@/components/create/video-card"
import { VideoFilters } from "@/components/create/video-filters"
import { VideoService } from "@/lib/services/video-service"
import { Video } from "@/types/video"
import { toast } from "sonner"

export default function VideosPage() {
  const router = useRouter()
  const [videos, setVideos] = useState<Video[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: "all",
    sortBy: "newest",
    search: ""
  })

  useEffect(() => {
    const loadVideos = async () => {
      try {
        const videoService = VideoService.getInstance()
        const list = await videoService.listVideos(filters)
        setVideos(list)
      } catch (error) {
        toast.error("Failed to load videos")
      } finally {
        setIsLoading(false)
      }
    }

    loadVideos()
  }, [filters])

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters)
  }

  const handleVideoClick = (videoId: string) => {
    router.push(`/videos/${videoId}`)
  }

  const handleCreateVideo = () => {
    router.push("/create")
  }

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse space-y-4">
              <div className="aspect-video bg-muted rounded" />
              <div className="h-4 w-3/4 bg-muted rounded" />
              <div className="h-4 w-1/2 bg-muted rounded" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Videos</h1>
          <p className="text-muted-foreground mt-2">
            Manage and track your video content
          </p>
        </div>
        <button
          onClick={handleCreateVideo}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
        >
          Create New Video
        </button>
      </div>

      <VideoFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        totalVideos={videos.length}
      />

      {videos.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold">No videos found</h2>
          <p className="text-muted-foreground mt-2">
            {filters.search
              ? "Try adjusting your search filters"
              : "Create your first video to get started"}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onClick={() => handleVideoClick(video.id)}
              onDelete={async () => {
                try {
                  const videoService = VideoService.getInstance()
                  await videoService.deleteVideo(video.id)
                  setVideos((videos) =>
                    videos.filter((v) => v.id !== video.id)
                  )
                  toast.success("Video deleted successfully")
                } catch (error) {
                  toast.error("Failed to delete video")
                }
              }}
              onShare={() => {
                // TODO: Implement share functionality
                toast.info("Share functionality coming soon")
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
} 