"use client"

import { useLanguageContext } from "@/components/language-provider"
import { ReactNode } from "react"

export function useTranslation() {
  const context = useLanguageContext()

  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider")
  }

  // Enhanced translation helpers
  const enhancedContext = {
    ...context,
    
    // Helper for dynamically rendering text based on direction
    rtlAware: (ltrContent: ReactNode, rtlContent?: ReactNode): ReactNode => {
      return context.isRtl && rtlContent !== undefined ? rtlContent : ltrContent
    },
    
    // Helper for conditionally applying RTL-specific classes
    rtlClass: (baseClasses: string, rtlClasses: string): string => {
      return context.isRtl ? `${baseClasses} ${rtlClasses}` : baseClasses
    },
    
    // Convert numbers to localized format
    formatNumber: (num: number): string => {
      try {
        return new Intl.NumberFormat(context.language).format(num)
      } catch (error) {
        console.error("Error formatting number:", error)
        return num.toString()
      }
    },
    
    // Format date according to the selected language
    formatDate: (date: Date, options?: Intl.DateTimeFormatOptions): string => {
      try {
        const locale = context.language === 'en' ? 'en-US' : 
                      context.language === 'fr' ? 'fr-FR' : 
                      'ar-SA'
        return new Intl.DateTimeFormat(locale, options).format(date)
      } catch (error) {
        console.error("Error formatting date:", error)
        return date.toDateString()
      }
    }
  }

  return enhancedContext
}
