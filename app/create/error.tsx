"use client"

import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

interface ErrorProps {
  error: Error
  reset: () => void
}

export default function CreateError({ error, reset }: ErrorProps) {
  return (
    <div className="container py-8">
      <div className="mx-auto max-w-md text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
        <h2 className="mt-4 text-2xl font-bold">Something went wrong</h2>
        <p className="mt-2 text-muted-foreground">
          {error.message || "An error occurred while loading the video editor."}
        </p>
        <Button
          variant="outline"
          onClick={reset}
          className="mt-6"
        >
          Try again
        </Button>
      </div>
    </div>
  )
} 