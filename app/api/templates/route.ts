import { NextResponse } from "next/server"
import { VideoService } from "@/lib/services/video-service"

export async function GET() {
  try {
    const videoService = VideoService.getInstance()
    const templates = await videoService.getTemplates()

    return NextResponse.json({ templates })
  } catch (error) {
    console.error("Error getting templates:", error)
    return NextResponse.json(
      { error: "Failed to get templates" },
      { status: 500 }
    )
  }
} 