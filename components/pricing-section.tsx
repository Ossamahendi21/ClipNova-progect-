"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useTranslation } from "@/hooks/use-translation"
import { Check } from "lucide-react"

export function PricingSection() {
  const { t } = useTranslation()
  const [isAnnual, setIsAnnual] = useState(true)

  const plans = [
    {
      name: t("pricing_plan_free_name"),
      description: t("pricing_plan_free_desc"),
      price: {
        monthly: 0,
        annual: 0,
      },
      features: [
        t("pricing_plan_free_feature_1"),
        t("pricing_plan_free_feature_2"),
        t("pricing_plan_free_feature_3"),
        t("pricing_plan_free_feature_4"),
      ],
      cta: t("pricing_plan_free_cta"),
      popular: false,
    },
    {
      name: t("pricing_plan_pro_name"),
      description: t("pricing_plan_pro_desc"),
      price: {
        monthly: 19,
        annual: 15,
      },
      features: [
        t("pricing_plan_pro_feature_1"),
        t("pricing_plan_pro_feature_2"),
        t("pricing_plan_pro_feature_3"),
        t("pricing_plan_pro_feature_4"),
        t("pricing_plan_pro_feature_5"),
        t("pricing_plan_pro_feature_6"),
      ],
      cta: t("pricing_plan_pro_cta"),
      popular: true,
    },
    {
      name: t("pricing_plan_business_name"),
      description: t("pricing_plan_business_desc"),
      price: {
        monthly: 49,
        annual: 39,
      },
      features: [
        t("pricing_plan_business_feature_1"),
        t("pricing_plan_business_feature_2"),
        t("pricing_plan_business_feature_3"),
        t("pricing_plan_business_feature_4"),
        t("pricing_plan_business_feature_5"),
        t("pricing_plan_business_feature_6"),
      ],
      cta: t("pricing_plan_business_cta"),
      popular: false,
    },
  ]

  return (
    <section className="py-20 bg-background/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("pricing_title")}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("pricing_subtitle")}
          </p>

          <div className="flex items-center justify-center mt-8">
            <span className={`mr-2 ${!isAnnual ? "font-medium" : "text-muted-foreground"}`}>{t("pricing_monthly")}</span>
            <Switch checked={isAnnual} onCheckedChange={setIsAnnual} />
            <span className={`ml-2 ${isAnnual ? "font-medium" : "text-muted-foreground"}`}>
              {t("pricing_annual")} <span className="text-emerald-500 text-sm">({t("pricing_save_20")})</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative ${
                plan.popular
                  ? "border-emerald-500 shadow-lg shadow-emerald-500/10"
                  : "border-border/50 hover:border-emerald-500/50"
              } transition-all`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                  {t("pricing_most_popular")}
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <span className="text-4xl font-bold">${isAnnual ? plan.price.annual : plan.price.monthly}</span>
                  {plan.price.monthly > 0 && <span className="text-muted-foreground">/ {t("pricing_per_month")}</span>}
                </div>
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-emerald-500 mr-2 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className={`w-full ${
                    plan.popular
                      ? "bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
                      : ""
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
