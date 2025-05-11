import { VideoTemplate, TemplateCategory } from "@/types/video"

export const videoTemplates: VideoTemplate[] = [
  {
    id: "1",
    name: "Startup Promo",
    description: "Dynamic promo for startups and tech products. Modern transitions and bold text.",
    thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80",
    duration: 30,
    category: "marketing",
    tags: ["startup", "promo", "tech", "modern"],
    createdAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "2",
    name: "Instagram Story",
    description: "Trendy vertical video for Instagram stories. Fast cuts and vibrant overlays.",
    thumbnail: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80",
    duration: 15,
    category: "social",
    tags: ["instagram", "story", "vertical", "trendy"],
    createdAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "3",
    name: "Explainer Animation",
    description: "Animated explainer for products or services. Clean graphics and smooth motion.",
    thumbnail: "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=400&q=80",
    duration: 60,
    category: "education",
    tags: ["explainer", "animation", "product", "service"],
    createdAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "4",
    name: "Corporate Slideshow",
    description: "Professional slideshow for business presentations. Elegant transitions and branding.",
    thumbnail: "https://images.unsplash.com/photo-1454023492550-5696f8ff10e1?auto=format&fit=crop&w=400&q=80",
    duration: 45,
    category: "business",
    tags: ["corporate", "slideshow", "business", "presentation"],
    createdAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "5",
    name: "Vlog Opener",
    description: "Catchy opener for personal vlogs. Energetic music and quick cuts.",
    thumbnail: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    duration: 20,
    category: "personal",
    tags: ["vlog", "opener", "personal", "lifestyle"],
    createdAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "6",
    name: "Reel Highlights",
    description: "Showcase your best moments with this fast-paced reel template.",
    thumbnail: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    duration: 30,
    category: "social",
    tags: ["reel", "highlights", "showcase", "fast"],
    createdAt: "2024-01-01T00:00:00Z"
  }
]

export function getTemplatesByCategory(category: TemplateCategory): VideoTemplate[] {
  if (category === "all") {
    return videoTemplates
  }
  return videoTemplates.filter(template => template.category === category)
}

export function getTemplateById(id: string): VideoTemplate | undefined {
  return videoTemplates.find(template => template.id === id)
}

export function searchTemplates(query: string): VideoTemplate[] {
  const searchQuery = query.toLowerCase()
  return videoTemplates.filter(
    template =>
      template.name.toLowerCase().includes(searchQuery) ||
      template.description.toLowerCase().includes(searchQuery) ||
      template.tags?.some(tag => tag.toLowerCase().includes(searchQuery))
  )
}
