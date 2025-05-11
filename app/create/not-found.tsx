import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileQuestion } from "lucide-react"

export default function CreateNotFound() {
  return (
    <div className="container py-8">
      <div className="mx-auto max-w-md text-center">
        <FileQuestion className="mx-auto h-12 w-12 text-muted-foreground" />
        <h2 className="mt-4 text-2xl font-bold">Page not found</h2>
        <p className="mt-2 text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button
          variant="outline"
          asChild
          className="mt-6"
        >
          <Link href="/">Go back home</Link>
        </Button>
      </div>
    </div>
  )
} 