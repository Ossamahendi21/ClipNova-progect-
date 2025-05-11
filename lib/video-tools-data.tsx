import { Music, Mic, Bot, Youtube, Instagram, Podcast, FileText, Subtitles, HelpCircle, Video } from "lucide-react";
import { VideoTool } from "@/types/video";
import { ReactNode } from "react";

export const videoTools: VideoTool[] = [
  {
    id: "tiktok",
    name: "TikTok Video Generator",
    icon: <Music />,
    status: "beta",
    description: "Turn text into trendy, viral TikTok videos in a snap.",
  },
  {
    id: "caption",
    name: "Add Caption to Video",
    icon: <Subtitles />,
    description: "Generate subtitles in 100+ languages with AI captions.",
  },
  {
    id: "youtube-clip",
    name: "YouTube Clip Maker",
    icon: <Youtube />,
    description: "Convert YouTube videos into bite-sized snackable content.",
  },
  {
    id: "talking-avatar",
    name: "AI Talking Avatar",
    icon: <Bot />,
    status: "new",
    description: "Create lifelike talking avatars from text in seconds.",
  },
  {
    id: "music-to-video",
    name: "Music to Video",
    icon: <Music />,
    description: "Transform your music into cinematic music videos.",
  },
  {
    id: "explainer",
    name: "Explainer Video Maker",
    icon: <Video />,
    description: "Create professional explainer videos in minutes.",
  },
  {
    id: "product-demo",
    name: "Product Demo Generator",
    icon: <FileText />,
    description: "Create product demonstration videos to showcase your product.",
  },
  {
    id: "instagram-story",
    name: "Instagram Story Maker",
    icon: <Instagram />,
    description: "Create eye-catching Instagram Stories with AI.",
  },
  {
    id: "quiz",
    name: "Quiz Video Maker",
    icon: <HelpCircle />,
    description: "Create dynamic video quizzes that challenge viewers.",
  },
  {
    id: "podcast",
    name: "Podcast to Video",
    icon: <Podcast />,
    description: "Transform your podcasts into visually engaging video content.",
  },
];