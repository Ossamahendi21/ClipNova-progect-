"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { VideoPreview } from "@/components/create/video-preview"
import { VideoAnalytics } from "@/components/create/video-analytics"
import { VideoComments } from "@/components/create/video-comments"
import { VideoService } from "@/lib/services/video-service"
import { Video } from "@/types/video"
import { toast } from "sonner"

export default function VideoPage() {
  const params = useParams()
  const [video, setVideo] = useState<Video>()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadVideo = async () => {
      try {
        const videoService = VideoService.getInstance()
        const metadata = await videoService.getVideoMetadata(params.id as string)
        setVideo(metadata)
      } catch (error) {
        toast.error("Failed to load video")
      } finally {
        setIsLoading(false)
      }
    }

    loadVideo()
  }, [params.id])

  const handleDelete = async () => {
    try {
      const videoService = VideoService.getInstance()
      await videoService.deleteVideo(params.id as string)
      toast.success("Video deleted successfully")
      // Redirect to videos list
      window.location.href = "/videos"
    } catch (error) {
      toast.error("Failed to delete video")
    }
  }

  const handleShare = () => {
    // TODO: Implement share functionality
    toast.info("Share functionality coming soon")
  }

  const handleDownload = () => {
    // TODO: Implement download functionality
    toast.info("Download functionality coming soon")
  }

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-1/3 bg-muted rounded" />
          <div className="h-[400px] bg-muted rounded" />
        </div>
      </div>
    )
  }

  if (!video) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Video Not Found</h1>
          <p className="text-muted-foreground mt-2">
            The video you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <VideoPreview
            videoUrl={`/videos/${video.id}`}
            title={video.title}
            duration={video.duration}
            createdAt={video.createdAt}
            onDelete={handleDelete}
            onShare={handleShare}
            onDownload={handleDownload}
          />

          <VideoAnalytics
            videoId={video.id}
            views={1234}
            likes={567}
            shares={89}
            watchTime={45}
            engagementData={{
              labels: ["Likes", "Comments", "Shares", "Saves"],
              data: [567, 123, 89, 45]
            }}
            viewsData={{
              labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
              data: [150, 230, 180, 290, 200, 250, 300]
            }}
            demographicsData={{
              labels: ["18-24", "25-34", "35-44", "45-54", "55+"],
              data: [30, 40, 15, 10, 5]
            }}
          />
        </div>

        <div className="space-y-8">
          <VideoComments
            videoId={video.id}
            comments={[
              {
                id: "1",
                user: {
                  name: "John Doe",
                  avatar: "/avatars/john.jpg"
                },
                content: "Great video! Really enjoyed the content.",
                likes: 12,
                replies: 3,
                createdAt: new Date().toISOString(),
                isLiked: false
              }
            ]}
            onAddComment={(content) => {
              // TODO: Implement comment functionality
              toast.info("Comment functionality coming soon")
            }}
            onLikeComment={(commentId) => {
              // TODO: Implement like functionality
              toast.info("Like functionality coming soon")
            }}
            onReportComment={(commentId) => {
              // TODO: Implement report functionality
              toast.info("Report functionality coming soon")
            }}
          />
        </div>
      </div>
    </div>
  )
} 