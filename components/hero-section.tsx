"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/hooks/use-translation"
import { motion } from "framer-motion"

export function HeroSection() {
  const { t } = useTranslation()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/20 via-background to-background z-0"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col gap-6"
          >
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              {t("create_viral")} <br />
              {t("videos_in")}{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                {t("minutes")}
              </span>
            </h1>
            <p className="text-lg text-foreground/80 max-w-lg">{t("hero_description")}</p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Link href="/create">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white shadow-lg shadow-emerald-500/20 w-full sm:w-auto"
                >
                  {t("create_videos_now")}
                </Button>
              </Link>
              <p className="text-sm text-foreground/60 mt-2">{t("no_credit_card_required")}</p>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-300 to-cyan-300 border-2 border-background flex items-center justify-center text-xs font-bold text-background"
                  >
                    {i}
                  </div>
                ))}
              </div>
              <p className="text-sm text-foreground/80">{t("loved_by_users", { count: "14,500+" })}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.9 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="relative h-[500px] w-full">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[500px] rotate-[-5deg] rounded-2xl overflow-hidden shadow-xl shadow-emerald-500/20 z-20">
                <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-cyan-400 p-1 rounded-2xl">
                  <div className="w-full h-full bg-background rounded-xl overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-emerald-900/20 to-cyan-900/20 flex items-center justify-center">
                      <div className="text-center p-4">
                        <div className="w-16 h-16 mx-auto bg-emerald-500 rounded-full flex items-center justify-center mb-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <h3 className="text-lg font-bold mb-2">{t("your_video")}</h3>
                        <p className="text-sm text-foreground/70">{t("video_ready_message")}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 translate-x-[-100px] translate-y-[-50px] w-[280px] h-[500px] rotate-[-15deg] rounded-2xl overflow-hidden shadow-xl shadow-emerald-500/10 z-10">
                <div className="w-full h-full bg-gradient-to-br from-emerald-400/80 to-cyan-400/80 p-1 rounded-2xl">
                  <div className="w-full h-full bg-background rounded-xl overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-emerald-900/10 to-cyan-900/10"></div>
                  </div>
                </div>
              </div>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 translate-x-[100px] translate-y-[50px] w-[280px] h-[500px] rotate-[15deg] rounded-2xl overflow-hidden shadow-xl shadow-emerald-500/10 z-10">
                <div className="w-full h-full bg-gradient-to-br from-cyan-400/80 to-emerald-400/80 p-1 rounded-2xl">
                  <div className="w-full h-full bg-background rounded-xl overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-cyan-900/10 to-emerald-900/10"></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
