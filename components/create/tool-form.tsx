"use client"

import { useState } from "react"
import { videoTools } from "@/lib/video-tools-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Upload, Mic, Play, Pause, Wand2, Globe, Check, X, Loader2, ChevronRight, Music, Video as VideoIcon, Image } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { VideoService } from "@/lib/services/video-service"
import { Video } from "@/types/video"
import { generateVideoFromImage, generateVideoWithText } from "@/lib/video-generator"

// Mock API response for languages
const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "zh", name: "Chinese" },
  { code: "ar", name: "Arabic" },
]

// Mock API response for avatar models
const AVATAR_MODELS = [
  { id: "realistic-male-1", name: "John (Realistic)", category: "realistic" },
  { id: "realistic-female-1", name: "Emma (Realistic)", category: "realistic" },
  { id: "realistic-male-2", name: "Michael (Realistic)", category: "realistic" },
  { id: "realistic-female-2", name: "Sophia (Realistic)", category: "realistic" },
  { id: "cartoon-male-1", name: "Max (Cartoon)", category: "cartoon" },
  { id: "cartoon-female-1", name: "Lily (Cartoon)", category: "cartoon" },
  { id: "anime-male-1", name: "Hiro (Anime)", category: "anime" },
  { id: "anime-female-1", name: "Yuki (Anime)", category: "anime" },
]

// AI generation presets
const AI_GENERATION_PRESETS = [
  { id: "default", name: "Default", category: "basic" },
  { id: "ghibli", name: "Ghibli Studio", category: "basic" },
  { id: "educational", name: "Educational", category: "basic", model: "ultra" },
  { id: "anime", name: "Anime", category: "basic" },
  { id: "realist", name: "Realist", category: "pro" },
  { id: "sketch-color", name: "Sketch Color", category: "pro" },
  { id: "sketch-bw", name: "Sketch B&W", category: "pro" },
  { id: "pixar", name: "Pixar", category: "pro" },
  { id: "japanese-ink", name: "Japanese Ink", category: "basic" },
  { id: "flat-animation", name: "Flat Animation", category: "pro" },
  { id: "3d-render", name: "3D Render", category: "basic" },
  { id: "lego", name: "Lego", category: "pro" },
  { id: "sci-fi", name: "Sci-Fi", category: "basic" },
  { id: "retro-cartoon", name: "Retro Cartoon", category: "basic" },
  { id: "pixel-art", name: "Pixel Art", category: "basic" },
  { id: "anime-realism", name: "Anime Realism", category: "pro" },
  { id: "fantasy", name: "Fantasy", category: "pro" },
  { id: "movie", name: "Movie", category: "pro" },
  { id: "stylized", name: "Stylized Illustration", category: "pro" },
  { id: "manga", name: "Manga", category: "pro" },
  { id: "technical", name: "Technical Drawing", category: "ultra" },
  { id: "creative", name: "Creative", category: "basic" },
  { id: "photography", name: "Photography", category: "basic" },
  { id: "raytraced", name: "Raytraced", category: "basic" },
  { id: "environment", name: "Environment", category: "basic" },
  { id: "illustration", name: "Illustration", category: "pro" },
]

// Background video options
const BACKGROUND_VIDEOS = [
  { id: "satisfying", name: "Satisfying", category: "general" },
  { id: "ugc", name: "UGC", category: "general" },
  { id: "subway-surfers", name: "Subway Surfers", category: "gameplay" },
  { id: "minecraft", name: "Minecraft", category: "gameplay" },
  { id: "fortnite", name: "Fortnite", category: "gameplay" },
  { id: "trackmania", name: "Trackmania", category: "gameplay" },
  { id: "space", name: "Space", category: "general" },
  { id: "nature", name: "Nature", category: "general" },
  { id: "city", name: "City", category: "general" },
  { id: "abstract", name: "Abstract", category: "general" },
]

// Mock API response for music tracks
const MUSIC_TRACKS = [
  { id: "upbeat-1", name: "Upbeat Energy", category: "upbeat", duration: "2:45" },
  { id: "upbeat-2", name: "Happy Vibes", category: "upbeat", duration: "3:12" },
  { id: "emotional-1", name: "Emotional Journey", category: "emotional", duration: "4:05" },
  { id: "emotional-2", name: "Deep Feelings", category: "emotional", duration: "3:38" },
  { id: "cinematic-1", name: "Epic Cinematic", category: "cinematic", duration: "2:55" },
  { id: "cinematic-2", name: "Dramatic Tension", category: "cinematic", duration: "3:22" },
  { id: "lofi-1", name: "Lofi Chill", category: "lofi", duration: "2:30" },
  { id: "lofi-2", name: "Lofi Study", category: "lofi", duration: "3:15" },
]

// Pexels API types
interface PexelsVideo {
  id: number
  width: number
  height: number
  url: string
  image: string
  duration: number
  video_files: {
    id: number
    quality: string
    file_type: string
    width: number
    height: number
    link: string
  }[]
}

interface PexelsSearchResult {
  page: number
  per_page: number
  total_results: number
  videos: PexelsVideo[]
}

// Common form states
interface FormState {
  isSubmitting: boolean
  isUploading: boolean
  progress: number
  isSearchingVideos: boolean
}

