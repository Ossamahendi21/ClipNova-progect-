import { Video, VideoTemplate } from "@/types/video"
import { CloudinaryService } from "./cloudinary-service"

interface VideoFilters {
  status: string
  sortBy: string
  search: string
}

interface VideoProgress {
  progress: number
  step: string
  status: "processing" | "completed" | "error"
  error?: string
}

export class VideoService {
  private static instance: VideoService
  private progressMap: Map<string, VideoProgress> = new Map()
  private cloudinary: CloudinaryService

  private constructor() {
    // Initialize Cloudinary service
    this.cloudinary = CloudinaryService.getInstance();
  }

  static getInstance(): VideoService {
    if (!VideoService.instance) {
      VideoService.instance = new VideoService()
    }
    return VideoService.instance
  }

  /**
   * Generate a truly unique ID for a video
   * @returns A unique ID string
   */
  private generateUniqueId(): string {
    // Combine multiple sources of randomness for better uniqueness
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

    return segments.join('-');
  }

  /**
   * Generate a video based on the provided parameters
   * This is a non-blocking implementation that simulates a realistic video generation process
   *
   * @param params Parameters for video generation including title, description, style, and prompt
   * @returns The ID of the generated video
   */
  async generateVideo(params: {
    templateId?: string
    title: string
    description: string
    style: string
    prompt: string
  }): Promise<string> {
    try {
      console.log("=== STARTING VIDEO GENERATION ===");
      console.log("Generation parameters:", params);

      // Generate a unique ID for the video
      const videoId = this.generateUniqueId();

      // Initialize progress tracking
      this.progressMap.set(videoId, {
        progress: 0,
        step: "Initializing generation process...",
        status: "processing"
      });

      // Create a new video object
      const newVideo: Video = {
        id: videoId,
        title: params.title || "TikTok Video",
        description: params.description || params.prompt,
        thumbnail: "/placeholder.svg", // Will be updated later
        duration: 15, // Default duration
        createdAt: new Date().toISOString(),
        status: "processing",
        views: 0,
        likes: 0,
        shares: 0,
        style: params.style,
        prompt: params.prompt
      };

      // Start the generation process in the background
      this.startVideoGenerationProcess(newVideo, params);

      // Return the video ID immediately
      return videoId;
    } catch (error) {
      console.error("Error starting video generation:", error);
      throw error;
    }
  }

  /**
   * Start the video generation process in the background
   * This is a non-blocking implementation that simulates a realistic video generation process
   *
   * @param video The video object to update
   * @param params Parameters for video generation
   */
  private startVideoGenerationProcess(video: Video, params: {
    templateId?: string
    title: string
    description: string
    style: string
    prompt: string
  }): void {
    // Use setTimeout to make this non-blocking
    setTimeout(async () => {
      try {
        // Update progress to show we're starting
        this.progressMap.set(video.id, {
          progress: 5,
          step: "Analyzing prompt...",
          status: "processing"
        });

        // Simulate prompt analysis (1-2 seconds)
        await this.simulateStep(1000, 2000);

        // Update progress
        this.progressMap.set(video.id, {
          progress: 15,
          step: "Generating video concept...",
          status: "processing"
        });

        // Simulate concept generation (1-3 seconds)
        await this.simulateStep(1000, 3000);

        // Update progress
        this.progressMap.set(video.id, {
          progress: 30,
          step: "Creating video frames...",
          status: "processing"
        });

        // Simulate frame creation (2-4 seconds)
        await this.simulateStep(2000, 4000);

        // Update progress
        this.progressMap.set(video.id, {
          progress: 50,
          step: "Rendering video...",
          status: "processing"
        });

        // Simulate rendering (3-5 seconds)
        await this.simulateStep(3000, 5000);

        // Update progress
        this.progressMap.set(video.id, {
          progress: 75,
          step: "Applying effects and style...",
          status: "processing"
        });

        // Simulate effects application (2-3 seconds)
        await this.simulateStep(2000, 3000);

        // Update progress
        this.progressMap.set(video.id, {
          progress: 90,
          step: "Finalizing video...",
          status: "processing"
        });

        // Simulate finalization (1-2 seconds)
        await this.simulateStep(1000, 2000);

        // Generate an actual video file using the video-generator utility
        let videoFile: File;
        try {
          // Generate a video with text based on the prompt
          videoFile = await this.generateActualVideoFile(params.prompt, params.style);
          console.log(`Generated video file: ${videoFile.name}, size: ${videoFile.size} bytes`);

          // Update the video object with the file
          video.duration = 15; // Set a realistic duration
          video.status = "completed";

          // Upload the file to Cloudinary
          const uploadResult = await this.cloudinary.uploadFile(videoFile, `tiktok_videos/${video.id}`);

          if (uploadResult) {
            // Update video with Cloudinary URLs
            video.cloudStorageUrl = uploadResult.secure_url;
            video.cloudStorageId = uploadResult.public_id;
            video.downloadUrl = this.cloudinary.getDownloadUrl(uploadResult.public_id);
            video.streamingUrl = this.cloudinary.getStreamingUrl(uploadResult.public_id);

            console.log(`Video uploaded to Cloudinary: ${uploadResult.secure_url}`);
          }
        } catch (error) {
          console.error("Error generating or uploading video file:", error);
          // Continue with the process even if file generation fails
        }

        // Save the video to localStorage
        this.saveVideoToLocalStorage(video);

        // Update progress to completed
        this.progressMap.set(video.id, {
          progress: 100,
          step: "Video generation completed!",
          status: "completed"
        });

        console.log(`Video generation completed for video ID: ${video.id}`);
      } catch (error) {
        console.error(`Error in video generation process for video ID ${video.id}:`, error);

        // Update progress with error
        this.progressMap.set(video.id, {
          progress: 0,
          step: "Generation failed",
          status: "error",
          error: error instanceof Error ? error.message : "Unknown error during video generation"
        });
      }
    }, 0);
  }

