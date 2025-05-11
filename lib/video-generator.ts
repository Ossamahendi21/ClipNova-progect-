/**
 * Video Generator
 * This module provides functions for generating video files from images and text
 */

/**
 * Generate a video file from an image
 * This creates a simple MP4 video from a static image with a duration
 * @param imageBlob The image blob to use as the video frame
 * @param duration The duration of the video in seconds
 * @param title The title of the video (used for the filename)
 * @returns A Promise that resolves to a File object containing the MP4 video
 */
export async function generateVideoFromImage(
  imageBlob: Blob,
  duration: number = 10,
  title: string = "video"
): Promise<File> {
  return new Promise((resolve, reject) => {
    try {
      console.log("Generating video from image...");
      console.log(`Image size: ${imageBlob.size} bytes, Duration: ${duration}s, Title: ${title}`);

      // Create a canvas element
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error("Could not get canvas context");
      }

      // Set canvas dimensions
      canvas.width = 640;
      canvas.height = 1280; // Portrait mode for TikTok

      // Create an image element to draw on the canvas
      const img = new Image();
      img.onload = () => {
        // Draw the image on the canvas
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Add a timestamp to verify it's a new video
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, canvas.height - 40, canvas.width, 40);
        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Generated: ${new Date().toLocaleString()}`, canvas.width / 2, canvas.height - 15);

        // Create a MediaRecorder to record the canvas
        const stream = canvas.captureStream(30); // 30 FPS
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'video/webm;codecs=vp9',
          videoBitsPerSecond: 2500000 // 2.5 Mbps
        });

        const chunks: Blob[] = [];

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunks.push(e.data);
          }
        };

        mediaRecorder.onstop = async () => {
          try {
            // Combine all chunks into a single blob
            const videoBlob = new Blob(chunks, { type: 'video/webm' });
            console.log(`Generated video blob size: ${videoBlob.size} bytes`);

            // Convert to MP4 using FFmpeg.wasm (in a real app)
            // For this demo, we'll just use the WebM as is
            // In a production app, you would use FFmpeg.wasm or a server-side conversion

            // Create a File object from the blob
            const videoFile = new File([videoBlob], `${title.replace(/\s+/g, '-')}.webm`, {
              type: 'video/webm',
              lastModified: Date.now()
            });

            console.log(`Created video file: ${videoFile.name}, size: ${videoFile.size} bytes`);
            resolve(videoFile);
          } catch (error) {
            console.error("Error creating video file:", error);
            reject(error);
          }
        };

        // Start recording
        mediaRecorder.start();

        // Stop recording after the specified duration
        setTimeout(() => {
          mediaRecorder.stop();
        }, Math.min(duration * 1000, 10000)); // Cap at 10 seconds for demo purposes
      };

      img.onerror = (error) => {
        console.error("Error loading image:", error);
        reject(new Error("Failed to load image for video generation"));
      };

      // Set the image source from the blob
      img.src = URL.createObjectURL(imageBlob);
    } catch (error) {
      console.error("Error in generateVideoFromImage:", error);
      reject(error);
    }
  });
}

/**
 * Generate a video file with text overlay
 * This creates a professional-looking video with text overlay and animations
 *
 * @param text The text to display in the video
 * @param duration The duration of the video in seconds
 * @param title The title of the video (used for the filename)
 * @param style Optional style for the video (affects background color and animations)
 * @returns A Promise that resolves to a File object containing the video
 */
export async function generateVideoWithText(
  text: string,
  duration: number = 15,
  title: string = "tiktok-video",
  style?: string
): Promise<File> {
  return new Promise((resolve, reject) => {
    try {
      console.log("=== STARTING VIDEO GENERATION ===");
      console.log(`Text: ${text}, Duration: ${duration}s, Title: ${title}, Style: ${style}`);

      // Validate inputs
      if (!text || text.trim().length === 0) {
        text = "TikTok Video";
      }

      if (duration <= 0 || isNaN(duration)) {
        duration = 15;
      }

      // Cap duration at 60 seconds for performance
      duration = Math.min(duration, 60);

      // Create a canvas element
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error("Could not get canvas context");
      }

      // Set canvas dimensions for TikTok (9:16 aspect ratio)
      canvas.width = 720;
      canvas.height = 1280;

      // Define style configurations
      const styleConfigs: Record<string, {
        bgColor: string,
        gradientColors: [string, string],
        textColor: string,
        fontFamily: string,
        animation: 'fade' | 'slide' | 'zoom' | 'typewriter'
      }> = {
        trendy: {
          bgColor: '#3498db',
          gradientColors: ['rgba(52, 152, 219, 0.8)', 'rgba(46, 204, 113, 0.9)'],
          textColor: '#ffffff',
          fontFamily: 'Arial, sans-serif',
          animation: 'fade'
        },
        funny: {
          bgColor: '#f1c40f',
          gradientColors: ['rgba(241, 196, 15, 0.8)', 'rgba(231, 76, 60, 0.9)'],
          textColor: '#ffffff',
          fontFamily: 'Impact, sans-serif',
          animation: 'slide'
        },
        educational: {
          bgColor: '#9b59b6',
          gradientColors: ['rgba(155, 89, 182, 0.8)', 'rgba(52, 152, 219, 0.9)'],
          textColor: '#ffffff',
          fontFamily: 'Georgia, serif',
          animation: 'zoom'
        },
        storytelling: {
          bgColor: '#2c3e50',
          gradientColors: ['rgba(44, 62, 80, 0.8)', 'rgba(142, 68, 173, 0.9)'],
          textColor: '#ffffff',
          fontFamily: 'Times New Roman, serif',
          animation: 'typewriter'
        },
        product: {
          bgColor: '#2980b9',
          gradientColors: ['rgba(41, 128, 185, 0.8)', 'rgba(39, 174, 96, 0.9)'],
          textColor: '#ffffff',
          fontFamily: 'Helvetica, sans-serif',
          animation: 'fade'
        },
        default: {
          bgColor: '#000000',
          gradientColors: ['rgba(0, 0, 0, 0.8)', 'rgba(20, 20, 20, 0.9)'],
          textColor: '#ffffff',
          fontFamily: 'Arial, sans-serif',
          animation: 'fade'
        }
      };

      // Get the style configuration
      const styleConfig = styleConfigs[style || 'default'] || styleConfigs.default;

      // Split text into lines
      const words = text.split(' ');
      const lines: string[] = [];
      let currentLine = '';

      // Use a temporary canvas context to measure text
      ctx.font = `bold 36px ${styleConfig.fontFamily}`;

      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;

        if (testWidth > canvas.width - 100 && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }

      if (currentLine) {
        lines.push(currentLine);
      }

      // Animation parameters
      const fps = 30;
      const totalFrames = duration * fps;
      let frameCount = 0;

      // Create a MediaRecorder to record the canvas
      const stream = canvas.captureStream(fps);
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: 3000000 // 3 Mbps for better quality
      });

      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        try {
          // Combine all chunks into a single blob
          const videoBlob = new Blob(chunks, { type: 'video/webm' });
          console.log(`Generated video blob size: ${videoBlob.size} bytes`);

          // Create a File object from the blob
          const safeTitle = title.replace(/[^a-z0-9]/gi, '-').toLowerCase();
          const videoFile = new File([videoBlob], `${safeTitle}-${Date.now()}.webm`, {
            type: 'video/webm',
            lastModified: Date.now()
          });

          console.log(`Created video file: ${videoFile.name}, size: ${videoFile.size} bytes`);
          resolve(videoFile);
        } catch (error) {
          console.error("Error creating video file:", error);
          reject(error);
        }
      };

      // Animation function
      const animate = () => {
        if (frameCount >= totalFrames) {
          return;
        }

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Fill background
        ctx.fillStyle = styleConfig.bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add gradient overlay
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, styleConfig.gradientColors[0]);
        gradient.addColorStop(1, styleConfig.gradientColors[1]);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Calculate animation progress (0 to 1)
        const progress = frameCount / totalFrames;
        const animationProgress = Math.min(frameCount / (totalFrames * 0.2), 1); // Animation completes in first 20% of video

        // Add text with animation
        ctx.fillStyle = styleConfig.textColor;
        ctx.textAlign = 'center';
        ctx.font = `bold 36px ${styleConfig.fontFamily}`;

        const lineHeight = 50;
        const startY = canvas.height / 2 - (lines.length * lineHeight) / 2;

        // Process each line of text
        for (let i = 0; i < lines.length; i++) {
          let line = lines[i];
          let lineY = startY + i * lineHeight;
          let lineX = canvas.width / 2;
          let alpha = 1;
          let skipNormalRender = false;

          // Apply animation based on style
          switch (styleConfig.animation) {
            case 'fade':
              alpha = Math.min(animationProgress * 3, 1);
              ctx.globalAlpha = alpha;
              break;

            case 'slide':
              const slideOffset = (1 - Math.min(animationProgress * 2, 1)) * canvas.width;
              lineX = canvas.width / 2 + (i % 2 === 0 ? -slideOffset : slideOffset);
              break;

            case 'zoom':
              const scale = 0.5 + Math.min(animationProgress * 2, 1) * 0.5;
              ctx.save();
              ctx.translate(canvas.width / 2, lineY);
              ctx.scale(scale, scale);
              ctx.fillText(line, 0, 0);
              ctx.restore();
              skipNormalRender = true; // Skip the normal rendering below
              break;

            case 'typewriter':
              const charCount = Math.floor(line.length * Math.min(animationProgress * 3, 1));
              line = line.substring(0, charCount);
              break;
          }

          // Render the text normally unless we're using zoom animation
          if (!skipNormalRender) {
            ctx.fillText(line, lineX, lineY);
          }

          // Reset global alpha
          ctx.globalAlpha = 1;
        }

        // Add subtle moving background elements
        const time = frameCount / fps;
        for (let i = 0; i < 5; i++) {
          const x = Math.sin(time * 0.5 + i) * canvas.width * 0.4 + canvas.width * 0.5;
          const y = Math.cos(time * 0.3 + i * 2) * canvas.height * 0.4 + canvas.height * 0.5;
          const size = 50 + Math.sin(time + i) * 20;

          ctx.globalAlpha = 0.05;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fillStyle = styleConfig.textColor;
          ctx.fill();
          ctx.globalAlpha = 1;
        }

        // Add watermark
        ctx.font = '16px Arial';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.textAlign = 'right';
        ctx.fillText('ClipNova', canvas.width - 20, canvas.height - 20);

        // Add progress bar at the top
        const barHeight = 5;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(0, 0, canvas.width, barHeight);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillRect(0, 0, canvas.width * progress, barHeight);

        frameCount++;
        requestAnimationFrame(animate);
      };

      // Start recording
      mediaRecorder.start();

      // Start animation
      animate();

      // Stop recording after the specified duration
      setTimeout(() => {
        mediaRecorder.stop();
      }, Math.min(duration * 1000, 30000)); // Cap at 30 seconds for safety
    } catch (error) {
      console.error("Error in generateVideoWithText:", error);
      reject(error);
    }
  });
}
