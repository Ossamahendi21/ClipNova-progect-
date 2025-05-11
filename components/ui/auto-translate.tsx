"use client"

import React, { ElementType, HTMLAttributes, ReactNode } from "react"
import { useTranslation } from "@/hooks/use-translation"

interface AutoTranslateProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType
  translationKey: string
  values?: Record<string, string | number>
  fallback?: string
  children?: ReactNode
}

/**
 * AutoTranslate - A utility component for easy translation
 * 
 * Usage examples:
 * <AutoTranslate translationKey="navigation.home" as="h1" className="text-lg" />
 * <AutoTranslate translationKey="greeting" values={{ name: "John" }} />
 * <AutoTranslate translationKey="not.found" fallback="Default text if key missing">
 *   This will be shown only during server rendering (before hydration)
 * </AutoTranslate>
 */
export function AutoTranslate({
  as: Component = "span",
  translationKey,
  values,
  fallback,
  children,
  ...props
}: AutoTranslateProps) {
  const { t } = useTranslation()
  
  const translatedText = t(translationKey, values)
  const displayText = translatedText === translationKey ? fallback || translationKey : translatedText
  
  return (
    <Component {...props}>
      {displayText}
    </Component>
  )
}

/**
 * AutoTranslatePlural - A utility component for translations with pluralization
 * 
 * Usage example:
 * <AutoTranslatePlural 
 *   count={3} 
 *   singular="pricing_one_month" 
 *   plural="pricing_many_months" 
 *   values={{ count: 3 }} 
 * />
 */
export function AutoTranslatePlural({
  as: Component = "span",
  count,
  singular,
  plural,
  values = {},
  ...props
}: AutoTranslateProps & {
  count: number
  singular: string
  plural: string
}) {
  const { t } = useTranslation()
  
  const translationKey = count === 1 ? singular : plural
  const mergedValues = { ...values, count }
  
  const translatedText = t(translationKey, mergedValues)
  
  return (
    <Component {...props}>
      {translatedText}
    </Component>
  )
} 