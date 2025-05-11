import { NextResponse } from "next/server"
import { VideoService } from "@/lib/services/video-service"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, style, prompt, templateId } = body

    const videoService = VideoService.getInstance()
    const videoId = await videoService.generateVideo({
      title,
      description,
      style,
      prompt,
      templateId
    })

    return NextResponse.json({ videoId })
  } catch (error) {
    console.error("Error generating video:", error)
    return NextResponse.json(
      { error: "Failed to generate video" },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const sortBy = searchParams.get("sortBy")
    const search = searchParams.get("search")

    const videoService = VideoService.getInstance()
    const videos = await videoService.listVideos({
      status: status || "all",
      sortBy: sortBy || "newest",
      search: search || ""
    })

    return NextResponse.json({ videos })
  } catch (error) {
    console.error("Error listing videos:", error)
    return NextResponse.json(
      { error: "Failed to list videos" },
      { status: 500 }
    )
  }
} 