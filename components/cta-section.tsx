"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/hooks/use-translation"
import { Sparkles } from "lucide-react"

export function CTASection() {
  const { t } = useTranslation()

  return (
    <section className="py-20 bg-gradient-to-br from-emerald-900/20 via-background to-cyan-900/20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Create Amazing Videos?</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Join thousands of creators and businesses who are already using ClipNova to create stunning videos in minutes.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signup">
            <Button
              size="lg"
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white shadow-lg shadow-emerald-500/20 w-full sm:w-auto"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Get Started for Free
            </Button>
          </Link>
          <Link href="/demo">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Watch Demo
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
