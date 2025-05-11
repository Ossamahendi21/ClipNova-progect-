import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { LanguageProvider } from "@/components/language-provider"
import { AuthProvider } from "./context/auth-context"

const inter = Inter({ subsets: ["latin", "latin-ext"] })

export const metadata: Metadata = {
  title: "ClipNova | إنشاء مقاطع فيديو رائجة في دقائق",
  description: "حوّل أفكارك الإبداعية إلى فيديوهات جذابة باستخدام الذكاء الاصطناعي. منصة احترافية لإنشاء المحتوى المرئي.",
  keywords: "إنشاء فيديو، ذكاء اصطناعي، محتوى مرئي، تحرير فيديوهات، وسائط اجتماعية",
  authors: [{ name: "فريق ClipNova", url: "https://clipnova.com/team" }],
  creator: "ClipNova AI",
  publisher: "ClipNova Inc.",
  openGraph: {
    type: "website",
    locale: "ar_SA",
    url: "https://clipnova.com/",
    title: "ClipNova | إنشاء مقاطع فيديو رائجة في دقائق",
    description: "حوّل أفكارك الإبداعية إلى فيديوهات جذابة باستخدام الذكاء الاصطناعي",
    siteName: "ClipNova",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ClipNova - منصة إنشاء فيديوهات بالذكاء الاصطناعي"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "ClipNova | إنشاء مقاطع فيديو رائجة في دقائق",
    description: "حوّل أفكارك الإبداعية إلى فيديوهات جذابة باستخدام الذكاء الاصطناعي",
    creator: "@clipnova",
    images: ["/twitter-image.jpg"]
  },
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  generator: "ClipNova AI Platform"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#10b981" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            <LanguageProvider>
              {children}
              <Toaster />
            </LanguageProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
