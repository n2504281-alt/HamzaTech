"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal } from "@/components/animations/reveal";

export function FAQ() {
  const faqs = [
    {
      q: "What makes the Aura X1 active noise cancellation unique?",
      a: "The Aura X1 utilizes a quad-microphone array with proprietary digital sound processors (DSP) to analyze environment wave structures in real-time, cancelling up to -45dB of ambient frequencies. The cancellation is adaptive, meaning it shifts strength between quiet rooms and loud transit spaces to minimize inner-ear pressure.",
    },
    {
      q: "What is the exact battery configuration and recharge cycle?",
      a: "Aura X1 has a high-density 850mAh battery. You get up to 40 hours of playback with ANC active, and 55 hours with ANC switched off. Via USB-C, a quick 10-minute charge gives you 5 hours of listening time, while a full charge from 0% takes approximately 90 minutes.",
    },
    {
      q: "Which codecs and connection options are supported?",
      a: "The Aura X1 supports high-resolution LDAC, AAC, SBC, and aptX Adaptive codecs over Bluetooth 5.4. It also features a dual-device multipoint mode to switch seamlessly between your laptop and phone. If you prefer analog sound, you can connect via a 3.5mm Aux input or use USB-C audio mode.",
    },
    {
      q: "How does the interactive Aura LED glow ring function?",
      a: "The external glass panels feature LED rings with customizable breathing and pulse patterns. Using the tactile dial controls, you can adjust the brightness, switch the glow color, sync them to pulse with the bass, or turn them off completely to conserve battery.",
    },
    {
      q: "What is covered under the 3-year warranty plan?",
      a: "Our warranty covers all structural material defects, battery degradation below 80% capacity, and physical control panel issues. In addition, we cover all shipping costs for repair or complete product replacement under the active warranty duration.",
    },
  ];

  return (
    <section id="faq" className="relative w-full py-20 md:py-28 bg-background border-t border-border overflow-hidden">
      <div className="absolute top-1/3 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Title Block */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Reveal direction="down" delay={0.1}>
            <span className="text-xs font-bold text-accent uppercase tracking-widest bg-accent/10 px-3 py-1 rounded-full">
              Common Queries
            </span>
          </Reveal>
          <Reveal direction="up" delay={0.2}>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground mt-4 mb-6 leading-tight">
              Frequently Asked Questions
            </h2>
          </Reveal>
          <Reveal direction="up" delay={0.3}>
            <p className="text-muted-foreground text-base sm:text-lg font-light leading-relaxed">
              Find detailed explanations regarding the operation, connectivity, and specifications of the headphones.
            </p>
          </Reveal>
        </div>

        {/* Accordion Component */}
        <Reveal direction="up" delay={0.4}>
          <div className="max-w-3xl mx-auto">
            <Accordion className="w-full space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="glass-card border border-border/50 rounded-2xl px-6 md:px-8 py-2 overflow-hidden transition-all duration-300"
                >
                  <AccordionTrigger className="font-heading text-base md:text-lg font-semibold text-foreground text-left py-4 hover:no-underline transition-all hover:text-accent">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm font-light leading-relaxed pb-5 pt-1 border-t border-border/20 mt-2">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
