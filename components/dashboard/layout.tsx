"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ModeToggle } from "@/components/mode-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useTranslation } from "@/hooks/use-translation"
import { Menu, Home, Video, Settings, Users, CreditCard, HelpCircle, LogOut, Bell } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AutoTranslate } from "@/components/ui/auto-translate"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { t, isRtl, rtlClass } = useTranslation()
  const pathname = usePathname()
  const router = useRouter()
  const [isMobile, setIsMobile] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)

    return () => {
      window.removeEventListener("resize", checkScreenSize)
    }
  }, [])

  const navigation = [
    { name: t("dashboard_nav_home"), href: "/dashboard", icon: Home },
    { name: t("dashboard_nav_videos"), href: "/dashboard/videos", icon: Video },
    { name: t("dashboard_nav_community"), href: "/dashboard/community", icon: Users },
    { name: t("dashboard_nav_billing"), href: "/dashboard/billing", icon: CreditCard },
    { name: t("dashboard_nav_settings"), href: "/dashboard/settings", icon: Settings },
    { name: t("dashboard_nav_help"), href: "/dashboard/help", icon: HelpCircle },
  ]

  const handleLogout = () => {
    // In a real app, you would handle logout logic here
    // For example: clearAuthToken(), clearUserSession(), etc.
    setTimeout(() => {
      router.push("/")
    }, 300)
  }

  const NavLinks = () => (
    <>
      <div className="px-3 py-2">
        <Link href="/" className="flex items-center gap-2 mb-6 px-3">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 bg-emerald-500 rounded-full opacity-70"></div>
            <div className="absolute inset-1 bg-background rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-emerald-500 rounded-sm rotate-45"></div>
            </div>
          </div>
          <span className="text-xl font-bold">
            Clip<span className="text-emerald-500">Nova</span>
          </span>
        </Link>
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground"
                }`}
                onClick={() => setIsOpen(false)}
              >
                <item.icon className={`h-5 w-5 ${isActive ? "text-emerald-500" : ""} ${isRtl ? "ml-1 order-1" : "mr-1 order-0"}`} />
                {item.name}
              </Link>
            )
          })}
        </div>
      </div>
      <div className="px-3 py-2 mt-auto">
        <div className="px-3 py-2 rounded-md text-sm font-medium text-muted-foreground">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="John Doe" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-foreground">John Doe</p>
                <p className="text-xs text-muted-foreground">john@example.com</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ModeToggle />
          </div>
          <Button
            variant="ghost"
            className={`w-full justify-start mt-4 px-3 text-red-500 hover:text-red-600 hover:bg-red-500/10`}
            onClick={handleLogout}
          >
            <LogOut className={`h-4 w-4 ${isRtl ? "ml-2 order-1" : "mr-2 order-0"}`} />
            <AutoTranslate translationKey="dashboard_logout" />
          </Button>
        </div>
      </div>
    </>
  )

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar for desktop */}
      {!isMobile && (
        <div className={`hidden lg:flex lg:flex-col lg:w-64 lg:fixed ${isRtl ? "lg:right-0 border-l" : "lg:left-0 border-r"} lg:inset-y-0`}>
          <div className="flex flex-col h-full py-4">
            <NavLinks />
          </div>
        </div>
      )}

      {/* Mobile sidebar */}
      {isMobile && (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className={`lg:hidden fixed top-4 z-40 ${isRtl ? "right-4" : "left-4"}`}
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">{t("dashboard_toggle_menu")}</span>
            </Button>
          </SheetTrigger>
          <SheetContent side={isRtl ? "right" : "left"} className="p-0 flex flex-col h-full">
            <div className="sr-only">
              <h2>Navigation Menu</h2>
            </div>
            <NavLinks />
          </SheetContent>
        </Sheet>
      )}

      {/* Main content */}
      <div className={`flex flex-col flex-1 ${!isMobile ? (isRtl ? "lg:pr-64" : "lg:pl-64") : ""}`}>
        {/* Top navigation */}
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 border-b bg-background/95 backdrop-blur">
          {isMobile && <div className="w-6" />}
          <h1 className="text-xl font-bold lg:hidden">
            Clip<span className="text-emerald-500">Nova</span>
          </h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className={`absolute top-1 ${isRtl ? "left-1" : "right-1"} w-2 h-2 bg-emerald-500 rounded-full`}></span>
              </Button>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="John Doe" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className={isRtl ? "text-right" : "text-left"}>
                <p className="text-sm font-medium text-foreground">John Doe</p>
                <p className="text-xs text-muted-foreground">john@example.com</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
