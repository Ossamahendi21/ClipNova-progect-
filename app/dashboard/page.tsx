"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTranslation } from "@/hooks/use-translation"
import { Plus, Video, Clock, Star, Cloud } from "lucide-react"
import { VideoCard } from "@/components/dashboard/video-card"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { useRouter, useSearchParams } from "next/navigation"
import { videoTemplates } from "@/lib/templates-data"
import { CloudinaryService } from "@/lib/services/cloudinary-service"
import { VideoService } from "@/lib/services/video-service"
import { toast } from "sonner"
import { AutoTranslate } from "@/components/ui/auto-translate"
import { Video as VideoType, VideoTemplate } from "@/types/video"

// Get popular templates for dashboard
const popularTemplates = videoTemplates;

export default function Dashboard() {
  const { isRtl } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("overview")
  const [isTestingCloudinary, setIsTestingCloudinary] = useState(false)
  const [recentVideos, setRecentVideos] = useState<VideoType[]>([])
  const [myVideos, setMyVideos] = useState<VideoType[]>([])
  const [allVideos, setAllVideos] = useState<VideoType[]>([])
  const [highlightedVideoId, setHighlightedVideoId] = useState<string | null>(null)

  // Load videos from localStorage when the component mounts
  useEffect(() => {
    loadVideosFromLocalStorage();

    // Check if there's a newVideo parameter in the URL
    const newVideoId = searchParams.get('newVideo');
    if (newVideoId) {
      setHighlightedVideoId(newVideoId);
      // Clear the highlight after 5 seconds
      setTimeout(() => {
        setHighlightedVideoId(null);
      }, 5000);
    }
  }, [searchParams]);

  // Function to load videos from localStorage
  const loadVideosFromLocalStorage = () => {
    try {
      console.log("=== LOADING VIDEOS FROM LOCAL STORAGE ===");

      // Load recent videos
      const recentVideosJson = localStorage.getItem('userVideos');
      if (recentVideosJson) {
        const parsedVideos = JSON.parse(recentVideosJson) as VideoType[];
        setRecentVideos(parsedVideos);
        console.log(`Loaded ${parsedVideos.length} recent videos from localStorage`);
      } else {
        console.log("No recent videos found in localStorage");
        setRecentVideos([]);
      }

      // Load my videos
      const myVideosJson = localStorage.getItem('myVideos');
      if (myVideosJson) {
        const parsedVideos = JSON.parse(myVideosJson) as VideoType[];
        setMyVideos(parsedVideos);
        console.log(`Loaded ${parsedVideos.length} videos from My Videos collection`);
      } else {
        console.log("No videos found in My Videos collection");
        setMyVideos([]);
      }

      // Load all videos (create a copy of myVideos for now)
      // In a real app, this might be a different collection
      if (myVideosJson) {
        const parsedVideos = JSON.parse(myVideosJson) as VideoType[];
        setAllVideos(parsedVideos);
        console.log(`Loaded ${parsedVideos.length} videos for All Videos collection`);
      } else {
        console.log("No videos found for All Videos collection");
        setAllVideos([]);
      }

      // Ensure we have an allVideos collection in localStorage
      if (!localStorage.getItem('allVideos') && myVideosJson) {
        localStorage.setItem('allVideos', myVideosJson);
        console.log("Created allVideos collection in localStorage");
      }
    } catch (error) {
      console.error("Error loading videos from localStorage:", error);
      toast.error("Failed to load your videos. Please try refreshing the page.");
    }
  }

  /**
   * Handle video deletion with optimistic UI updates
   * This ensures the UI remains responsive even during deletion operations
   *
   * @param videoId The ID of the video to delete
   */
  const handleDeleteVideo = (videoId: string) => {
    try {
      // Create a unique operation ID for tracking
      const operationId = `delete-${videoId}-${Date.now()}`;
      console.log(`=== STARTING VIDEO DELETION (${operationId}) ===`);

      // Apply visual indication that the video is being deleted
      // This provides immediate feedback to the user
      const videoElement = document.getElementById(`video-card-${videoId}`);
      if (videoElement) {
        videoElement.classList.add('opacity-50', 'pointer-events-none');
      }

      // Immediately update the UI by filtering out the video being deleted
      // This ensures the UI remains responsive even if the actual deletion takes time
      setRecentVideos(prev => prev.filter(v => v.id !== videoId));
      setMyVideos(prev => prev.filter(v => v.id !== videoId));
      setAllVideos(prev => prev.filter(v => v.id !== videoId));

      // Show a brief success message
      toast.success("Video deleted successfully", {
        duration: 2000,
        position: 'top-center',
        dismissible: true
      });

      // Perform the actual deletion in the background
      // This prevents UI blocking by not awaiting the operation
      setTimeout(() => {
        try {
          const videoService = VideoService.getInstance();
          videoService.deleteVideo(videoId)
            .then(() => {
              console.log(`Video ${videoId} deleted successfully in the background (${operationId})`);
              // No need to refresh UI as we've already updated it optimistically
            })
            .catch(error => {
              console.error(`Background deletion error (${operationId}):`, error);
              // Even if background deletion fails, don't disrupt the user experience
            });
        } catch (error) {
          console.error(`Error starting background deletion (${operationId}):`, error);
          // Don't show error to user as the UI is already updated
        }
      }, 0); // Use 0ms timeout to move to next event loop tick
    } catch (error) {
      console.error("Error in handleDeleteVideo:", error);
      // Show a generic error message if something goes wrong
      toast.error("Something went wrong. Please try again.");
    }
  };

    // Check if videos collection is empty after deletion
    if (activeTab === "videos" && myVideos.length === 0) {
      setTimeout(() => {
        toast.info("Your videos collection is now empty. Create a new video to get started!");
      }, 1000);
    }
  }

  // Function to handle video sharing
  const handleShareVideo = async (videoId: string) => {
    try {
      const videoService = VideoService.getInstance();
      const shareUrl = await videoService.shareVideo(videoId);

      // Copy the URL to clipboard
      await navigator.clipboard.writeText(shareUrl);

      toast.success("Share link copied to clipboard!");
      return shareUrl;
    } catch (error) {
      console.error("Error sharing video:", error);
      toast.error("Failed to share video. Please try again.");
      return null;
    }
  }

  // Function to handle video download
  const handleDownloadVideo = async (videoId: string): Promise<string> => {
    try {
      const videoService = VideoService.getInstance();
      const downloadUrl = await videoService.getDownloadUrl(videoId);

      // Return the download URL
      return downloadUrl;
    } catch (error) {
      console.error("Error downloading video:", error);
      toast.error("Failed to download video. Using fallback video.");

      // Return a fallback URL
      return 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4';
    }
  }

  const handleCreateVideo = () => {
    router.push("/create")
  }

  const handleViewAllVideos = () => {
    router.push("/dashboard/videos")
  }

  const handleUseTemplate = (templateId: string | number) => {
    router.push(`/create?template=${templateId}`)
  }

  // Function to test Cloudinary upload
  const testCloudinaryUpload = async () => {
    try {
      setIsTestingCloudinary(true);
      toast.info("Starting Cloudinary test upload...");

      const cloudinaryService = CloudinaryService.getInstance();
      const result = await cloudinaryService.testCloudinaryUpload();

      if (result.success) {
        toast.success(result.message);
        if (result.url) {
          // Show the uploaded image URL
          toast.info(
            <div className="flex flex-col gap-2">
              <p>Test image uploaded to:</p>
              <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                {result.url}
              </a>
              <p className="text-sm mt-2">
                Check your Cloudinary dashboard to see the uploaded test image.
              </p>
            </div>,
            {
              duration: 10000,
            }
          );
        }
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error testing Cloudinary upload:", error);
      toast.error(`Cloudinary test failed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsTestingCloudinary(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold"><AutoTranslate translationKey="dashboard_title" /></h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={testCloudinaryUpload}
            disabled={isTestingCloudinary}
          >
            <Cloud className={`${isRtl ? 'ml-2' : 'mr-2'} h-4 w-4`} />
            {isTestingCloudinary ? "Testing..." : "Test Cloudinary"}
          </Button>
          <Button
            className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
            onClick={handleCreateVideo}
          >
            <Plus className={`${isRtl ? 'ml-2' : 'mr-2'} h-4 w-4`} /> <AutoTranslate translationKey="dashboard_new_video" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-3 md:w-[400px]">
          <TabsTrigger value="overview"><AutoTranslate translationKey="dashboard_overview" /></TabsTrigger>
          <TabsTrigger value="videos"><AutoTranslate translationKey="dashboard_my_videos" /></TabsTrigger>
          <TabsTrigger value="templates"><AutoTranslate translationKey="dashboard_templates" /></TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <StatsCards />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-emerald-500" />
                  <AutoTranslate translationKey="dashboard_recent_videos" />
                </CardTitle>
                <CardDescription><AutoTranslate translationKey="dashboard_your_recent_videos" /></CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentVideos.length > 0 ? (
                    <>
                      {recentVideos.slice(0, 3).map((video) => (
                        <VideoCard
                          key={video.id}
                          video={video}
                          onDelete={handleDeleteVideo}
                          onShare={handleShareVideo}
                          onDownload={handleDownloadVideo}
                          isHighlighted={video.id === highlightedVideoId}
                        />
                      ))}
                      {recentVideos.length > 3 && (
                        <Button variant="ghost" className="w-full" onClick={handleViewAllVideos}>
                          <AutoTranslate translationKey="dashboard_view_all_videos" />
                        </Button>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No recent videos found.</p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={handleCreateVideo}
                      >
                        Create your first video
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-emerald-500" />
                  <AutoTranslate translationKey="dashboard_recent_activity" />
                </CardTitle>
                <CardDescription><AutoTranslate translationKey="dashboard_your_activity" /></CardDescription>
              </CardHeader>
              <CardContent>
                <RecentActivity />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-emerald-500" />
                <AutoTranslate translationKey="dashboard_recommended_templates" />
              </CardTitle>
              <CardDescription><AutoTranslate translationKey="dashboard_templates_match" /></CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {popularTemplates.slice(0, 3).map((template: VideoTemplate) => (
                  <div
                    key={template.id}
                    className="rounded-lg overflow-hidden border border-border group cursor-pointer hover:border-emerald-500/50 transition-all"
                    onClick={() => handleUseTemplate(template.id)}
                  >
                    <div className="aspect-video bg-muted relative">
                      <img
                        src={template.thumbnail || "/placeholder.svg"}
                        alt={template.name || "Template"}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Button variant="secondary" size="sm">
                          <AutoTranslate translationKey="dashboard_use_template" />
                        </Button>
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{template.name}</h3>
                        <span className="text-xs text-muted-foreground">{template.duration}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4" onClick={() => setActiveTab("templates")}>
                <AutoTranslate translationKey="dashboard_view_all_templates" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="videos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5 text-emerald-500" />
                <AutoTranslate translationKey="dashboard_all_videos" />
              </CardTitle>
              <CardDescription><AutoTranslate translationKey="dashboard_manage_videos" /></CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {allVideos.length > 0 ? (
                  allVideos.map((video) => (
                    <VideoCard
                      key={video.id}
                      video={video}
                      onDelete={handleDeleteVideo}
                      onShare={handleShareVideo}
                      onDownload={handleDownloadVideo}
                      isHighlighted={video.id === highlightedVideoId}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No videos found in your collection.</p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={handleCreateVideo}
                    >
                      Create your first video
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-emerald-500" />
                <AutoTranslate translationKey="dashboard_available_templates" />
              </CardTitle>
              <CardDescription><AutoTranslate translationKey="dashboard_choose_templates" /></CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {popularTemplates.map((template: VideoTemplate) => (
                  <div
                    key={template.id}
                    className="rounded-lg overflow-hidden border border-border group cursor-pointer hover:border-emerald-500/50 transition-all"
                    onClick={() => handleUseTemplate(template.id)}
                  >
                    <div className="aspect-video bg-muted relative">
                      <img
                        src={template.thumbnail || "/placeholder.svg"}
                        alt={template.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Button variant="secondary" size="sm">
                          <AutoTranslate translationKey="dashboard_use_template" />
                        </Button>
                      </div>
                      {/* Popular tag can be added here if needed */}
                    </div>
                    <div className="p-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{template.name}</h3>
                        <span className="text-xs text-muted-foreground">{template.duration}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                className="w-full mt-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
                onClick={handleCreateVideo}
              >
                <Plus className={`${isRtl ? 'ml-2' : 'mr-2'} h-4 w-4`} /> <AutoTranslate translationKey="dashboard_create_new_video" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}
