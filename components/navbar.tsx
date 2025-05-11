"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/hooks/use-translation"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ModeToggle } from "@/components/mode-toggle"
import { Menu, X } from "lucide-react"

export function Navbar() {
  const { t } = useTranslation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/80 backdrop-blur-md py-2 shadow-md" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 bg-emerald-500 rounded-full opacity-70 animate-pulse"></div>
            <div className="absolute inset-1 bg-background rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-emerald-500 rounded-sm rotate-45"></div>
            </div>
          </div>
          <span className="text-xl font-bold">
            Clip<span className="text-emerald-500">Nova</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/community" className="text-foreground/80 hover:text-foreground transition-colors">
            {t("community_creations")}
          </Link>
          <Link href="/tools" className="text-foreground/80 hover:text-foreground transition-colors">
            {t("ai_video_tools")}
          </Link>
          <Link href="/blog" className="text-foreground/80 hover:text-foreground transition-colors">
            {t("blog")}
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <LanguageSwitcher />
          <ModeToggle />
          <Link href="/auth/signin">
            <Button variant="outline">{t("sign_in")}</Button>
          </Link>
          <Link href="/auth/signup">
            <Button variant="default" className="bg-emerald-500 hover:bg-emerald-600">
              {t("sign_up")}
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-3">
          <ModeToggle />
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md shadow-lg">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link
              href="/community"
              className="py-2 text-foreground/80 hover:text-foreground transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("community_creations")}
            </Link>
            <Link
              href="/tools"
              className="py-2 text-foreground/80 hover:text-foreground transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("ai_video_tools")}
            </Link>
            <Link
              href="/blog"
              className="py-2 text-foreground/80 hover:text-foreground transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("blog")}
            </Link>
            <div className="flex flex-col gap-2 pt-2 border-t border-border">
              <LanguageSwitcher />
              <Link href="/auth/signin" className="w-full" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" className="w-full">
                  {t("sign_in")}
                </Button>
              </Link>
              <Link href="/auth/signup" className="w-full" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full bg-emerald-500 hover:bg-emerald-600">{t("sign_up")}</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
