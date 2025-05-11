"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useTranslation } from "@/hooks/use-translation"

export function FAQSection() {
  const { t } = useTranslation()

  const faqs = [
    {
      question: t("faq_1_question"),
      answer: t("faq_1_answer"),
    },
    {
      question: t("faq_2_question"),
      answer: t("faq_2_answer"),
    },
    {
      question: t("faq_3_question"),
      answer: t("faq_3_answer"),
    },
    {
      question: t("faq_4_question"),
      answer: t("faq_4_answer"),
    },
    {
      question: t("faq_5_question"),
      answer: t("faq_5_answer"),
    },
    {
      question: t("faq_6_question"),
      answer: t("faq_6_answer"),
    },
  ]

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("faq_title")}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("faq_subtitle")}
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
