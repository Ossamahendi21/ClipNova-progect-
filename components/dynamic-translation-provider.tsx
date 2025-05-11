"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useLanguageContext } from './language-provider'
import { translations } from '@/lib/translations'

// Define a context for dynamic translation
interface DynamicTranslationContextType {
  dynamicTranslate: (text: string) => string
  addDynamicTranslation: (key: string, translations: Record<string, string>) => void
  getDynamicTranslationKey: (text: string) => string
}

const DynamicTranslationContext = createContext<DynamicTranslationContextType>({
  dynamicTranslate: (text) => text,
  addDynamicTranslation: () => {},
  getDynamicTranslationKey: () => '',
})

// Create a provider component for dynamic translation
export function DynamicTranslationProvider({ children }: { children: ReactNode }) {
  const { language } = useLanguageContext()
  const [dynamicTranslations, setDynamicTranslations] = useState<Record<string, Record<string, string>>>({})
  
  // Load any saved dynamic translations from localStorage
  useEffect(() => {
    try {
      const savedTranslations = localStorage.getItem('dynamicTranslations')
      if (savedTranslations) {
        setDynamicTranslations(JSON.parse(savedTranslations))
      }
    } catch (error) {
      console.error('Error loading dynamic translations:', error)
    }
  }, [])
  
  // Save dynamic translations to localStorage whenever they change
  useEffect(() => {
    try {
      if (Object.keys(dynamicTranslations).length > 0) {
        localStorage.setItem('dynamicTranslations', JSON.stringify(dynamicTranslations))
      }
    } catch (error) {
      console.error('Error saving dynamic translations:', error)
    }
  }, [dynamicTranslations])
  
  // Function to add a new dynamic translation
  const addDynamicTranslation = (key: string, newTranslations: Record<string, string>) => {
    setDynamicTranslations(prev => ({
      ...prev,
      [key]: newTranslations
    }))
  }
  
  // Generate a unique key for a text string
  const getDynamicTranslationKey = (text: string): string => {
    // Create a simplified key based on the text
    const key = text
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_')
      .slice(0, 50)
    
    return `dyn_${key}_${Math.floor(Math.random() * 1000)}`
  }
  
  // Function to translate text dynamically
  const dynamicTranslate = (text: string): string => {
    // First check if this is a known translation key
    if ((translations[language] as any)[text]) {
      return (translations[language] as any)[text]
    }
    
    // Then check dynamic translations
    for (const [key, translationSet] of Object.entries(dynamicTranslations)) {
      // If the original English text matches
      if (translationSet['en'] === text) {
        // Return the translation for the current language if available
        return translationSet[language] || text
      }
      
      // If text is already in the target language but we have the key
      if (translationSet[language] === text) {
        return text
      }
    }
    
    // If not found, return original text
    return text
  }
  
  return (
    <DynamicTranslationContext.Provider 
      value={{ 
        dynamicTranslate, 
        addDynamicTranslation, 
        getDynamicTranslationKey 
      }}
    >
      {children}
    </DynamicTranslationContext.Provider>
  )
}

// Hook to use dynamic translation
export const useDynamicTranslation = () => useContext(DynamicTranslationContext) 