export function ToolForm({ toolId, onBack }: { toolId: string; onBack: () => void }) {
  const tool = videoTools.find(t => t.id === toolId)
  const router = useRouter()
  const [formState, setFormState] = useState<FormState>({
    isSubmitting: false,
    isUploading: false,
    progress: 0,
    isSearchingVideos: false
  })

  if (!tool) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormState({ ...formState, isSubmitting: true, progress: 0 })

    // Get the form element and extract data
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    const promptValue = formData.get("prompt") as string

    // Just simulate form submission - the TikTok case will handle video search in its own submit handler
    simulateFormSubmission()
  }

  // Helper function to save video to user's collection and cloud storage
  const saveVideoToCollection = async (videoData: any) => {
    try {
      console.log("=== SAVING VIDEO TO COLLECTION ===");
      console.log("Video data:", videoData);

      // Generate a truly unique ID for the video
      const timestamp = Date.now();
      const randomPart = Math.random().toString(36).substring(2, 15);
      const secondRandom = Math.random().toString(36).substring(2, 15);

      // Create a UUID-like format for better uniqueness
      const segments = [
        timestamp.toString(36),
        randomPart.substring(0, 4),
        '4' + randomPart.substring(0, 3), // Version 4 UUID-like
        secondRandom.substring(0, 4),
        timestamp.toString(36).substring(0, 12)
      ];

      const videoId = segments.join('-');
      console.log("Generated unique video ID:", videoId);

      // Generate a more descriptive title based on the prompt
      let generatedTitle = "TikTok Video";
      if (videoData.prompt) {
        // Extract first 5-7 words from prompt for title
        const promptWords = videoData.prompt.split(/\s+/);
        if (promptWords.length > 0) {
          const titleWords = promptWords.slice(0, Math.min(7, promptWords.length));
          generatedTitle = titleWords.join(" ");
          // Capitalize first letter and add ellipsis if truncated
          generatedTitle = generatedTitle.charAt(0).toUpperCase() + generatedTitle.slice(1);
          if (promptWords.length > 7) {
            generatedTitle += "...";
          }
        }
      }
      console.log("Generated title:", generatedTitle);

      // Create a new video object that matches the Video type
      const newVideo: Video = {
        id: videoId,
        title: generatedTitle,
        description: videoData.description || "",
        thumbnail: videoData.thumbnail || "/placeholder.svg",
        duration: videoData.duration || 30,
        createdAt: new Date().toISOString(),
        status: "processing", // Initial status is processing
        views: 0,
        likes: 0,
        shares: 0,
        style: videoData.style || "",
        prompt: videoData.prompt || "",
        templateId: videoData.templateId,
        // Add URL to Cloudinary storage
        cloudStorageUrl: `https://res.cloudinary.com/dmdjtvjvc/video/upload/tiktok_videos/${videoId}/${videoId}.mp4`,
        // Add download URL for MP4
        downloadUrl: `https://res.cloudinary.com/dmdjtvjvc/video/download/tiktok_videos/${videoId}/${videoId}.mp4`,
        // Add streaming URL for embedding
        streamingUrl: `https://res.cloudinary.com/dmdjtvjvc/video/stream/tiktok_videos/${videoId}/${videoId}.mp4`
      };

      console.log("Saving video to collection and Cloudinary storage:", newVideo);

      // Call the VideoService to save the video
      const videoService = VideoService.getInstance();

      // If we have a video file, upload it to cloud storage
      let videoFile: File | undefined;

      // Create a real video file using our video generator
      try {
        console.log("=== GENERATING VIDEO FILE ===");

        if (videoData.matchedVideos && videoData.matchedVideos.length > 0) {
          console.log("Creating video from matched video...");
          const matchedVideo = videoData.matchedVideos[0];
          console.log("Selected matched video:", matchedVideo);

          // Set the thumbnail to the matched video's image
          newVideo.thumbnail = matchedVideo.image;

          // Create an image from the matched video's thumbnail
          const response = await fetch(matchedVideo.image);
          const imageBlob = await response.blob();

          console.log(`Fetched image blob (${imageBlob.size} bytes) for video generation`);

          // Generate a video from the image
          videoFile = await generateVideoFromImage(
            imageBlob,
            videoData.duration || 10,
            newVideo.title
          );

          console.log(`Generated video file: ${videoFile.name}, size: ${videoFile.size} bytes, type: ${videoFile.type}`);
        } else {
          console.log("No matched videos available, creating a video with text...");

          // Generate a video with text
          videoFile = await generateVideoWithText(
            videoData.prompt || "TikTok Video",
            videoData.duration || 10,
            newVideo.title,
            videoData.style
          );

          console.log(`Generated text video file: ${videoFile.name}, size: ${videoFile.size} bytes, type: ${videoFile.type}`);

          // Create a thumbnail from the first frame
          const canvas = document.createElement('canvas');
          canvas.width = 640;
          canvas.height = 1280;
          const ctx = canvas.getContext('2d');

          if (ctx) {
            // Draw a gradient background for the thumbnail
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, '#3498db');
            gradient.addColorStop(1, '#2ecc71');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Add text
            ctx.fillStyle = 'white';
            ctx.font = 'bold 32px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(newVideo.title, canvas.width / 2, canvas.height / 2 - 50);
            ctx.font = '24px Arial';
            ctx.fillText(`Style: ${videoData.style || 'Default'}`, canvas.width / 2, canvas.height / 2 + 50);

            // Convert to data URL for the thumbnail
            newVideo.thumbnail = canvas.toDataURL('image/png');
          }
        }

        // Update the video object with file information
        newVideo.storageSize = videoFile.size;
        newVideo.duration = videoData.duration || 10;

        console.log("Video file generation completed successfully");
      } catch (videoGenError) {
        console.error("Error generating video file:", videoGenError);
        toast.error("Error generating video file. Please try again.");

        // Create a fallback image file if video generation fails
        try {
          console.log("Creating fallback image file...");

          const canvas = document.createElement('canvas');
          canvas.width = 640;
          canvas.height = 1280;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            throw new Error("Could not get canvas context");
          }

          // Draw a gradient background
          const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
          gradient.addColorStop(0, '#e74c3c');
          gradient.addColorStop(1, '#f39c12');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Add text
          ctx.fillStyle = 'white';
          ctx.font = 'bold 32px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('Video Generation Failed', canvas.width / 2, canvas.height / 2 - 100);
          ctx.font = '24px Arial';
          ctx.fillText(`Prompt: ${videoData.prompt?.substring(0, 30) || 'None'}...`, canvas.width / 2, canvas.height / 2);
          ctx.fillText(`Style: ${videoData.style || 'Default'}`, canvas.width / 2, canvas.height / 2 + 50);
          ctx.fillText(`Created: ${new Date().toLocaleString()}`, canvas.width / 2, canvas.height / 2 + 100);
          ctx.fillText('Using fallback image', canvas.width / 2, canvas.height / 2 + 150);

          // Convert canvas to blob
          const blob = await new Promise<Blob>((resolve) => {
            canvas.toBlob((blob) => {
              if (blob) {
                resolve(blob);
              } else {
                throw new Error("Could not create blob from canvas");
              }
            }, 'image/png');
          });

          // Create a File object from the blob
          videoFile = new File([blob], `${newVideo.title}.png`, { type: 'image/png' });

          // Also set this as the thumbnail
          newVideo.thumbnail = canvas.toDataURL('image/png');

          console.log(`Created fallback image file (${videoFile.size} bytes)`);
        } catch (fallbackError) {
          console.error("Error creating fallback file:", fallbackError);
        }
      }

      // Save the video with the file (if available)
      const savedVideoId = await videoService.saveVideo(newVideo, videoFile);

      // Store in localStorage for persistence between page refreshes
      try {
        console.log("=== SAVING VIDEO TO LOCAL STORAGE ===");

        // Get existing videos from localStorage
        const existingVideosJson = localStorage.getItem('userVideos') || '[]';
        console.log("Existing userVideos JSON:", existingVideosJson);

        let existingVideos = [];
        try {
          existingVideos = JSON.parse(existingVideosJson);
          console.log("Parsed existing userVideos:", existingVideos);
        } catch (parseError) {
          console.error("Error parsing userVideos:", parseError);
          existingVideos = [];
        }

        // Add the new video to the array
        existingVideos.unshift(newVideo); // Add to beginning for "Recent Videos"
        console.log("Updated userVideos array:", existingVideos);

        // Save back to localStorage
        localStorage.setItem('userVideos', JSON.stringify(existingVideos));
        console.log("Saved userVideos to localStorage");

        // Also save to "myVideos" collection for the dashboard
        const myVideosJson = localStorage.getItem('myVideos') || '[]';
        console.log("Existing myVideos JSON:", myVideosJson);

        let myVideos = [];
        try {
          myVideos = JSON.parse(myVideosJson);
          console.log("Parsed existing myVideos:", myVideos);
        } catch (parseError) {
          console.error("Error parsing myVideos:", parseError);
          myVideos = [];
        }

        myVideos.unshift(newVideo);
        console.log("Updated myVideos array:", myVideos);

        localStorage.setItem('myVideos', JSON.stringify(myVideos));
        console.log("Saved myVideos to localStorage");

        console.log(`Video saved to localStorage. Total userVideos: ${existingVideos.length}, Total myVideos: ${myVideos.length}`);

        // Show storage information
        toast.info(
          "Video saved to Cloudinary cloud storage. Your videos are safely stored in the cloud and accessible from anywhere."
        );
      } catch (storageError) {
        console.error("Error saving to localStorage:", storageError);
        // Continue even if localStorage fails
      }

      // After a short delay, update the status to "completed"
      setTimeout(() => {
        try {
          const existingVideosJson = localStorage.getItem('userVideos') || '[]';
          const existingVideos = JSON.parse(existingVideosJson);

          const updatedVideos = existingVideos.map((video: Video) => {
            if (video.id === videoId) {
              return { ...video, status: "completed" };
            }
            return video;
          });

          localStorage.setItem('userVideos', JSON.stringify(updatedVideos));

          // Also update in myVideos
          const myVideosJson = localStorage.getItem('myVideos') || '[]';
          const myVideos = JSON.parse(myVideosJson);

          const updatedMyVideos = myVideos.map((video: Video) => {
            if (video.id === videoId) {
              return { ...video, status: "completed" };
            }
            return video;
          });

          localStorage.setItem('myVideos', JSON.stringify(updatedMyVideos));

          console.log(`Video ${videoId} status updated to completed`);
        } catch (updateError) {
          console.error("Error updating video status:", updateError);
        }
      }, 5000);

      return savedVideoId;
    } catch (error) {
      console.error("Error saving video to collection:", error);
      throw error;
    }
  };

  /**
   * Process form submission and generate a video
   * This is a non-blocking implementation that ensures the UI remains responsive
   */
  const simulateFormSubmission = async () => {

    try {
      console.log("=== STARTING VIDEO GENERATION PROCESS ===");

      // Create a unique operation ID for tracking
      const operationId = `generate-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      console.log(`Operation ID: ${operationId}`);

      // Ensure we're not already submitting
      if (formState.isSubmitting) {
        console.log(`Form is already submitting, not starting another submission (${operationId})`);
        return;
      }

      // Get the VideoService instance
      const videoService = VideoService.getInstance();

      // Start progress tracking
      const progressInterval = setInterval(() => {
        setFormState(prev => {
          // Calculate a realistic progress value
          // This will increase faster at the beginning and slow down as it approaches 100%
          const progressIncrement = Math.max(1, 15 * (1 - prev.progress / 100));
          const newProgress = Math.min(prev.progress + progressIncrement * Math.random(), 95);
          return { ...prev, progress: newProgress };
        });
      }, 300);

      // Generate the video using the VideoService
      const videoId = await videoService.generateVideo({
        title: `TikTok Video - ${new Date().toLocaleDateString()}`,
        description: prompt,
        style: videoStyle,
        prompt: prompt
      });

      console.log(`Video generation started with ID: ${videoId} (${operationId})`);

      // Poll for progress updates
      const statusCheckInterval = setInterval(async () => {
        const progress = videoService.getVideoProgress(videoId);

        if (progress) {
          console.log(`Video generation progress: ${progress.progress}%, Step: ${progress.step} (${operationId})`);

          // Update the form state with the actual progress
          setFormState(prev => ({
            ...prev,
            progress: progress.progress
          }));

          // Check if the generation is complete or has failed
          if (progress.status === "completed") {
            console.log(`Video generation completed successfully (${operationId})`);
            clearInterval(statusCheckInterval);
            clearInterval(progressInterval);

            // Update form state
            setFormState({
              isSubmitting: false,
              isUploading: false,
              progress: 100,
              isSearchingVideos: false
            });

            // Show success message
            toast.success("Video generated successfully!", {
              duration: 5000,
              position: "top-center"
            });

            // Navigate to the dashboard with a query parameter to highlight the new video
            setTimeout(() => {
              router.push(`/dashboard?newVideo=${videoId}`);
            }, 1500);
          } else if (progress.status === "error") {
            console.error(`Video generation failed: ${progress.error} (${operationId})`);
            clearInterval(statusCheckInterval);
            clearInterval(progressInterval);

            // Update form state
            setFormState({
              isSubmitting: false,
              isUploading: false,
              progress: 0,
              isSearchingVideos: false
            });

            // Show error message
            toast.error(`Failed to generate video: ${progress.error || "Unknown error"}`, {
              duration: 5000
            });
          }
        }
      }, 1000);

      // Set a timeout to clear intervals if they're still running after 5 minutes
      setTimeout(() => {
        clearInterval(statusCheckInterval);
        clearInterval(progressInterval);

        // If we're still submitting after 5 minutes, something went wrong
        if (formState.isSubmitting) {
          console.error(`Video generation timed out after 5 minutes (${operationId})`);

          // Update form state
          setFormState({
            isSubmitting: false,
            isUploading: false,
            progress: 0,
            isSearchingVideos: false
          });

          // Show error message
          toast.error("Video generation timed out. Please try again.");
        }
      }, 5 * 60 * 1000); // 5 minutes
    } catch (error) {
      console.error("Error in video generation process:", error);

      // Update form state
      setFormState({
        isSubmitting: false,
        isUploading: false,
        progress: 0,
        isSearchingVideos: false
      });

      // Show error message
      toast.error(`Failed to generate video: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  // Define state variables outside the switch to avoid React Hooks errors
  const [duration, setDuration] = useState(30);
  const [mediaType, setMediaType] = useState("stock-videos");
  const [aiPreset, setAiPreset] = useState("default");
  const [backgroundVideo, setBackgroundVideo] = useState("satisfying");
  const [customStyle, setCustomStyle] = useState("");
  const [useOnlyCustomMedia, setUseOnlyCustomMedia] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [videoStyle, setVideoStyle] = useState("trendy");
  const [matchedVideos, setMatchedVideos] = useState<PexelsVideo[]>([]);

  // Render different forms based on toolId
  switch (toolId) {
    case "tiktok":

      // Function to search for videos based on prompt, duration and style
      const searchPexelsVideos = async (searchQuery: string, videoDuration: number, videoStyle: string) => {
        if (!searchQuery.trim() || mediaType !== "stock-videos") return;

        try {
          // Clear previous matches and set searching state
          setMatchedVideos([]);
          setFormState(prev => ({ ...prev, isSearchingVideos: true }));

          console.log(`Searching for videos with: Query="${searchQuery}", Duration=${videoDuration}s, Style="${videoStyle}"`);

          // Extract keywords from the prompt
          const keywords = extractKeywords(searchQuery);
          console.log("Extracted keywords:", keywords);

          // Build search query with style and keywords
          let enhancedQuery = keywords.join(" ");

          // Add style to query if available
          if (videoStyle) {
            // Map our app styles to relevant search terms
            const styleTerms: Record<string, string> = {
              "trendy": "trending modern viral tiktok",
              "funny": "funny humorous comedy entertaining laugh",
              "educational": "educational informative learning tutorial howto",
              "storytelling": "narrative story emotional dramatic cinematic",
              "product": "product showcase commercial advertisement marketing"
            };

            if (styleTerms[videoStyle]) {
              enhancedQuery += ` ${styleTerms[videoStyle]}`;
            }
          }

          // Function to extract important keywords from a prompt
          function extractKeywords(prompt: string): string[] {
            // Remove common stop words
            const stopWords = ["a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for", "with", "about", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "do", "does", "did", "will", "would", "shall", "should", "may", "might", "must", "can", "could"];

            // Split the prompt into words and filter out stop words
            const words = prompt.toLowerCase().split(/\s+/);
            const filteredWords = words.filter(word => {
              // Remove punctuation
              const cleanWord = word.replace(/[^\w\s]/g, '');
              // Check if it's not a stop word and has at least 3 characters
              return cleanWord.length >= 3 && !stopWords.includes(cleanWord);
            });

            // Get unique keywords
            const uniqueKeywords = [...new Set(filteredWords)];

            // Prioritize certain keywords that are likely to be important
            const priorityKeywords = uniqueKeywords.filter(word => {
              // Check for nouns, action verbs, and descriptive adjectives
              // This is a simple heuristic - in a real app, you might use NLP
              return word.length > 4 ||
                     /beach|mountain|city|nature|water|sky|people|person|man|woman|child|animal|food|travel|sport|dance|sing|jump|run|play|beautiful|amazing|stunning|colorful|happy|sad|exciting/.test(word);
            });

            // If we have priority keywords, use those, otherwise use all unique keywords
            return priorityKeywords.length > 0 ? priorityKeywords : uniqueKeywords;
          }

          // Determine duration parameter (Pexels API supports min_duration and max_duration)
          // We'll set a range around the selected duration
          const minDuration = Math.max(1, videoDuration - 15);
          const maxDuration = videoDuration + 15;

          console.log(`Enhanced query: "${enhancedQuery}", Duration range: ${minDuration}-${maxDuration}s`);

          // Make multiple API requests with different parameters to increase chances of finding good matches
          const apiRequests = [
            // Request 1: Use enhanced query with duration constraints
            fetch(
              `https://api.pexels.com/videos/search?query=${encodeURIComponent(enhancedQuery)}&per_page=10&orientation=portrait&min_duration=${minDuration}&max_duration=${maxDuration}`,
              {
                headers: {
                  Authorization: `wHRDj0z3JZe6rXJAGvruiQBlVOKKG2COqOmdjAfltHncStAT3hWTLK5n`
                }
              }
            ),
            // Request 2: Use original query with duration constraints
            fetch(
              `https://api.pexels.com/videos/search?query=${encodeURIComponent(searchQuery)}&per_page=10&orientation=portrait&min_duration=${minDuration}&max_duration=${maxDuration}`,
              {
                headers: {
                  Authorization: `wHRDj0z3JZe6rXJAGvruiQBlVOKKG2COqOmdjAfltHncStAT3hWTLK5n`
                }
              }
            )
          ];

          // Execute all requests in parallel
          const responses = await Promise.all(apiRequests);

          // Check if any request failed
          if (!responses[0].ok && !responses[1].ok) {
            throw new Error(`Failed to fetch videos: ${responses[0].status} ${responses[0].statusText}`);
          }

          // Process successful responses
          const results = await Promise.all(
            responses.filter(response => response.ok).map(response => response.json())
          );

          // Combine and deduplicate videos from all successful responses
          const allVideos: PexelsVideo[] = [];
          const videoIds = new Set<number>();

          results.forEach((data: PexelsSearchResult) => {
            data.videos.forEach(video => {
              if (!videoIds.has(video.id)) {
                videoIds.add(video.id);
                allVideos.push(video);
              }
            });
          });

          console.log(`Combined API Responses: Found ${allVideos.length} unique videos`);

          // Filter videos to ensure they match our criteria
          const filteredVideos = allVideos.filter(video => {
            // Ensure video has files we can use
            return video.video_files && video.video_files.length > 0;
          });

          // Sort videos by relevance (this is a simple heuristic)
          // Videos that better match the duration are ranked higher
          filteredVideos.sort((a, b) => {
            const aDurationDiff = Math.abs(a.duration - videoDuration);
            const bDurationDiff = Math.abs(b.duration - videoDuration);
            return aDurationDiff - bDurationDiff;
          });

          setMatchedVideos(filteredVideos);

          // Show success message with more details
          if (filteredVideos.length > 0) {
            toast.success(
              `Found ${filteredVideos.length} videos matching your criteria:
              • Prompt: "${searchQuery}"
              • Duration: ~${videoDuration}s
              • Style: ${videoStyle}`
            );
          } else {
            // If no videos found, try a broader search without duration constraints
            toast.info("No exact matches found. Trying a broader search...");

            try {
              // Make a broader API call without duration constraints
              const broadResponse = await fetch(
                `https://api.pexels.com/videos/search?query=${encodeURIComponent(enhancedQuery)}&per_page=10&orientation=portrait`,
                {
                  headers: {
                    Authorization: `wHRDj0z3JZe6rXJAGvruiQBlVOKKG2COqOmdjAfltHncStAT3hWTLK5n`
                  }
                }
              );

              if (broadResponse.ok) {
                const broadData = await broadResponse.json() as PexelsSearchResult;
                console.log(`Broad API Response: Found ${broadData.videos.length} videos`);

                if (broadData.videos.length > 0) {
                  // Filter and sort the broader results
                  const broadFilteredVideos = broadData.videos.filter(video =>
                    video.video_files && video.video_files.length > 0
                  );

                  // Sort by relevance to the original query
                  broadFilteredVideos.sort((a, b) => {
                    // Prefer videos closer to the target duration
                    return Math.abs(a.duration - videoDuration) - Math.abs(b.duration - videoDuration);
                  });

                  setMatchedVideos(broadFilteredVideos);
                  toast.success(`Found ${broadFilteredVideos.length} videos matching your prompt and style (with flexible duration)`);
                } else {
                  // Last resort: try with just the original query
                  const lastResortResponse = await fetch(
                    `https://api.pexels.com/videos/search?query=${encodeURIComponent(searchQuery)}&per_page=10&orientation=portrait`,
                    {
                      headers: {
                        Authorization: `wHRDj0z3JZe6rXJAGvruiQBlVOKKG2COqOmdjAfltHncStAT3hWTLK5n`
                      }
                    }
                  );

                  if (lastResortResponse.ok) {
                    const lastResortData = await lastResortResponse.json() as PexelsSearchResult;
                    if (lastResortData.videos.length > 0) {
                      setMatchedVideos(lastResortData.videos);
                      toast.success(`Found ${lastResortData.videos.length} videos matching your prompt`);
                    } else {
                      toast.info("No matching videos found. We'll use our default collection.");
                    }
                  } else {
                    toast.info("No matching videos found. We'll use our default collection.");
                  }
                }
              } else {
                toast.info("No suitable videos found. We'll use our default collection.");
              }
            } catch (broadSearchError) {
              console.error("Error in broad search:", broadSearchError);
              toast.info("No matching videos found. We'll use our default collection.");
            }
          }
        } catch (error) {
          console.error("Error searching videos:", error);
          toast.error("Failed to search for videos. Using default collection instead.");
        } finally {
          setFormState(prev => ({ ...prev, isSearchingVideos: false }));
        }
      };

      return (
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">{tool.name}</h2>
                {tool.status && (
                  <Badge variant="secondary" className={`ml-2 text-xs ${tool.status === "new" ? "bg-green-500/10 text-green-500 hover:bg-green-500/20" : ""}`}>
                    {tool.status}
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground">{tool.description}</p>
            </div>
          </div>

          <form onSubmit={async (e) => {
            e.preventDefault();
            console.log("TikTok form submitted");

            // Disable the button to prevent multiple submissions
            setFormState({ ...formState, isSubmitting: true, progress: 0 });

            try {
              // If using stock videos and no videos matched yet, search first
              if (mediaType === "stock-videos" && matchedVideos.length === 0 && prompt.trim()) {
                console.log("No matched videos yet, searching first...");
                try {
                  await searchPexelsVideos(prompt, duration, videoStyle);
                  // Continue with form submission after search completes
                  await simulateFormSubmission();
                } catch (searchError) {
                  console.error("Error during video search:", searchError);
                  // Continue with form submission even if search fails
                  await simulateFormSubmission();
                }
              } else {
                console.log("Proceeding with form submission...");
                // If we already have matched videos or not using stock videos, proceed directly
                await simulateFormSubmission();
              }
            } catch (formError) {
              console.error("Error in form submission:", formError);
              setFormState({ isSubmitting: false, isUploading: false, progress: 0, isSearchingVideos: false });
              toast.error("Failed to generate video. Please try again.");
            }
          }} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Content</CardTitle>
                <CardDescription>Describe what you want in your TikTok video</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="prompt">Video Prompt</Label>
                  <Textarea
                    id="prompt"
                    name="prompt"
                    placeholder="Describe your TikTok video in detail. For example: 'A quick tutorial on how to make the perfect iced coffee at home with simple ingredients.'"
                    className="min-h-[120px]"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="style">Video Style</Label>
                  <Select
                    value={videoStyle}
                    onValueChange={setVideoStyle}
                    name="style"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="trendy">Trendy</SelectItem>
                      <SelectItem value="funny">Funny</SelectItem>
                      <SelectItem value="educational">Educational</SelectItem>
                      <SelectItem value="storytelling">Storytelling</SelectItem>
                      <SelectItem value="product">Product Showcase</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="duration">Duration (seconds)</Label>
                    <span className="text-sm text-muted-foreground font-medium">{duration}s</span>
                  </div>
                  <Slider
                    id="duration"
                    value={[duration]}
                    onValueChange={(value) => setDuration(value[0])}
                    min={15}
                    max={60}
                    step={5}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>15s</span>
                    <span>30s</span>
                    <span>45s</span>
                    <span>60s</span>
                  </div>
                  {/* Hidden input to ensure duration is included in form data */}
                  <input type="hidden" name="duration" value={duration} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customize Options</CardTitle>
                <CardDescription>Choose what media will be used to illustrate the video</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="media-type">Choose media type</Label>
                  <Select value={mediaType} onValueChange={setMediaType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select media type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stock-videos">Stock videos</SelectItem>
                      <SelectItem value="ai-images">Moving AI images</SelectItem>
                      <SelectItem value="ai-video">AI video</SelectItem>
                      <SelectItem value="custom-media">Your own media</SelectItem>
                      <SelectItem value="gameplay">Static / Gameplay</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {mediaType === "ai-images" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Choose a generation preset</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {AI_GENERATION_PRESETS.filter(preset => preset.category === "basic").slice(0, 6).map(preset => (
                          <div
                            key={preset.id}
                            className={`border rounded-md p-2 cursor-pointer transition-colors ${
                              aiPreset === preset.id ? "border-primary bg-primary/5" : "hover:border-primary/50"
                            }`}
                            onClick={() => setAiPreset(preset.id)}
                          >
                            <div className="aspect-video bg-muted rounded-sm mb-2"></div>
                            <p className="text-xs font-medium text-center truncate">{preset.name}</p>
                            {preset.model && (
                              <Badge variant="outline" className="w-full mt-1 text-[10px] justify-center">
                                {preset.model} model
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                      <Button variant="outline" size="sm" className="w-full mt-2">
                        View all presets
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="custom-style">Specify a general style (optional)</Label>
                      <Input
                        id="custom-style"
                        placeholder="e.g: dark mood, vibrant colors, minimalist"
                        value={customStyle}
                        onChange={(e) => setCustomStyle(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {mediaType === "gameplay" && (
                  <div className="space-y-2">
                    <Label>Select a Background Video</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {BACKGROUND_VIDEOS.slice(0, 6).map(video => (
                        <div
                          key={video.id}
                          className={`border rounded-md p-2 cursor-pointer transition-colors ${
                            backgroundVideo === video.id ? "border-primary bg-primary/5" : "hover:border-primary/50"
                          }`}
                          onClick={() => setBackgroundVideo(video.id)}
                        >
                          <div className="aspect-video bg-muted rounded-sm mb-2"></div>
                          <p className="text-xs font-medium text-center truncate">{video.name}</p>
                          <Badge variant="outline" className="w-full mt-1 text-[10px] justify-center">
                            {video.category}
                          </Badge>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-2">
                      View all backgrounds
                    </Button>
                  </div>
                )}

                {mediaType === "custom-media" && (
                  <div className="space-y-4">
                    <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                        <p className="font-medium">Drop custom images or videos</p>
                        <p className="text-sm text-muted-foreground">or click here to browse files</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="use-only-custom"
                        checked={useOnlyCustomMedia}
                        onCheckedChange={setUseOnlyCustomMedia}
                      />
                      <Label htmlFor="use-only-custom" className="text-sm">
                        Use only provided media
                      </Label>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Activate this option to only use media provided, otherwise, it will also use stock videos
                    </p>
                  </div>
                )}

                {mediaType === "stock-videos" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium">Stock Videos</h4>
                        <p className="text-xs text-muted-foreground">
                          Videos will be automatically matched to your prompt, duration and style
                        </p>
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={!prompt.trim() || formState.isSearchingVideos}
                        onClick={async () => {
                          console.log("Preview Matches button clicked");
                          // Use the video style from state
                          try {
                            await searchPexelsVideos(prompt, duration, videoStyle);
                            console.log("Video search completed successfully");
                          } catch (error) {
                            console.error("Error in Preview Matches:", error);
                            toast.error("Failed to search for videos. Please try again.");
                          }
                        }}
                      >
                        {formState.isSearchingVideos ? (
                          <>
                            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                            Searching...
                          </>
                        ) : (
                          <>Preview Matches</>
                        )}
                      </Button>
                    </div>

                    {matchedVideos.length > 0 ? (
                      <div className="space-y-3" data-matched-videos="true">
                        <div className="grid grid-cols-3 gap-2">
                          {matchedVideos.slice(0, 6).map(video => (
                            <div key={video.id} className="border rounded-md overflow-hidden hover:border-primary transition-colors">
                              <div className="aspect-video bg-muted relative">
                                <img
                                  src={video.image}
                                  alt="Video thumbnail"
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/50">
                                  <Play className="h-8 w-8 text-white" />
                                </div>
                                <div className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] px-1 rounded">
                                  {video.duration}s
                                </div>
                              </div>
                              <div className="p-2">
                                <div className="flex justify-between items-center">
                                  <Badge variant="outline" className="text-[10px]">
                                    {video.width}x{video.height}
                                  </Badge>
                                  <p className="text-xs text-muted-foreground">
                                    {video.video_files.length} formats
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">
                            These videos match your prompt, duration ({duration}s) and style ({videoStyle})
                          </p>
                          <Badge variant="secondary" className="text-xs">
                            {matchedVideos.length} matches
                          </Badge>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center p-4 border rounded-md">
                        <div className="text-center">
                          <VideoIcon className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                          <p className="font-medium">Stock videos will be used</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {prompt.trim() ?
                              "Click 'Preview Matches' to see videos that match your prompt" :
                              "Enter a prompt and click 'Preview Matches' to see videos"
                            }
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {mediaType === "ai-video" && (
                  <div className="flex items-center justify-center p-4">
                    <div className="text-center">
                      <VideoIcon className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                      <p className="font-medium">AI-generated video will be created</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Based on your prompt and selected style
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Audio Options</CardTitle>
                <CardDescription>Configure audio settings for your video</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="music">Background Music</Label>
                    <p className="text-sm text-muted-foreground">Add trending music to your video</p>
                  </div>
                  <Switch id="music" defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="voiceover">AI Voiceover</Label>
                    <p className="text-sm text-muted-foreground">Add a professional voiceover narration</p>
                  </div>
                  <Switch id="voiceover" />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={formState.isSubmitting}
                className="w-full md:w-auto relative overflow-hidden"
              >
                {formState.isSubmitting ? (
                  <>
                    <div className="absolute inset-0 bg-primary/10 overflow-hidden">
                      <div
                        className="h-full bg-primary/20 transition-all duration-300"
                        style={{ width: `${Math.round(formState.progress)}%` }}
                      />
                    </div>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating... {Math.round(formState.progress)}%
                  </>
                ) : (
                  <>Generate TikTok Video</>
                )}
              </Button>
            </div>
          </form>
        </div>
      );

    case "caption":
      return (
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">{tool.name}</h2>
                {tool.status && (
                  <Badge variant="secondary" className={`ml-2 text-xs ${tool.status === "new" ? "bg-green-500/10 text-green-500 hover:bg-green-500/20" : ""}`}>
                    {tool.status}
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground">{tool.description}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Video</CardTitle>
                <CardDescription>Upload the video you want to add captions to</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed rounded-lg p-12 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <p className="font-medium">Drag & drop your video here</p>
                    <p className="text-sm text-muted-foreground">or click to browse files</p>
                    <p className="text-xs text-muted-foreground mt-2">MP4, MOV, or AVI up to 500MB</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Caption Settings</CardTitle>
                <CardDescription>Configure how your captions will appear</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Caption Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger>
                      <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map(lang => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="style">Caption Style</Label>
                  <Select defaultValue="standard">
                    <SelectTrigger>
                      <SelectValue placeholder="Select a style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                      <SelectItem value="bold">Bold</SelectItem>
                      <SelectItem value="subtitle">Subtitle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-translate">Auto-Translate</Label>
                    <p className="text-sm text-muted-foreground">Automatically translate captions to other languages</p>
                  </div>
                  <Switch id="auto-translate" />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={formState.isSubmitting}
                className="w-full md:w-auto"
              >
                {formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing... {Math.round(formState.progress)}%
                  </>
                ) : (
                  <>Generate Captions</>
                )}
              </Button>
            </div>
          </form>
        </div>
      );

    case "talking-avatar":
      return (
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">{tool.name}</h2>
                {tool.status && (
                  <Badge variant="secondary" className={`ml-2 text-xs ${tool.status === "new" ? "bg-green-500/10 text-green-500 hover:bg-green-500/20" : ""}`}>
                    {tool.status}
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground">{tool.description}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs defaultValue="text">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="text">Text to Speech</TabsTrigger>
                <TabsTrigger value="audio">Upload Audio</TabsTrigger>
              </TabsList>

              <TabsContent value="text" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Script</CardTitle>
                    <CardDescription>Enter the text you want your avatar to say</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Enter your script here. For example: 'Hello everyone! Today I'm going to show you how to use this amazing AI tool to create engaging videos.'"
                      className="min-h-[150px]"
                      required
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="audio" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Upload Audio</CardTitle>
                    <CardDescription>Upload an audio file for your avatar to lip-sync</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border-2 border-dashed rounded-lg p-12 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="flex flex-col items-center gap-2">
                        <Mic className="h-8 w-8 text-muted-foreground" />
                        <p className="font-medium">Drag & drop your audio file here</p>
                        <p className="text-sm text-muted-foreground">or click to browse files</p>
                        <p className="text-xs text-muted-foreground mt-2">MP3 or WAV up to 50MB</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <Card>
              <CardHeader>
                <CardTitle>Choose Avatar</CardTitle>
                <CardDescription>Select an avatar to deliver your message</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="realistic">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="realistic">Realistic</TabsTrigger>
                    <TabsTrigger value="cartoon">Cartoon</TabsTrigger>
                    <TabsTrigger value="anime">Anime</TabsTrigger>
                  </TabsList>

                  <TabsContent value="realistic" className="mt-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {AVATAR_MODELS.filter(a => a.category === "realistic").map(avatar => (
                        <div key={avatar.id} className="border rounded-lg p-2 cursor-pointer hover:border-primary transition-colors">
                          <div className="aspect-square bg-muted rounded-md mb-2"></div>
                          <p className="text-sm font-medium text-center">{avatar.name}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="cartoon" className="mt-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {AVATAR_MODELS.filter(a => a.category === "cartoon").map(avatar => (
                        <div key={avatar.id} className="border rounded-lg p-2 cursor-pointer hover:border-primary transition-colors">
                          <div className="aspect-square bg-muted rounded-md mb-2"></div>
                          <p className="text-sm font-medium text-center">{avatar.name}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="anime" className="mt-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {AVATAR_MODELS.filter(a => a.category === "anime").map(avatar => (
                        <div key={avatar.id} className="border rounded-lg p-2 cursor-pointer hover:border-primary transition-colors">
                          <div className="aspect-square bg-muted rounded-md mb-2"></div>
                          <p className="text-sm font-medium text-center">{avatar.name}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={formState.isSubmitting}
                className="w-full md:w-auto"
              >
                {formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating... {Math.round(formState.progress)}%
                  </>
                ) : (
                  <>Create Talking Avatar</>
                )}
              </Button>
            </div>
          </form>
        </div>
      );

    default:
      return (
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">{tool.name}</h2>
                {tool.status && (
                  <Badge variant="secondary" className={`ml-2 text-xs ${tool.status === "new" ? "bg-green-500/10 text-green-500 hover:bg-green-500/20" : ""}`}>
                    {tool.status}
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground">{tool.description}</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Coming Soon</CardTitle>
              <CardDescription>This tool is currently in development</CardDescription>
            </CardHeader>
            <CardContent>
              <p>We're working hard to bring you this feature. Check back soon!</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={onBack}>Go Back</Button>
            </CardFooter>
          </Card>
        </div>
      );
  }
}