import { videoTools } from "@/lib/video-tools-data";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export function VideoToolsGrid({ onSelect }: { onSelect: (toolId: string) => void }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {videoTools.map(tool => (
          <Card
            key={tool.id}
            className="flex flex-col items-start p-4 cursor-pointer hover:border-primary transition"
            onClick={() => onSelect(tool.id)}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{tool.icon}</span>
              <span className="font-medium">{tool.name}</span>
              {tool.status && (
                <Badge variant="secondary" className={`ml-2 text-xs ${tool.status === "new" ? "bg-green-500/10 text-green-500 hover:bg-green-500/20" : ""}`}>
                  {tool.status}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{tool.description}</p>
          </Card>
        ))}
    </div>
  );
}