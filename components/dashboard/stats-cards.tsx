"use client"

import { useEffect } from "react"
import { useInView } from "react-intersection-observer"
import { motion, useAnimation } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Video, Eye, TrendingUp, Clock } from "lucide-react"

export function StatsCards() {
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

  const stats = [
    {
      title: "Total Videos",
      value: "12",
      icon: Video,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/20",
    },
    {
      title: "Total Views",
      value: "3.2k",
      icon: Eye,
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/20",
    },
    {
      title: "Growth",
      value: "+24%",
      icon: TrendingUp,
      color: "text-green-500",
      bgColor: "bg-green-500/20",
    },
    {
      title: "Avg. Watch Time",
      value: "1:45",
      icon: Clock,
      color: "text-purple-500",
      bgColor: "bg-purple-500/20",
    },
  ]

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={controls}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {stats.map((stat, index) => (
        <motion.div key={index} variants={itemVariants}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                </div>
                <div
                  className={`w-12 h-12 rounded-full ${stat.bgColor} flex items-center justify-center ${stat.color}`}
                >
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
}
