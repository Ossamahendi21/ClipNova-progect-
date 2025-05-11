"use client"

import { useEffect } from "react"
import { useInView } from "react-intersection-observer"
import { motion, useAnimation } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { useTranslation } from "@/hooks/use-translation"
import { Star } from "lucide-react"

export function TestimonialsSection() {
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

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Director",
      company: "TechCorp",
      content:
        "ClipNova has revolutionized our marketing strategy. We can now create professional videos in minutes that used to take days with traditional methods.",
      avatar: "/placeholder.svg?height=60&width=60",
      stars: 5,
    },
    {
      name: "Michael Chen",
      role: "Content Creator",
      company: "CreativeMinds",
      content:
        "As a content creator, time is everything. ClipNova helps me produce high-quality videos quickly, allowing me to focus on what matters - creating great content.",
      avatar: "/placeholder.svg?height=60&width=60",
      stars: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "Social Media Manager",
      company: "BrandBoost",
      content:
        "The templates are amazing and the AI features save me hours of work. Our engagement has increased by 45% since we started using ClipNova.",
      avatar: "/placeholder.svg?height=60&width=60",
      stars: 4,
    },
  ]

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied creators who have transformed their video content with ClipNova
          </p>
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full border border-border/50">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-center gap-2 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < testimonial.stars ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-foreground mb-6 flex-grow">{testimonial.content}</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted overflow-hidden">
                      <img
                        src={testimonial.avatar || "/placeholder.svg"}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}, {testimonial.company}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