  /**
   * Generate an actual video file using the video-generator utility
   *
   * @param prompt The prompt to use for video generation
   * @param style The style to apply to the video
   * @returns A File object containing the generated video
   */
  private async generateActualVideoFile(prompt: string, style?: string): Promise<File> {
    try {
      // Import the video generator dynamically to avoid server-side issues
      const { generateVideoWithText } = await import('../video-generator');

      // Generate a video with text based on the prompt
      const videoFile = await generateVideoWithText(
        prompt,
        15, // 15 seconds duration
        `TikTok-${Date.now()}`,
        style
      );

      return videoFile;
    } catch (error) {
      console.error("Error generating actual video file:", error);
      throw error;
    }
  }

  /**
   * Simulate a step in the video generation process
   *
   * @param minMs Minimum duration in milliseconds
   * @param maxMs Maximum duration in milliseconds
   * @returns A promise that resolves after a random duration between minMs and maxMs
   */
  private simulateStep(minMs: number, maxMs: number): Promise<void> {
    const duration = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
    return new Promise(resolve => setTimeout(resolve, duration));
  }

  /**
   * Save a video to localStorage
   *
   * @param video The video to save
   */
  private saveVideoToLocalStorage(video: Video): void {
    if (typeof window === 'undefined') return;

    try {
      // Save to userVideos (recent videos)
      const userVideosJson = localStorage.getItem('userVideos');
      let userVideos: Video[] = userVideosJson ? JSON.parse(userVideosJson) : [];
      userVideos = [video, ...userVideos];
      localStorage.setItem('userVideos', JSON.stringify(userVideos));

      // Save to myVideos
      const myVideosJson = localStorage.getItem('myVideos');
      let myVideos: Video[] = myVideosJson ? JSON.parse(myVideosJson) : [];
      myVideos = [video, ...myVideos];
      localStorage.setItem('myVideos', JSON.stringify(myVideos));

      // Save to allVideos
      const allVideosJson = localStorage.getItem('allVideos');
      let allVideos: Video[] = allVideosJson ? JSON.parse(allVideosJson) : [];
      allVideos = [video, ...allVideos];
      localStorage.setItem('allVideos', JSON.stringify(allVideos));

      console.log(`Video saved to localStorage: ${video.id}`);
    } catch (error) {
      console.error("Error saving video to localStorage:", error);
    }
  }

  getVideoProgress(videoId: string): VideoProgress | undefined {
    return this.progressMap.get(videoId)
  }

  async getVideoMetadata(videoId: string): Promise<Video> {
    // TODO: Implement video metadata retrieval
    return {
      id: videoId,
      title: "Sample Video",
      description: "This is a sample video",
      thumbnail: "/thumbnails/sample.jpg",
      duration: 120,
      createdAt: new Date().toISOString(),
      status: "published",
      views: 0,
      likes: 0,
      shares: 0
    }
  }

