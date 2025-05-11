import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Flag, MoreVertical, ThumbsUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Comment {
  id: string
  user: {
    name: string
    avatar: string
  }
  content: string
  likes: number
  replies: number
  createdAt: string
  isLiked: boolean
}

interface VideoCommentsProps {
  videoId: string
  comments: Comment[]
  onAddComment: (content: string) => void
  onLikeComment: (commentId: string) => void
  onReportComment: (commentId: string) => void
}

export function VideoComments({
  videoId,
  comments,
  onAddComment,
  onLikeComment,
  onReportComment
}: VideoCommentsProps) {
  const [newComment, setNewComment] = useState("")

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (newComment.trim()) {
      onAddComment(newComment.trim())
      setNewComment("")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Comments</h2>
        <p className="text-muted-foreground mt-1">
          {comments.length} {comments.length === 1 ? "comment" : "comments"}
        </p>
      </div>

      <form onSubmit={handleSubmitComment} className="space-y-4">
        <Textarea
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[100px]"
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={!newComment.trim()}>
            Comment
          </Button>
        </div>
      </form>

      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            <Avatar>
              <AvatarImage src={comment.user.avatar} />
              <AvatarFallback>
                {comment.user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{comment.user.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.createdAt), {
                      addSuffix: true
                    })}
                  </p>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => onReportComment(comment.id)}
                      className="text-destructive"
                    >
                      <Flag className="mr-2 h-4 w-4" />
                      Report
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <p className="text-sm">{comment.content}</p>

              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1"
                  onClick={() => onLikeComment(comment.id)}
                >
                  <ThumbsUp
                    className={`h-4 w-4 ${
                      comment.isLiked ? "fill-current" : ""
                    }`}
                  />
                  {comment.likes}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8"
                >
                  Reply
                </Button>
              </div>

              {comment.replies > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8"
                >
                  View {comment.replies} {comment.replies === 1 ? "reply" : "replies"}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 