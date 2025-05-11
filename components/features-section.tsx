"use client"

import { useEffect } from "react"
import { useInView } from "react-intersection-observer"
import { motion, useAnimation } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { useTranslation } from "@/hooks/use-translation"
import { Wand2, Video, Sparkles, Zap, Globe, Lock } from "lucide-react"
import { AutoTranslate } from "@/components/ui/auto-translate"

export function FeaturesSection() {
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

  const features = [
    {
      icon: Wand2,
      title: t("feature_ai_powered_creation_title"),
      description: t("feature_ai_powered_creation_desc"),
    },
    {
      icon: Video,
      title: t("feature_professional_templates_title"),
      description: t("feature_professional_templates_desc"),
    },
    {
      icon: Sparkles,
      title: t("feature_custom_animations_title"),
      description: t("feature_custom_animations_desc"),
    },
    {
      icon: Zap,
      title: t("feature_lightning_fast_title"),
      description: t("feature_lightning_fast_desc"),
    },
    {
      icon: Globe,
      title: t("feature_multi_language_support_title"),
      description: t("feature_multi_language_support_desc"),
    },
    {
      icon: Lock,
      title: t("feature_secure_private_title"),
      description: t("feature_secure_private_desc"),
    },
  ]

  return (
    <section className="py-20 bg-background/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <AutoTranslate
            as="h2"
            translationKey="features_title"
            className="text-3xl md:text-4xl font-bold mb-4"
          />
          <AutoTranslate
            as="p"
            translationKey="features_subtitle"
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          />
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full border border-border/50 hover:border-emerald-500/50 transition-all">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 mb-4">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
