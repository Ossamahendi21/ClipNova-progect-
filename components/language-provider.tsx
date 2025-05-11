"use client"

import type React from "react"

import { createContext, useState, useEffect, useContext } from "react"
import { translations } from "@/lib/translations"

type Language = "en" | "fr" | "ar"

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string, options?: { [key: string]: string | number }) => string
  isRtl: boolean
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key) => key,
  isRtl: false,
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")
  const [isRtl, setIsRtl] = useState(false)

  // Initial language detection when component mounts
  useEffect(() => {
    const detectInitialLanguage = () => {
      try {
        const savedLanguage = localStorage.getItem("language") as Language
        if (savedLanguage && ["en", "fr", "ar"].includes(savedLanguage)) {
          return savedLanguage
        }
      } catch (error) {
        console.error("Error accessing localStorage:", error)
      }
      
      // Default to browser language if available and supported
      try {
        const browserLang = navigator.language.split("-")[0] as Language
        if (["en", "fr", "ar"].includes(browserLang)) {
          return browserLang
        }
      } catch (error) {
        console.error("Error detecting browser language:", error)
      }
      
      return "en" // Default fallback
    }

    const initialLang = detectInitialLanguage()
    setLanguage(initialLang)
    setIsRtl(initialLang === "ar")
  }, [])

  // Apply language and direction changes
  useEffect(() => {
    const applyLanguageChanges = (lang: Language) => {
      const isArabic = lang === "ar"
      
      // Set direction and language attributes
      document.documentElement.dir = isArabic ? "rtl" : "ltr"
      document.documentElement.lang = lang
      document.documentElement.classList.toggle("rtl", isArabic)
      
      // Add special RTL class for additional styling and fixes
      document.body.classList.toggle("rtl-layout", isArabic)
      
      // Update RTL state
      setIsRtl(isArabic)
    }
    
    applyLanguageChanges(language)
  }, [language])

  const handleSetLanguage = (lang: Language) => {
    try {
      // Save to localStorage for persistence
      localStorage.setItem("language", lang)
    } catch (error) {
      console.error("Error saving language to localStorage:", error)
    }
    
    // Update state
    setLanguage(lang)
  }

  const t = (key: string, options?: { [key: string]: string | number }): string => {
    // Get translation or fall back to key
    const translation = translations[language]?.[key as keyof typeof translations[typeof language]] || key

    // Handle interpolation
    if (options) {
      return Object.entries(options).reduce((acc, [k, v]) => {
        return acc.replace(new RegExp(`{{${k}}}`, "g"), String(v))
      }, translation)
    }

    return translation
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, isRtl }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguageContext = () => useContext(LanguageContext)
