"use client"

import { useEffect } from "react"
import { useInView } from "react-intersection-observer"
import { motion, useAnimation } from "framer-motion"
import { useTranslation } from "@/hooks/use-translation"

const stats = [
  { id: 1, value: "240,909+", label: "videos_created" },
  { id: 2, value: "14,258+", label: "creators_using" },
  { id: 3, value: "400+", label: "creators_reached_views" },
  { id: 4, value: "32", label: "languages_supported" },
]

export function StatsSection() {
  const { t } = useTranslation()
  const controls = useAnimation()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  }

  return (
    <section className="py-16 bg-background/50">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.id}
              variants={itemVariants}
              className="bg-gradient-to-br from-background to-background/80 p-6 rounded-xl border border-border/50 shadow-lg shadow-emerald-500/5 text-center"
            >
              <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                {stat.value}
              </h3>
              <p className="text-foreground/70">{t(stat.label)}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