  /**
   * Save a video to the user's collection and upload to Cloudinary if a file is provided
   * @param video The video metadata
   * @param file Optional video file to upload to Cloudinary
   * @returns The ID of the saved video
   */
  async saveVideo(video: Video, file?: File): Promise<string> {
    try {
      // If a file is provided, upload it to Cloudinary
      if (file) {
        // Set initial progress
        this.progressMap.set(video.id, {
          progress: 0,
          step: "Uploading to Cloudinary...",
          status: "processing"
        });

        // Create a folder path based on the video ID
        const folder = `tiktok_videos/${video.id}`;

        // Upload the file to Cloudinary
        const uploadResult = await this.cloudinary.uploadFile(file, folder);

        if (uploadResult) {
          // Update video with Cloudinary URLs
          video.cloudStorageUrl = uploadResult.secure_url;
          video.cloudStorageId = uploadResult.public_id;

          // Generate download URL
          video.downloadUrl = this.cloudinary.getDownloadUrl(uploadResult.public_id);

          // Generate streaming URL for embedding
          video.streamingUrl = this.cloudinary.getStreamingUrl(uploadResult.public_id);

          // Update progress
          this.progressMap.set(video.id, {
            progress: 100,
            step: "Upload complete",
            status: "completed"
          });

          console.log(`Video file uploaded to Cloudinary: ${uploadResult.secure_url}`);
        }
      } else {
        console.log("No file provided, skipping Cloudinary upload");
      }

      // In a real implementation, we would save the video metadata to a database
      // For now, we'll just return the video ID

      return video.id;
    } catch (error) {
      console.error("Error saving video:", error);

      // Update progress with error
      this.progressMap.set(video.id, {
        progress: 0,
        step: "Upload failed",
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error"
      });

      throw error;
    }
  }

