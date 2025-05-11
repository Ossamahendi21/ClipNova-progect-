"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"
import { useLanguageContext } from "@/components/language-provider"

export function LanguageSwitcher() {
  const { language, setLanguage, isRtl } = useLanguageContext()
  const [open, setOpen] = useState(false)

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "ar", name: "العربية", flag: "🇸🇦" },
  ]

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 relative" aria-label="Switch language">
          <Globe className="h-4 w-4" />
          <span className="absolute -bottom-1 -right-1 text-xs font-bold">
            {language.toUpperCase()}
          </span>
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={isRtl ? "start" : "end"} className="min-w-[150px]">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => {
              setLanguage(lang.code as "en" | "fr" | "ar")
              setOpen(false)
            }}
            className={`flex items-center justify-between px-3 py-2 cursor-pointer ${
              language === lang.code ? "bg-accent font-medium" : ""
            }`}
          >
            <span className="flex items-center gap-2">
              <span className="text-sm">{lang.flag}</span>
              <span>{lang.name}</span>
            </span>
            {language === lang.code && (
              <span className="ml-2 h-2 w-2 rounded-full bg-emerald-500"></span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
