"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { VideoToolsGrid } from "@/components/create/video-tools-grid";
import { ToolForm } from "@/components/create/tool-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function CreatePage() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const router = useRouter();

  const handleBackToDashboard = () => {
    router.push("/dashboard");
  };

  return (
    <div className="container py-8">
      {!selectedTool ? (
        <>
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBackToDashboard}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Create a new video</h1>
              <p className="text-muted-foreground mt-2">
                Select a tool and pick your options to create your video
              </p>
            </div>
          </div>
          <VideoToolsGrid onSelect={setSelectedTool} />
        </>
      ) : (
        <ToolForm toolId={selectedTool} onBack={() => setSelectedTool(null)} />
      )}
    </div>
  );
}