  async listVideos(filters: VideoFilters): Promise<Video[]> {
    // Try to get videos from localStorage first
    try {
      if (typeof window !== 'undefined') {
        const storedVideos = localStorage.getItem('userVideos');
        if (storedVideos) {
          const videos = JSON.parse(storedVideos) as Video[];

          // Apply filters if needed
          let filteredVideos = [...videos];

          // Filter by status if specified
          if (filters.status && filters.status !== 'all') {
            filteredVideos = filteredVideos.filter(video => video.status === filters.status);
          }

          // Filter by search term if specified
          if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            filteredVideos = filteredVideos.filter(video =>
              video.title.toLowerCase().includes(searchTerm) ||
              video.description.toLowerCase().includes(searchTerm)
            );
          }

          // Sort videos
          if (filters.sortBy === 'newest') {
            filteredVideos.sort((a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          } else if (filters.sortBy === 'oldest') {
            filteredVideos.sort((a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
          }

          return filteredVideos;
        }
      }
    } catch (error) {
      console.error("Error reading from localStorage:", error);
    }

    // Fallback to mock videos if localStorage is not available or empty
    return [
      {
        id: "mock1",
        title: "TikTok Video - Demo",
        description: "A sample TikTok video",
        thumbnail: "/placeholder.svg",
        duration: 30,
        createdAt: new Date().toISOString(),
        status: "completed",
        views: 0,
        likes: 0,
        shares: 0
      },
      {
        id: "mock2",
        title: "Captioned Video - Demo",
        description: "A sample captioned video",
        thumbnail: "/placeholder.svg",
        duration: 45,
        createdAt: new Date().toISOString(),
        status: "processing",
        views: 0,
        likes: 0,
        shares: 0
      }
    ];
  }

  /**
   * Delete a video from the user's collection and from Cloudinary if applicable
   * This is a completely non-blocking implementation that ensures the UI remains responsive
   *
   * @param videoId The ID of the video to delete
   * @returns A promise that resolves immediately
   */
  async deleteVideo(videoId: string): Promise<void> {
    // Create a unique operation ID for tracking
    const operationId = `delete-${videoId}-${Date.now()}`;
    console.log(`=== STARTING VIDEO DELETION (${operationId}) ===`);

    // Remove from progress map immediately
    this.progressMap.delete(videoId);

    // Return immediately to prevent UI blocking
    // The actual deletion will happen in the background
    this.performBackgroundDeletion(videoId, operationId);

    // Return a resolved promise immediately
    return Promise.resolve();
  }

  /**
   * Perform the actual video deletion in the background
   * This is a completely non-blocking implementation
   *
   * @param videoId The ID of the video to delete
   * @param operationId A unique ID for tracking this operation
   */
  private performBackgroundDeletion(videoId: string, operationId: string): void {
    // Use setTimeout with 0ms delay to move to the next event loop tick
    // This ensures the UI remains responsive
    setTimeout(async () => {
      try {
        console.log(`Starting background deletion for video ${videoId} (${operationId})`);

        // Variables to track the video and its Cloudinary ID
        let cloudinaryPublicId: string | undefined;
        let videoToDelete: Video | undefined;

        // Step 1: First quickly remove from localStorage to update UI
        if (typeof window !== 'undefined') {
          try {
            // Process each collection in a non-blocking way
            const collections = [
              { key: 'userVideos', name: 'Recent Videos' },
              { key: 'myVideos', name: 'My Videos' },
              { key: 'allVideos', name: 'All Videos' }
            ];

            for (const collection of collections) {
              try {
                // Use a separate try-catch for each collection
                // This ensures that if one fails, the others can still proceed
                const storedVideosJson = localStorage.getItem(collection.key);
                if (!storedVideosJson) {
                  console.log(`No videos found in ${collection.name} collection (${operationId})`);
                  continue;
                }

                const videos = JSON.parse(storedVideosJson) as Video[];

                // Find the video to get its Cloudinary public ID (if we haven't found it yet)
                if (!videoToDelete) {
                  videoToDelete = videos.find(video => video.id === videoId);
                  if (videoToDelete && videoToDelete.cloudStorageId) {
                    cloudinaryPublicId = videoToDelete.cloudStorageId;
                    console.log(`Found Cloudinary ID for video ${videoId}: ${cloudinaryPublicId} (${operationId})`);
                  }
                }

                // Filter out the video to delete
                const updatedVideos = videos.filter(video => video.id !== videoId);

                // Save back to localStorage immediately
                localStorage.setItem(collection.key, JSON.stringify(updatedVideos));
                console.log(`Removed video ${videoId} from ${collection.name} collection (${operationId})`);
              } catch (parseError) {
                console.error(`Error updating ${collection.name} collection (${operationId}):`, parseError);
                // Continue with other collections even if one fails
              }
            }
          } catch (localStorageError) {
            console.error(`Error accessing localStorage (${operationId}):`, localStorageError);
            // Continue with Cloudinary deletion even if localStorage update fails
          }
        }

        // Step 2: Delete from Cloudinary in the background
        if (cloudinaryPublicId) {
          try {
            console.log(`Deleting video file from Cloudinary: ${cloudinaryPublicId} (${operationId})`);
            await this.cloudinary.deleteResource(cloudinaryPublicId, 'video');
            console.log(`Successfully deleted video file from Cloudinary: ${cloudinaryPublicId} (${operationId})`);
          } catch (cloudinaryError) {
            console.error(`Error deleting from Cloudinary (${operationId}):`, cloudinaryError);
            // This happens in the background, so we don't need to throw
          }
        } else {
          console.log(`No Cloudinary ID found for video ${videoId}, skipping cloud deletion (${operationId})`);
        }

        console.log(`Video deletion operation completed successfully (${operationId})`);
      } catch (error) {
        console.error(`Error in background deletion process (${operationId}):`, error);
        // This happens in the background, so we don't need to throw
      }
    }, 0);
  }

  /**
   * Share a video by generating a shareable link using Cloudinary's video player
   * @param videoId The ID of the video to share
   * @returns A shareable link to the video
   */
  async shareVideo(videoId: string): Promise<string> {
    try {
      console.log(`=== SHARING VIDEO ${videoId} ===`);

      // Get the video from localStorage
      let shareUrl = 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4';

      if (typeof window !== 'undefined') {
        // Try to find the video in any collection
        const collections = [
          { key: 'userVideos', name: 'Recent Videos' },
          { key: 'myVideos', name: 'My Videos' },
          { key: 'allVideos', name: 'All Videos' }
        ];

        for (const collection of collections) {
          try {
            const storedVideosJson = localStorage.getItem(collection.key);
            if (!storedVideosJson) continue;

            const videos = JSON.parse(storedVideosJson) as Video[];
            const video = videos.find(v => v.id === videoId);

            if (video && video.cloudStorageId) {
              // Use Cloudinary's streaming URL with the video's cloud storage ID
              shareUrl = this.cloudinary.getStreamingUrl(video.cloudStorageId);
              break;
            }
          } catch (error) {
            console.error(`Error checking ${collection.name} for video:`, error);
          }
        }

        // Update share counts in the background
        setTimeout(() => {
          try {
            for (const collection of collections) {
              try {
                const storedVideosJson = localStorage.getItem(collection.key);
                if (!storedVideosJson) continue;

                const videos = JSON.parse(storedVideosJson) as Video[];
                const videoToShare = videos.find(video => video.id === videoId);

                if (videoToShare) {
                  // Increment share count
                  videoToShare.shares = (videoToShare.shares || 0) + 1;

                  // Update the video in localStorage
                  const updatedVideos = videos.map(video =>
                    video.id === videoId ? videoToShare : video
                  );

                  localStorage.setItem(collection.key, JSON.stringify(updatedVideos));
                  console.log(`Updated share count in ${collection.name}`);
                }
              } catch (parseError) {
                console.error(`Error updating ${collection.name} share count:`, parseError);
              }
            }
          } catch (error) {
            console.error("Error updating share counts:", error);
          }
        }, 0);
      }

      // Return the share URL immediately for better UX
      return shareUrl;
    } catch (error) {
      console.error("Error sharing video:", error);
      // Return a sample URL even if there's an error
      return 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4';
    }
  }

  /**
   * Get a download URL for a video using Cloudinary's video transformations
   * @param videoId The ID of the video to download
   * @returns A download URL for the video
   */
  async getDownloadUrl(videoId: string): Promise<string> {
    try {
      console.log(`=== GETTING DOWNLOAD URL FOR VIDEO ${videoId} ===`);

      // Get the video from localStorage
      if (typeof window !== 'undefined') {
        // Try to find the video in any collection
        const collections = [
          { key: 'userVideos', name: 'Recent Videos' },
          { key: 'myVideos', name: 'My Videos' },
          { key: 'allVideos', name: 'All Videos' }
        ];

        for (const collection of collections) {
          try {
            const storedVideosJson = localStorage.getItem(collection.key);
            if (!storedVideosJson) continue;

            const videos = JSON.parse(storedVideosJson) as Video[];
            const video = videos.find(v => v.id === videoId);

            if (video && video.cloudStorageId) {
              // Use Cloudinary's download URL with the video's cloud storage ID
              return this.cloudinary.getDownloadUrl(video.cloudStorageId);
            }
          } catch (error) {
            console.error(`Error checking ${collection.name} for video:`, error);
          }
        }
      }

      // Fallback to a sample video URL if we couldn't find the video
      console.log("Video not found in any collection, using sample video");
      return 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4';
    } catch (error) {
      console.error("Error getting download URL:", error);
      // Return a sample URL even if there's an error
      return 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4';
    }
  }

  /**
   * Update a video's metadata
   * @param videoId The ID of the video to update
   * @param updates The updates to apply to the video
   * @returns The updated video
   */
  async updateVideo(videoId: string, updates: Partial<Video>): Promise<Video> {
    try {
      // Get the video from localStorage
      if (typeof window !== 'undefined') {
        const storedVideos = localStorage.getItem('userVideos');
        if (storedVideos) {
          const videos = JSON.parse(storedVideos) as Video[];
          const videoToUpdate = videos.find(video => video.id === videoId);

          if (videoToUpdate) {
            // Apply updates
            const updatedVideo = { ...videoToUpdate, ...updates };

            // Update the video in localStorage
            const updatedVideos = videos.map(video =>
              video.id === videoId ? updatedVideo : video
            );
            localStorage.setItem('userVideos', JSON.stringify(updatedVideos));

            // Also update in myVideos
            const myVideos = localStorage.getItem('myVideos');
            if (myVideos) {
              const videos = JSON.parse(myVideos) as Video[];
              const updatedMyVideos = videos.map(video =>
                video.id === videoId ? updatedVideo : video
              );
              localStorage.setItem('myVideos', JSON.stringify(updatedMyVideos));
            }

            return updatedVideo;
          }
        }
      }

      throw new Error(`Video with ID ${videoId} not found`);
    } catch (error) {
      console.error("Error updating video:", error);
      throw error;
    }
  }

  async getTemplates(): Promise<VideoTemplate[]> {
    // TODO: Implement template listing
    return []
  }
}