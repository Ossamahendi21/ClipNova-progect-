"use client"

import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Sparkles } from "lucide-react"

interface GenerationProgressProps {
  progress: number
  step: string
}

export function GenerationProgress({ progress, step }: GenerationProgressProps) {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0)
  }, [])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-emerald-500" />
          Generating Your Video
        </CardTitle>
        <CardDescription>Please wait while we create your masterpiece</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        <div className="text-sm text-muted-foreground">
          <p>Current step: {step}</p>
        </div>
      </CardContent>
    </Card>
  )
}
