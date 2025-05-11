export function RecentActivity() {
  const activities = [
    {
      id: 1,
      type: "video_created",
      title: "Product Demo",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "video_shared",
      title: "Social Media Ad",
      time: "Yesterday",
    },
    {
      id: 3,
      type: "comment_received",
      title: "Tutorial Video",
      time: "3 days ago",
      comment: "Great tutorial! Very helpful.",
    },
    {
      id: 4,
      type: "subscription_renewed",
      plan: "Pro",
      time: "1 week ago",
    },
  ]

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
            {activity.type === "video_created" && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            )}
            {activity.type === "video_shared" && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
            )}
            {activity.type === "comment_received" && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            )}
            {activity.type === "subscription_renewed" && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">
              {activity.type === "video_created" && `Created "${activity.title}" video`}
              {activity.type === "video_shared" && `Shared "${activity.title}" video`}
              {activity.type === "comment_received" && `Received comment on "${activity.title}"`}
              {activity.type === "subscription_renewed" && `${activity.plan} subscription renewed`}
            </p>
            {activity.type === "comment_received" && activity.comment && (
              <p className="text-xs text-muted-foreground mt-1 italic">"{activity.comment}"</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
