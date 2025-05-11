export type TemplateCategory = "all" | "social" | "marketing" | "education" | "business" | "personal"

export interface VideoTemplate {
  id: string
  name: string
  description: string
  thumbnail: string
  duration: number
  category: string
  tags: string[]
  createdAt: string
}

export interface Video {
  id: string
  title: string
  description: string
  thumbnail: string
  duration: number
  createdAt: string
  status: "processing" | "completed" | "error" | "published" | "draft"
  views: number
  likes: number
  shares: number
  templateId?: number
  style?: string
  mediaFiles?: string[]
  prompt?: string
  cloudStorageUrl?: string  // Main URL for the video in Cloudinary
  cloudStorageId?: string   // Public ID in Cloudinary
  storageSize?: number
  downloadUrl?: string      // URL for downloading the MP4 file
  streamingUrl?: string     // URL for streaming/embedding the video
}

export interface VideoTool {
  id: string;
  name: string;
  icon: React.ReactNode;
  status?: 'beta' | 'new';
  description: string;
}