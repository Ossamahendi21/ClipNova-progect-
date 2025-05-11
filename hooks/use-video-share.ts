import { useState } from "react"

interface ShareOptions {
  title: string
  url: string
  platform?: "facebook" | "twitter" | "linkedin" | "whatsapp" | "email"
}

export function useVideoShare() {
  const [isSharing, setIsSharing] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const shareVideo = async ({ title, url, platform }: ShareOptions) => {
    try {
      setIsSharing(true)

      if (platform) {
        let shareUrl = ""

        switch (platform) {
          case "facebook":
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              url
            )}`
            break
          case "twitter":
            shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
              title
            )}&url=${encodeURIComponent(url)}`
            break
          case "linkedin":
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
              url
            )}`
            break
          case "whatsapp":
            shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
              `${title} ${url}`
            )}`
            break
          case "email":
            shareUrl = `mailto:?subject=${encodeURIComponent(
              title
            )}&body=${encodeURIComponent(url)}`
            break
        }

        window.open(shareUrl, "_blank")
      } else if (navigator.share) {
        await navigator.share({
          title,
          url
        })
      } else {
        await navigator.clipboard.writeText(url)
      }
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setIsSharing(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      setIsSharing(true)
      await navigator.clipboard.writeText(text)
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setIsSharing(false)
    }
  }

  return {
    isSharing,
    error,
    shareVideo,
    copyToClipboard
  }
} 