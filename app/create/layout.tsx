import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Create Video - ClipNova",
  description: "Create and edit videos with our powerful AI-powered editor"
}

interface CreateLayoutProps {
  children: React.ReactNode
}

export default function CreateLayout({ children }: CreateLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">{children}</main>
    </div>
  )
} 