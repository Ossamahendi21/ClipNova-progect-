import { NextResponse } from "next/server"
import { VideoService } from "@/lib/services/video-service"

interface RouteParams {
  params: {
    videoId: string
  }
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const videoService = VideoService.getInstance()
    const video = await videoService.getVideoMetadata(params.videoId)

    return NextResponse.json({ video })
  } catch (error) {
    console.error("Error getting video:", error)
    return NextResponse.json(
      { error: "Failed to get video" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const videoService = VideoService.getInstance()
    await videoService.deleteVideo(params.videoId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting video:", error)
    return NextResponse.json(
      { error: "Failed to delete video" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const body = await request.json()
    const { title, description } = body

    const videoService = VideoService.getInstance()
    const video = await videoService.getVideoMetadata(params.videoId)

    // TODO: Implement video metadata update

    return NextResponse.json({ video })
  } catch (error) {
    console.error("Error updating video:", error)
    return NextResponse.json(
      { error: "Failed to update video" },
      { status: 500 }
    )
  }
} 